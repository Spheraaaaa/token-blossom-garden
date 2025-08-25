-- Create function to set withdrawal error modal flag for a user (for admin/testing purposes)
CREATE OR REPLACE FUNCTION public.set_withdrawal_error_modal_flag(target_user_id uuid, show_modal boolean)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
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
$$;