-- Fix remaining functions without search_path protection

-- Update handle_new_user function with security hardening
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, login, country)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'login',
    NEW.raw_user_meta_data->>'country'
  );
  RETURN NEW;
END;
$function$;

-- Update get_user_frozen_balances function with security hardening
CREATE OR REPLACE FUNCTION public.get_user_frozen_balances(user_uuid uuid)
 RETURNS TABLE(frozen_balance numeric, frozen_usdt_balance numeric, unfreezing_in_days json[])
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Input validation
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Invalid user UUID provided';
  END IF;

  RETURN QUERY
  SELECT 
    p.frozen_balance,
    p.frozen_usdt_balance,
    ARRAY(
      SELECT json_build_object(
        'amount', t.amount,
        'days_left', EXTRACT(DAY FROM (t.frozen_until - NOW())),
        'unfreeze_date', to_char(t.frozen_until, 'DD/MM/YYYY'),
        'transaction_id', t.id
      )
      FROM transactions t
      WHERE t.user_id = user_uuid
      AND t.frozen_until IS NOT NULL
      AND t.frozen_until > NOW()
      ORDER BY t.frozen_until ASC
    ) as unfreezing_in_days
  FROM profiles p
  WHERE p.user_id = user_uuid;
END;
$function$;

-- Update get_user_transaction_totals function with security hardening
CREATE OR REPLACE FUNCTION public.get_user_transaction_totals(user_uuid uuid)
 RETURNS TABLE(total_deposits numeric, total_withdrawals numeric)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Input validation
  IF user_uuid IS NULL THEN
    RAISE EXCEPTION 'Invalid user UUID provided';
  END IF;

  RETURN QUERY
  SELECT 
    COALESCE(SUM(CASE WHEN type = 'deposit' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_deposits,
    COALESCE(SUM(CASE WHEN type = 'withdraw' AND status = 'completed' THEN amount ELSE 0 END), 0) as total_withdrawals
  FROM transactions
  WHERE user_id = user_uuid;
END;
$function$;

-- Update process_frozen_balances function with security hardening
CREATE OR REPLACE FUNCTION public.process_frozen_balances()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_record RECORD;
  total_unfrozen numeric;
BEGIN
  -- Find all users with transactions that have matured (frozen_until has passed)
  FOR user_record IN 
    SELECT DISTINCT user_id 
    FROM transactions 
    WHERE frozen_until IS NOT NULL 
    AND frozen_until <= NOW() 
    AND status = 'completed'
  LOOP
    -- Calculate total amount to unfreeze for this user
    SELECT COALESCE(SUM(amount), 0) INTO total_unfrozen
    FROM transactions
    WHERE user_id = user_record.user_id
    AND frozen_until IS NOT NULL
    AND frozen_until <= NOW()
    AND status = 'completed';
    
    IF total_unfrozen > 0 THEN
      -- Move funds from frozen_balance to balance
      UPDATE profiles
      SET 
        balance = balance + total_unfrozen,
        frozen_balance = frozen_balance - total_unfrozen
      WHERE user_id = user_record.user_id;
      
      -- Mark these transactions as unfrozen by setting frozen_until to NULL
      UPDATE transactions
      SET frozen_until = NULL
      WHERE user_id = user_record.user_id
      AND frozen_until IS NOT NULL
      AND frozen_until <= NOW()
      AND status = 'completed';
    END IF;
  END LOOP;
END;
$function$;

-- Update update_frozen_transaction_currency function with security hardening
CREATE OR REPLACE FUNCTION public.update_frozen_transaction_currency(transaction_id uuid, new_currency_type text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_transaction_record transactions%ROWTYPE;
BEGIN
  -- Input validation
  IF transaction_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid transaction ID');
  END IF;
  
  IF new_currency_type IS NULL OR new_currency_type NOT IN ('eth', 'usdt') THEN
    RETURN json_build_object('success', false, 'message', 'Invalid currency type');
  END IF;

  -- Get the transaction record (remove user_id check for admin access)
  SELECT * INTO v_transaction_record
  FROM public.transactions
  WHERE id = transaction_id;
  
  -- Check if transaction exists
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Transaction not found');
  END IF;
  
  -- Check if transaction is frozen (has frozen_until date)
  IF v_transaction_record.frozen_until IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Only frozen transactions can have their currency updated');
  END IF;
  
  -- Update the transaction currency
  UPDATE public.transactions
  SET currency_type = new_currency_type
  WHERE id = transaction_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Transaction currency updated successfully',
    'updated_currency', new_currency_type
  );
END;
$function$;