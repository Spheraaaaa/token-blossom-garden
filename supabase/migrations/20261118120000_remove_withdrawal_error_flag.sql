-- Remove the admin-controlled "withdrawal error" flag.
-- Withdrawals must only fail on real errors, never because an admin toggled a flag.
DROP FUNCTION IF EXISTS public.set_withdrawal_error_modal_flag(uuid, boolean);
ALTER TABLE public.profiles DROP COLUMN IF EXISTS show_withdrawal_error_modal;
