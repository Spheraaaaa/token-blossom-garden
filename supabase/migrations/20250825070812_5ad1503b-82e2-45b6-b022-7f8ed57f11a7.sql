-- Security Fix 1: Add search_path protection to all database functions

-- Update accept_bid function with security hardening
CREATE OR REPLACE FUNCTION public.accept_bid(bid_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_nft_id uuid;
  v_bid_amount numeric;
  v_bidder_address text;
  v_nft_owner_id uuid;
  v_seller_receives numeric;
  v_platform_fee_percent numeric := 2.5;
  v_frozen_until timestamp;
  v_currency_type text := 'eth';
BEGIN
  -- Input validation
  IF bid_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid bid ID');
  END IF;

  -- Get bid details
  SELECT b.nft_id, b.bid_amount, b.bidder_address, n.owner_id
  INTO v_nft_id, v_bid_amount, v_bidder_address, v_nft_owner_id
  FROM public.nft_bids b
  JOIN public.nfts n ON b.nft_id = n.id
  WHERE b.id = bid_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Bid not found');
  END IF;
  
  -- Security: Check if user is the owner of the NFT
  IF v_nft_owner_id <> auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You are not the owner of this NFT');
  END IF;
  
  -- Input validation: Check for reasonable bid amount
  IF v_bid_amount <= 0 OR v_bid_amount > 1000000 THEN
    RETURN json_build_object('success', false, 'message', 'Invalid bid amount');
  END IF;
  
  -- Set frozen_until date (15 days from now)
  v_frozen_until := NOW() + INTERVAL '15 days';
  
  -- Calculate seller's received amount after platform fee
  v_seller_receives := v_bid_amount * (1 - v_platform_fee_percent / 100);
  
  -- Add to the seller's frozen balance
  UPDATE public.profiles
  SET frozen_balance = frozen_balance + v_seller_receives
  WHERE user_id = auth.uid();
  
  -- Update NFT ownership
  UPDATE public.nfts
  SET owner_id = NULL, bidder_wallet_address = v_bidder_address, for_sale = false
  WHERE id = v_nft_id;
  
  -- Record the sale transaction with currency_type
  INSERT INTO public.transactions (user_id, type, amount, status, item, frozen_until, currency_type)
  VALUES (auth.uid(), 'sale', v_seller_receives, 'completed', v_nft_id::text, v_frozen_until, v_currency_type);
  
  -- Mark the bid as accepted
  DELETE FROM public.nft_bids WHERE id = bid_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Bid accepted successfully'
  );
END;
$function$;

-- Update decline_bid function with security hardening
CREATE OR REPLACE FUNCTION public.decline_bid(bid_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_nft_id uuid;
  v_nft_owner_id uuid;
BEGIN
  -- Input validation
  IF bid_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid bid ID');
  END IF;

  -- Get bid details and NFT owner
  SELECT b.nft_id, n.owner_id
  INTO v_nft_id, v_nft_owner_id
  FROM public.nft_bids b
  JOIN public.nfts n ON b.nft_id = n.id
  WHERE b.id = bid_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Bid not found');
  END IF;
  
  -- Check if user is the owner of the NFT
  IF v_nft_owner_id <> auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You are not the owner of this NFT');
  END IF;
  
  -- Delete the bid
  DELETE FROM public.nft_bids WHERE id = bid_id;
  
  RETURN json_build_object(
    'success', true,
    'message', 'Bid declined successfully'
  );
END;
$function$;

-- Update exchange_to_usdt function with security hardening
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

-- Update purchase_nft function with security hardening
CREATE OR REPLACE FUNCTION public.purchase_nft(nft_id uuid)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  v_nft_price numeric;
  v_user_balance numeric;
  v_creator text;
  v_transaction_id uuid;
  v_owner_id uuid;
  v_for_sale boolean;
  v_seller_transaction_id uuid;
  v_platform_fee_percent numeric := 2.5;
  v_seller_receives numeric;
  v_frozen_until timestamp;
  v_currency_type text := 'eth';
BEGIN
  -- Input validation
  IF nft_id IS NULL THEN
    RETURN json_build_object('success', false, 'message', 'Invalid NFT ID');
  END IF;

  -- Check if NFT exists and is available for purchase
  SELECT price, creator, owner_id, for_sale INTO v_nft_price, v_creator, v_owner_id, v_for_sale
  FROM public.nfts
  WHERE id = nft_id AND (owner_id IS NULL OR for_sale = true);
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'NFT not found or not available for purchase');
  END IF;
  
  -- Check if the user is trying to buy their own NFT
  IF v_owner_id = auth.uid() THEN
    RETURN json_build_object('success', false, 'message', 'You cannot purchase your own NFT');
  END IF;
  
  -- Input validation: Check for reasonable price
  IF v_nft_price <= 0 OR v_nft_price > 1000000 THEN
    RETURN json_build_object('success', false, 'message', 'Invalid NFT price');
  END IF;
  
  -- Check if user has enough balance
  SELECT balance INTO v_user_balance
  FROM public.profiles
  WHERE user_id = auth.uid();
  
  IF v_user_balance < v_nft_price THEN
    RETURN json_build_object('success', false, 'message', 'Insufficient balance');
  END IF;

  -- Set frozen_until date (15 days from now)
  v_frozen_until := NOW() + INTERVAL '15 days';
  
  -- If there's an original owner, add the payment to their frozen_balance after deducting platform fee
  IF v_owner_id IS NOT NULL THEN
    -- Calculate amount seller receives after platform fee
    v_seller_receives := v_nft_price * (1 - v_platform_fee_percent / 100);
    
    -- Update seller's frozen_balance with the amount after commission
    UPDATE public.profiles
    SET frozen_balance = frozen_balance + v_seller_receives
    WHERE user_id = v_owner_id;
    
    -- Record transaction for seller (sale) with frozen_until date and is_frozen flag set to true
    INSERT INTO public.transactions (amount, type, item, status, user_id, frozen_until, is_frozen, currency_type)
    VALUES (v_seller_receives, 'sale', nft_id::text, 'completed', v_owner_id, v_frozen_until, true, v_currency_type)
    RETURNING id INTO v_seller_transaction_id;
  END IF;
  
  -- Update NFT ownership and for_sale status
  UPDATE public.nfts
  SET owner_id = auth.uid(), for_sale = false
  WHERE id = nft_id;
  
  -- Update buyer's balance with full price (buyer pays full price)
  UPDATE public.profiles
  SET balance = balance - v_nft_price
  WHERE user_id = auth.uid();
  
  -- Record transaction for buyer (purchase)
  INSERT INTO public.transactions (amount, type, item, status, user_id, currency_type)
  VALUES (v_nft_price, 'purchase', nft_id::text, 'completed', auth.uid(), v_currency_type)
  RETURNING id INTO v_transaction_id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'NFT purchased successfully',
    'transaction_id', v_transaction_id
  );
END;
$function$;

-- Update unfreeze_balances function with security hardening
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

-- Update process_expired_frozen_transactions function with security hardening
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

-- Update scheduled_process_expired_frozen_transactions function with security hardening
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

-- Security Fix 2: Enhanced RLS Policies

-- Update NFT bids policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can view bids" ON public.nft_bids;
DROP POLICY IF EXISTS "Users can create bids" ON public.nft_bids;

-- Only allow viewing bids for NFTs you own or bids you created
CREATE POLICY "Users can view relevant bids" ON public.nft_bids
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.nfts 
      WHERE nfts.id = nft_bids.nft_id 
      AND nfts.owner_id = auth.uid()
    ) OR 
    bidder_address IN (
      SELECT wallet_address FROM public.profiles 
      WHERE user_id = auth.uid()
    )
  );

-- Only authenticated users can create bids
CREATE POLICY "Authenticated users can create bids" ON public.nft_bids
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Add policy to allow NFT owners to delete bids
CREATE POLICY "NFT owners can delete bids" ON public.nft_bids
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.nfts 
      WHERE nfts.id = nft_bids.nft_id 
      AND nfts.owner_id = auth.uid()
    )
  );

-- Update profiles policies to be more restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND user_id = user_id); -- Prevent user_id changes

-- Security Fix 3: Add transaction logging table for audit trail
CREATE TABLE IF NOT EXISTS public.transaction_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id uuid REFERENCES public.transactions(id),
  action text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT NOW(),
  user_id uuid DEFAULT auth.uid()
);

-- Enable RLS on transaction_logs
ALTER TABLE public.transaction_logs ENABLE ROW LEVEL SECURITY;

-- Only users can view their own transaction logs
CREATE POLICY "Users can view own transaction logs" ON public.transaction_logs
  FOR SELECT USING (user_id = auth.uid());

-- Security Fix 4: Add cron job logs table for system monitoring
CREATE TABLE IF NOT EXISTS public.cron_job_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_name text NOT NULL,
  details jsonb,
  created_at timestamp with time zone DEFAULT NOW()
);

-- This table is for system logs, no RLS needed but restrict access
ALTER TABLE public.cron_job_logs ENABLE ROW LEVEL SECURITY;

-- Only allow system functions to insert (no user access)
CREATE POLICY "System only access" ON public.cron_job_logs
  FOR ALL USING (false);