-- Database Security Hardening: Fix search_path for all functions

-- Fix accept_bid function
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

-- Fix decline_bid function
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

-- Fix purchase_nft function
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