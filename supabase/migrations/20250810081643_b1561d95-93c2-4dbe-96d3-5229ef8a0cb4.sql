-- Add TRC-20 wallet address column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS trc20_address text NULL;

-- Optional: add a simple check constraint to ensure non-empty when provided (allow any text to keep flexibility)
-- Not adding constraint to avoid issues with address formats.

-- No RLS changes needed; existing SELECT/UPDATE policies apply to the whole row.