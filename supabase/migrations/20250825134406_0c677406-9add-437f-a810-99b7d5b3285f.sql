-- Fix remaining database functions with search_path security issue

-- Fix exchange_to_usdt function
CREATE OR REPLACE FUNCTION public.exchange_to_usdt(amount numeric, is_frozen boolean DEFAULT false)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_user_id uuid;
  v_balance numeric;
  v_frozen_balance numeric;
  v_rate numeric := 2074;
  v_usdt_amount numeric;
  v_currency_from text;
  v_currency_to text;
  v_transaction_id uuid;
BEGIN
  -- Get the user ID from the auth context
  v_user_id := auth.uid();
  
  -- Input validation
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Authentication required');
  END IF;
  
  IF amount IS NULL OR amount <= 0 OR amount > 1000000 THEN
    RETURN json_build_object('success', false, 'message', 'Invalid exchange amount');
  END IF;
  
  -- Get user's current balance
  SELECT balance, frozen_balance INTO v_balance, v_frozen_balance
  FROM public.profiles
  WHERE user_id = v_user_id;
  
  -- Check if the user has sufficient balance
  IF is_frozen THEN
    -- Exchange from frozen ETH balance
    IF v_frozen_balance < amount THEN
      RETURN json_build_object('success', false, 'message', 'Insufficient frozen balance');
    END IF;
    v_currency_from := 'eth';
    v_currency_to := 'usdt';
    
    -- Calculate USDT amount
    v_usdt_amount := amount * v_rate;
    
    -- Update balances
    UPDATE public.profiles
    SET frozen_balance = frozen_balance - amount,
        frozen_usdt_balance = frozen_usdt_balance + v_usdt_amount
    WHERE user_id = v_user_id;
    
    -- Record transaction
    INSERT INTO public.transactions (user_id, type, amount, status, is_frozen, is_frozen_exchange, currency_type)
    VALUES (v_user_id, 'exchange', amount, 'pending', true, true, v_currency_to)
    RETURNING id INTO v_transaction_id;
    
    -- Update all frozen transactions from ETH to USDT for this user
    UPDATE public.transactions 
    SET currency_type = v_currency_to
    WHERE user_id = v_user_id 
      AND frozen_until IS NOT NULL 
      AND currency_type = v_currency_from 
      AND type = 'sale';
  ELSE
    -- Exchange from regular ETH balance
    IF v_balance < amount THEN
      RETURN json_build_object('success', false, 'message', 'Insufficient balance');
    END IF;
    v_currency_from := 'eth';
    v_currency_to := 'usdt';
    
    -- Calculate USDT amount
    v_usdt_amount := amount * v_rate;
    
    -- Update balances
    UPDATE public.profiles
    SET balance = balance - amount,
        usdt_balance = usdt_balance + v_usdt_amount
    WHERE user_id = v_user_id;
    
    -- Record transaction
    INSERT INTO public.transactions (user_id, type, amount, status, currency_type)
    VALUES (v_user_id, 'exchange', amount, 'completed', v_currency_to)
    RETURNING id INTO v_transaction_id;
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Exchange completed successfully',
    'from_currency', v_currency_from,
    'to_currency', v_currency_to,
    'amount', amount,
    'usdt_amount', v_usdt_amount,
    'transaction_id', v_transaction_id
  );
END;
$function$;

-- Fix get_user_frozen_balances function
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

-- Fix get_user_transaction_totals function
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

-- Fix handle_new_user function
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