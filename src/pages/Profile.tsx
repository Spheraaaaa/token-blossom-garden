import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifications } from "@/utils/notifications";
import { User, Settings, Wallet, Shield, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import FraudWarningDialog from "@/components/FraudWarningDialog";
import KYCIdentityDialog from "@/components/KYCIdentityDialog";
import KYCAddressDialog from "@/components/KYCAddressDialog";
import { UserNFTCollection } from "@/components/nft/UserNFTCollection";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { SettingsTab } from "@/components/profile/SettingsTab";
import { WalletTab } from "@/components/profile/WalletTab";
import { VerificationTab } from "@/components/profile/VerificationTab";
import { ExchangeDialog } from "@/components/profile/ExchangeDialog";
import { useBlockedStatus } from "@/hooks/useBlockedStatus";
import BlockedPage from "@/pages/BlockedPage";
import type { UserData, Transaction, TransactionTotals, FrozenBalanceInfo } from "@/types/user";

const Profile = () => {
  const { user, signOut } = useSecureAuth();
  const { isBlocked, blockedReason, isLoading: isBlockedLoading } = useBlockedStatus();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFraudWarningOpen, setIsFraudWarningOpen] = useState(false);
  const [transactionTotals, setTransactionTotals] = useState<TransactionTotals>({
    total_deposits: 0,
    total_withdrawals: 0
  });
  const [isIdentityDialogOpen, setIsIdentityDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [frozenBalanceDetails, setFrozenBalanceDetails] = useState<FrozenBalanceInfo[]>([]);
  const [showFrozenDetails, setShowFrozenDetails] = useState(false);
  const [isExchangeDialogOpen, setIsExchangeDialogOpen] = useState(false);
  const [exchangeType, setExchangeType] = useState<'regular' | 'frozen'>('regular');
  const PAGE_SIZE = 20;
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Profile — PureNFT";
    return () => { document.title = prev; };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      notifications.success.logout();
      navigate("/");
    } catch (error) {
      notifications.error.networkError();
    }
  };

  const startKYCVerification = () => {
    try {
      if (!user?.id) {
        notifications.error.authRequired();
        return;
      }
      setIsIdentityDialogOpen(true);
    } catch (error) {
      console.error("Error starting verification:", error);
      notifications.error.networkError();
    }
  };

  const handleIdentitySuccess = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, kyc_status: profileData.kyc_status } : null);
      setIsIdentityDialogOpen(false);
      setIsAddressDialogOpen(true);
    } catch (error) {
      console.error("Error updating profile data:", error);
      notifications.error.networkError();
    }
  };

  const handleAddressSuccess = async () => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      
      setUserData(prev => prev ? { ...prev, kyc_status: profileData.kyc_status } : null);
      setIsAddressDialogOpen(false);
      
      notifications.success.verificationSubmitted();
    } catch (error) {
      console.error("Error updating profile data:", error);
      notifications.error.networkError();
    }
  };

  const handleAddressClose = () => {
    setIsAddressDialogOpen(false);
  };

  const continueKYCVerification = () => {
    if (!user?.id) {
      notifications.error.authRequired();
      return;
    }
    setIsAddressDialogOpen(true);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userData.id}/${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userData.id);
      
      if (updateError) throw updateError;
      
      setUserData(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      
      notifications.success.avatarUploaded();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notifications.error.avatarUploadFailed();
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          throw authError;
        }
        
        if (!currentUser) {
          console.log("No user found");
          return;
        }
        
        const { data: totalsData, error: totalsError } = await supabase.rpc(
          'get_user_transaction_totals',
          { user_uuid: currentUser.id }
        );
        
        if (totalsError) {
          console.error("Error fetching transaction totals:", totalsError);
          throw totalsError;
        }
        
        if (totalsData) {
          setTransactionTotals(totalsData);
        }
        
        const { data: frozenData, error: frozenError } = await supabase.rpc(
          'get_user_frozen_balances',
          { user_uuid: currentUser.id }
        );
        
        if (frozenError) {
          console.error("Error fetching frozen balances:", frozenError);
          throw frozenError;
        }
        
        if (frozenData && frozenData.length > 0) {
          setFrozenBalanceDetails(frozenData[0].unfreezing_in_days || []);
        }
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(PAGE_SIZE);
        
        if (transactionsError) {
          console.error("Transactions error:", transactionsError);
          throw transactionsError;
        }
        
        console.log("Transaction data:", transactionsData);
        
        if (isMounted && currentUser) {
          const userData: UserData = {
            id: currentUser.id,
            email: currentUser.email || '',
            login: profileData?.login || currentUser.user_metadata?.login || '',
            country: profileData?.country || currentUser.user_metadata?.country || '',
            avatar_url: profileData?.avatar_url || null,
            balance: profileData?.balance?.toString() || "0.0",
            usdt_balance: profileData?.usdt_balance?.toString() || "0.0",
            frozen_balance: profileData?.frozen_balance?.toString() || "0.0",
            frozen_usdt_balance: profileData?.frozen_usdt_balance?.toString() || "0.0",
            wallet_address: profileData?.wallet_address || '',
            erc20_address: profileData?.erc20_address || undefined,
            trc20_address: profileData?.trc20_address || '',
            created_at: profileData?.created_at || currentUser.created_at,
            verified: profileData?.verified || false,
            kyc_status: profileData?.kyc_status || 'not_started'
          };
          
          console.log("Setting user data with avatar:", userData.avatar_url);
          setUserData(userData);
          
          if (transactionsData) { setHasMore(transactionsData.length === PAGE_SIZE);
            setTransactions(transactionsData.map(tx => {
              const dateObj = new Date(tx.created_at);
              const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
              
              let formattedFrozenUntil = null;
              if (tx.frozen_until) {
                const frozenDate = new Date(tx.frozen_until);
                formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
              }
              
              return {
                id: tx.id,
                type: tx.type,
                amount: tx.amount.toString(),
                created_at: formattedDate,
                raw_created_at: tx.created_at,
                status: tx.status,
                item: tx.item,
                frozen_until: formattedFrozenUntil,
                is_frozen: tx.is_frozen,
                is_frozen_exchange: tx.is_frozen_exchange,
                currency_type: tx.currency_type
              };
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        
        if (isMounted) {
          notifications.error.networkError();
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    fetchUserData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchMoreTransactions = async () => {
    if (isFetchingNext || !hasMore) return;
    try {
      setIsFetchingNext(true);
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) return;
      const from = transactions.length;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .range(from, to);
      if (error) throw error;
      if (data && data.length > 0) {
        const mapped = data.map(tx => {
          const dateObj = new Date(tx.created_at);
          const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
          let formattedFrozenUntil: string | null = null;
          if (tx.frozen_until) {
            const frozenDate = new Date(tx.frozen_until);
            formattedFrozenUntil = `${frozenDate.getDate().toString().padStart(2, '0')}/${(frozenDate.getMonth() + 1).toString().padStart(2, '0')}/${frozenDate.getFullYear()}`;
          }
          return {
            id: tx.id,
            type: tx.type,
            amount: tx.amount.toString(),
            created_at: formattedDate,
            raw_created_at: tx.created_at,
            status: tx.status,
            item: tx.item,
            frozen_until: formattedFrozenUntil,
            is_frozen: tx.is_frozen,
            is_frozen_exchange: tx.is_frozen_exchange,
            currency_type: tx.currency_type
          } as Transaction;
        });
        const existingIds = new Set(transactions.map(t => t.id));
        const newOnes = mapped.filter(m => !existingIds.has(m.id));
        setTransactions(prev => [...prev, ...newOnes]);
        setHasMore(data.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error('Error loading more transactions:', e);
    } finally {
      setIsFetchingNext(false);
    }
  };

  if (isLoading || isBlockedLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 pt-8 pb-16 md:pt-12" aria-busy="true">
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <div className="flex items-center gap-4 lg:flex-col lg:items-start">
            <div className="h-16 w-16 rounded-2xl bg-muted animate-pulse lg:h-20 lg:w-20" />
            <div className="space-y-2">
              <div className="h-6 w-36 rounded-md bg-muted animate-pulse" />
              <div className="h-4 w-28 rounded-md bg-muted/70 animate-pulse" />
            </div>
          </div>
          <div className="h-[420px] rounded-2xl border border-border bg-card animate-pulse" />
        </div>
      </div>
    );
  }

  // Show blocked page if user is blocked
  if (isBlocked) {
    return <BlockedPage reason={blockedReason} />;
  }

  const tabs = [
    { value: "profile", label: "Profile", icon: User },
    { value: "settings", label: "Settings", icon: Settings },
    { value: "wallet", label: "Wallet", icon: Wallet },
    { value: "verification", label: "Verification", icon: Shield },
    { value: "nft", label: "NFTs", icon: ShoppingBag },
  ];

  const tabContentClass =
    "mt-0 focus-visible:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-1 data-[state=active]:duration-300";

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px]"
        style={{ background: "radial-gradient(50% 100% at 20% 0%, hsl(263 84% 74% / 0.10), transparent 70%)" }}
      />

      <div className="container relative mx-auto px-4 sm:px-6 pt-8 pb-16 md:pt-12">
        <Tabs defaultValue="profile" className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ProfileHeader userData={userData} handleAvatarUpload={handleAvatarUpload} />

            <TabsList
              aria-label="Account sections"
              className="mt-6 flex h-auto w-full flex-nowrap justify-start gap-1 overflow-x-auto rounded-xl border border-border bg-card p-1 lg:flex-col lg:items-stretch lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0"
            >
              {tabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="shrink-0 justify-start gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none lg:w-full"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </aside>

          <div className="min-w-0">
            <TabsContent value="profile" className={tabContentClass}>
              <ProfileInfo userData={userData} />
            </TabsContent>

            <TabsContent value="settings" className={tabContentClass}>
              <SettingsTab handleLogout={handleLogout} currentEmail={userData?.email} />
            </TabsContent>

            <TabsContent value="wallet" className={tabContentClass}>
              <WalletTab
                userData={userData}
                frozenBalanceDetails={frozenBalanceDetails}
                showFrozenDetails={showFrozenDetails}
                setShowFrozenDetails={setShowFrozenDetails}
                setIsExchangeDialogOpen={setIsExchangeDialogOpen}
                transactions={transactions}
                setExchangeType={setExchangeType}
                onLoadMore={fetchMoreTransactions}
                isFetchingNext={isFetchingNext}
                hasMore={hasMore}
              />
            </TabsContent>

            <TabsContent value="verification" className={tabContentClass}>
              <VerificationTab
                userData={userData}
                startKYCVerification={startKYCVerification}
                continueKYCVerification={continueKYCVerification}
              />
            </TabsContent>

            <TabsContent value="nft" className={tabContentClass}>
              <UserNFTCollection />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <FraudWarningDialog
        isOpen={isFraudWarningOpen}
        onClose={() => setIsFraudWarningOpen(false)}
      />

      <KYCIdentityDialog
        isOpen={isIdentityDialogOpen}
        onClose={() => setIsIdentityDialogOpen(false)}
        onSuccess={handleIdentitySuccess}
        userId={user?.id || ''}
      />

      <KYCAddressDialog
        isOpen={isAddressDialogOpen}
        onClose={handleAddressClose}
        onSuccess={handleAddressSuccess}
        userId={user?.id || ''}
      />

      <ExchangeDialog
        isOpen={isExchangeDialogOpen}
        setIsOpen={setIsExchangeDialogOpen}
        userData={userData}
        userId={user?.id}
        setTransactions={setTransactions}
        exchangeType={exchangeType}
      />
    </div>
  );
};

export default Profile;
