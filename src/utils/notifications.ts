import { toast } from "@/hooks/use-toast";

// Beautiful notifications with consistent styling and proper messages
export const notifications = {
  // Success notifications
  success: {
    login: () => toast({
      title: "🎉 Welcome back!",
      description: "Successfully signed in to your account",
      variant: "success",
      duration: 4000,
    }),
    
    logout: () => toast({
      title: "👋 See you later!",
      description: "You have been successfully signed out",
      variant: "success",
      duration: 3000,
    }),
    
    registration: () => toast({
      title: "🚀 Registration complete!",
      description: "Welcome to PureNFT! You can now access all platform features",
      variant: "success",
      duration: 5000,
    }),
    
    profileUpdated: () => toast({
      title: "✅ Profile updated",
      description: "Your profile information has been saved successfully",
      variant: "success",
      duration: 3000,
    }),
    
    avatarUploaded: () => toast({
      title: "📸 Avatar updated",
      description: "Your profile picture has been uploaded successfully",
      variant: "success",
      duration: 3000,
    }),
    
    walletGenerated: () => toast({
      title: "💰 Wallet created",
      description: "Your wallet address has been generated and saved",
      variant: "success",
      duration: 4000,
    }),
    
    trcWalletGenerated: () => toast({
      title: "💎 USDT wallet ready",
      description: "Your TRC-20 address for USDT has been created",
      variant: "success",
      duration: 4000,
    }),
    
    verificationSubmitted: () => toast({
      title: "📋 Documents submitted",
      description: "Your documents have been sent for verification. Expect results within 24 hours",
      variant: "success",
      duration: 5000,
    }),
    
    bidAccepted: () => toast({
      title: "🎯 Bid accepted",
      description: "Transaction completed successfully! Funds have been transferred",
      variant: "success",
      duration: 4000,
    }),
    
    bidDeclined: () => toast({
      title: "❌ Bid declined",
      description: "Bid rejected and funds returned to buyer",
      variant: "success",
      duration: 4000,
    }),
    
    nftCreated: () => toast({
      title: "🎨 NFT created",
      description: "Your NFT has been successfully created and added to your collection",
      variant: "success",
      duration: 4000,
    }),
    
    depositProcessed: () => toast({
      title: "💳 Deposit processed",
      description: "Funds have been successfully credited to your balance",
      variant: "success",
      duration: 4000,
    }),
    
    withdrawalRequested: () => toast({
      title: "💸 Withdrawal requested",
      description: "Your request has been accepted for processing. Funds will arrive within 24 hours",
      variant: "success",
      duration: 5000,
    }),
    
    exchangeCompleted: () => toast({
      title: "🔄 Exchange completed",
      description: "Currency has been successfully exchanged at current rate",
      variant: "success",
      duration: 4000,
    }),
  },

  // Error notifications
  error: {
    loginFailed: (reason?: string) => toast({
      title: "🚫 Login failed",
      description: reason || "Invalid email or password. Please check your credentials and try again",
      variant: "destructive",
      duration: 5000,
    }),
    
    registrationFailed: (reason?: string) => toast({
      title: "❌ Registration failed",
      description: reason || "Unable to create account. This email may already be in use",
      variant: "destructive",
      duration: 5000,
    }),
    
    rateLimitExceeded: () => toast({
      title: "⏱️ Too many attempts",
      description: "Rate limit exceeded. Please wait a few minutes and try again",
      variant: "destructive",
      duration: 6000,
    }),
    
    invalidEmail: () => toast({
      title: "📧 Invalid email",
      description: "Please enter a valid email address",
      variant: "destructive",
      duration: 4000,
    }),
    
    weakPassword: () => toast({
      title: "🔐 Password too weak",
      description: "Password must contain at least 8 characters, including letters and numbers",
      variant: "destructive",
      duration: 5000,
    }),
    
    passwordMismatch: () => toast({
      title: "🔄 Passwords don't match",
      description: "Please ensure both passwords are entered correctly",
      variant: "destructive",
      duration: 4000,
    }),
    
    termsNotAccepted: () => toast({
      title: "📋 Agreement required",
      description: "You must accept all terms and conditions to continue",
      variant: "destructive",
      duration: 4000,
    }),
    
    authRequired: () => toast({
      title: "🔒 Authentication required",
      description: "Please sign in to perform this action",
      variant: "destructive",
      duration: 4000,
    }),
    
    profileUpdateFailed: () => toast({
      title: "❌ Update failed",
      description: "Unable to save changes. Please check your internet connection",
      variant: "destructive",
      duration: 5000,
    }),
    
    avatarUploadFailed: () => toast({
      title: "📸 Upload failed",
      description: "Unable to upload image. Please check file format and size",
      variant: "destructive",
      duration: 5000,
    }),
    
    walletGenerationFailed: () => toast({
      title: "💰 Wallet creation failed",
      description: "Unable to create wallet address. Please try again",
      variant: "destructive",
      duration: 5000,
    }),
    
    insufficientFunds: () => toast({
      title: "💳 Insufficient funds",
      description: "Your balance is insufficient to complete this operation",
      variant: "destructive",
      duration: 5000,
    }),
    
    verificationRequired: () => toast({
      title: "🔐 Verification required",
      description: "Please complete verification to access this feature",
      variant: "destructive",
      duration: 5000,
    }),
    
    networkError: () => toast({
      title: "🌐 Network error",
      description: "Connection problem with server. Please check your internet connection",
      variant: "destructive",
      duration: 5000,
    }),
    
    transactionFailed: () => toast({
      title: "💸 Transaction failed",
      description: "Unable to complete operation. No funds were charged",
      variant: "destructive",
      duration: 5000,
    }),
    
    fileUploadFailed: () => toast({
      title: "📁 File upload failed",
      description: "Unable to upload file. Please check format and size",
      variant: "destructive",
      duration: 5000,
    }),
  },

  // Warning notifications
  warning: {
    frozenFunds: (amount: string, date: string) => toast({
      title: "❄️ Funds frozen",
      description: `${amount} frozen until ${date}. This is related to NFT purchase`,
      variant: "warning",
      duration: 6000,
    }),
    
    verificationPending: () => toast({
      title: "⏳ Verification pending",
      description: "Your documents are being reviewed. This may take up to 24 hours",
      variant: "warning",
      duration: 5000,
    }),
    
    highFees: () => toast({
      title: "💰 High network fees",
      description: "Current network fees are higher than usual. Consider waiting",
      variant: "warning",
      duration: 5000,
    }),
    
    securityNotice: () => toast({
      title: "🛡️ Security notice",
      description: "Never share your private keys or passwords with anyone",
      variant: "warning",
      duration: 7000,
    }),
    
    minAmountWarning: (minAmount: string) => toast({
      title: "💰 Minimum amount",
      description: `Minimum amount for this operation: ${minAmount}`,
      variant: "warning",
      duration: 4000,
    }),
    
    maintenanceMode: () => toast({
      title: "🔧 Maintenance mode",
      description: "Some features are temporarily unavailable due to system updates",
      variant: "warning",
      duration: 6000,
    }),
  },

  // Info notifications
  info: {
    emailVerificationSent: () => toast({
      title: "📧 Email sent",
      description: "Check your email and click the verification link",
      variant: "info",
      duration: 5000,
    }),
    
    processingTransaction: () => toast({
      title: "⏳ Processing transaction",
      description: "Operation may take a few minutes. Please don't close this page",
      variant: "info",
      duration: 4000,
    }),
    
    featureComingSoon: () => toast({
      title: "🚀 Coming soon",
      description: "This feature is under development and will be available soon",
      variant: "info",
      duration: 4000,
    }),
    
    newFeatureAnnouncement: (feature: string) => toast({
      title: "✨ New feature",
      description: `Now available: ${feature}`,
      variant: "info",
      duration: 5000,
    }),
    
    dataLoading: () => toast({
      title: "⏳ Loading data",
      description: "Please wait...",
      variant: "info",
      duration: 2000,
    }),
    
    supportContact: () => toast({
      title: "💬 Need help?",
      description: "Contact our support team on Telegram",
      variant: "info",
      duration: 4000,
    }),
  }
};

// Helper functions for commonly used notifications
export const showSuccessNotification = (key: keyof typeof notifications.success, ...args: any[]) => {
  const notificationFn = notifications.success[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showErrorNotification = (key: keyof typeof notifications.error, ...args: any[]) => {
  const notificationFn = notifications.error[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showWarningNotification = (key: keyof typeof notifications.warning, ...args: any[]) => {
  const notificationFn = notifications.warning[key] as (...args: any[]) => any;
  return notificationFn(...args);
};

export const showInfoNotification = (key: keyof typeof notifications.info, ...args: any[]) => {
  const notificationFn = notifications.info[key] as (...args: any[]) => any;
  return notificationFn(...args);
};