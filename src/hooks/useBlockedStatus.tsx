import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSecureAuth } from './useSecureAuth';

export const useBlockedStatus = () => {
  const { user } = useSecureAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['blocked-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return { isBlocked: false, reason: null };
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_blocked, blocked_reason')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching blocked status:', error);
        return { isBlocked: false, reason: null };
      }
      
      return {
        isBlocked: data?.is_blocked ?? false,
        reason: data?.blocked_reason ?? null
      };
    },
    enabled: !!user?.id,
    staleTime: 30000, // Check every 30 seconds
  });

  return {
    isBlocked: data?.isBlocked ?? false,
    blockedReason: data?.reason ?? null,
    isLoading
  };
};
