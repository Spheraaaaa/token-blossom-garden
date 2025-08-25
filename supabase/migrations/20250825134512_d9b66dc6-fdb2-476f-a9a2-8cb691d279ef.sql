-- Fix remaining functions with search_path issues

-- Fix unfreeze_balances function
CREATE OR REPLACE FUNCTION public.unfreeze_balances()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  -- If the transaction has a frozen_until date and it has passed
  IF OLD.frozen_until IS NOT NULL AND 
     OLD.frozen_until <= NOW() AND 
     NEW.frozen_until IS NULL THEN
     
    -- Check currency type to determine which balance to update
    IF OLD.currency_type = 'eth' OR OLD.currency_type IS NULL THEN
      -- Default to ETH if currency_type is not specified
      UPDATE public.profiles
      SET balance = balance + OLD.amount
      WHERE user_id = OLD.user_id;
    ELSIF OLD.currency_type = 'usdt' THEN
      -- Add to USDT balance if specified
      UPDATE public.profiles
      SET usdt_balance = usdt_balance + OLD.amount
      WHERE user_id = OLD.user_id;
    END IF;
    
    -- Log the unfreeze action
    INSERT INTO public.transaction_logs (
      transaction_id, 
      action, 
      details, 
      created_at
    ) VALUES (
      OLD.id, 
      'unfreeze', 
      json_build_object(
        'amount', OLD.amount, 
        'currency', COALESCE(OLD.currency_type, 'eth')
      ), 
      NOW()
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Fix process_expired_frozen_transactions function
CREATE OR REPLACE FUNCTION public.process_expired_frozen_transactions()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  affected_rows integer := 0;
BEGIN
  -- Find and update transactions where frozen_until has passed
  UPDATE public.transactions
  SET frozen_until = NULL
  WHERE frozen_until IS NOT NULL 
    AND frozen_until <= NOW();
  
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN affected_rows;
END;
$function$;

-- Fix scheduled_process_expired_frozen_transactions function
CREATE OR REPLACE FUNCTION public.scheduled_process_expired_frozen_transactions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_count integer;
BEGIN
  SELECT public.process_expired_frozen_transactions() INTO v_count;
  
  -- Log the execution
  INSERT INTO public.cron_job_logs (
    job_name,
    details,
    created_at
  ) VALUES (
    'process_expired_frozen_transactions',
    json_build_object('transactions_processed', v_count),
    NOW()
  );
  
EXCEPTION WHEN OTHERS THEN
  -- Log any errors
  INSERT INTO public.cron_job_logs (
    job_name,
    details,
    created_at
  ) VALUES (
    'process_expired_frozen_transactions',
    json_build_object('error', SQLERRM),
    NOW()
  );
END;
$function$;

-- Fix set_withdrawal_error_modal_flag function
CREATE OR REPLACE FUNCTION public.set_withdrawal_error_modal_flag(target_user_id uuid, show_modal boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Input validation
  IF target_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid user ID');
  END IF;
  
  -- Update the flag
  UPDATE public.profiles
  SET show_withdrawal_error_modal = show_modal
  WHERE user_id = target_user_id;
  
  -- Check if user was found and updated
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'User not found');
  END IF;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Withdrawal error modal flag updated successfully',
    'user_id', target_user_id,
    'show_modal', show_modal
  );
END;
$function$;

-- Fix update_marketplace_stats function
CREATE OR REPLACE FUNCTION public.update_marketplace_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_current_stats marketplace_stats%ROWTYPE;
  v_nft_increment integer;
  v_sales_increment integer;
  v_time_options text[] := ARRAY['~1m ago', '~2m ago', '~3m ago', '~30s ago', '~45s ago', '~4m ago'];
  v_random_time text;
BEGIN
  -- Get current stats
  SELECT * INTO v_current_stats 
  FROM public.marketplace_stats 
  ORDER BY updated_at DESC 
  LIMIT 1;
  
  -- Generate random increments (1-10)
  v_nft_increment := floor(random() * 10 + 1)::integer;
  v_sales_increment := floor(random() * 10 + 1)::integer;
  
  -- Pick random time
  v_random_time := v_time_options[floor(random() * array_length(v_time_options, 1) + 1)::integer];
  
  -- Update stats
  UPDATE public.marketplace_stats 
  SET 
    total_nfts = v_current_stats.total_nfts + v_nft_increment,
    total_sales = v_current_stats.total_sales + v_sales_increment,
    latest_drop_time = v_random_time,
    updated_at = now()
  WHERE id = v_current_stats.id;
  
  RETURN json_build_object(
    'success', true,
    'nft_increment', v_nft_increment,
    'sales_increment', v_sales_increment,
    'new_time', v_random_time
  );
END;
$function$;

-- Fix get_marketplace_stats function
CREATE OR REPLACE FUNCTION public.get_marketplace_stats()
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_stats marketplace_stats%ROWTYPE;
BEGIN
  SELECT * INTO v_stats 
  FROM public.marketplace_stats 
  ORDER BY updated_at DESC 
  LIMIT 1;
  
  RETURN json_build_object(
    'total_nfts', v_stats.total_nfts,
    'total_sales', v_stats.total_sales,
    'latest_drop_time', v_stats.latest_drop_time,
    'updated_at', v_stats.updated_at
  );
END;
$function$;