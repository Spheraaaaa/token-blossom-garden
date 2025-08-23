import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface BalancesData {
  eth: number;
  usdt: number;
}

export const useUserBalances = () => {
  const fetchBalances = async (): Promise<BalancesData | null> => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("balance, usdt_balance")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    return {
      eth: Number(data?.balance ?? 0),
      usdt: Number(data?.usdt_balance ?? 0),
    };
  };

  return useQuery({
    queryKey: ["balances"],
    queryFn: fetchBalances,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};
