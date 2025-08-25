-- Create marketplace stats table
CREATE TABLE public.marketplace_stats (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_nfts bigint NOT NULL DEFAULT 1116891,
  total_sales bigint NOT NULL DEFAULT 331951,
  latest_drop_time text NOT NULL DEFAULT '~2m ago',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert initial data
INSERT INTO public.marketplace_stats (total_nfts, total_sales, latest_drop_time)
VALUES (1116891, 331951, '~2m ago');

-- Enable Row Level Security
ALTER TABLE public.marketplace_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for reading stats (anyone can read)
CREATE POLICY "Anyone can view marketplace stats" 
ON public.marketplace_stats 
FOR SELECT 
USING (true);

-- Create function to update marketplace stats
CREATE OR REPLACE FUNCTION public.update_marketplace_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Create function to get current marketplace stats
CREATE OR REPLACE FUNCTION public.get_marketplace_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

-- Enable realtime for marketplace_stats table
ALTER TABLE public.marketplace_stats REPLICA IDENTITY FULL;