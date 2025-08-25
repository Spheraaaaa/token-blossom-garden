-- Add field to track if user should see withdrawal error modal
ALTER TABLE public.profiles 
ADD COLUMN show_withdrawal_error_modal boolean DEFAULT false;

-- Update existing users to not show the modal by default (can be changed manually for specific users)
UPDATE public.profiles 
SET show_withdrawal_error_modal = false 
WHERE show_withdrawal_error_modal IS NULL;