import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Globe, HelpCircle, Wallet, UserRound, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { UserData } from "@/types/user";

interface ProfileInfoProps {
  userData: UserData | null;
  setIsWalletModalOpen: (isOpen: boolean) => void;
  setIsTrcWalletModalOpen: (isOpen: boolean) => void;
}

export const ProfileInfo = ({
  userData,
  setIsWalletModalOpen,
  setIsTrcWalletModalOpen
}: ProfileInfoProps) => {
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [copiedTrc, setCopiedTrc] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(true);
    toast({
      title: "Address Copied",
      description: "Ethereum ERC-20 address copied to clipboard"
    });
    setTimeout(() => setCopiedWallet(false), 2000);
  };
  
  const copyTrcToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrc(true);
    toast({
      title: "Address Copied", 
      description: "USDT TRC-20 address copied to clipboard"
    });
    setTimeout(() => setCopiedTrc(false), 2000);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <UserRound className="w-5 h-5 text-primary" />
          </div>
          Profile Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-primary" />
              Email
            </label>
            <div className="relative">
              <Input 
                value={userData?.email} 
                readOnly 
                className="bg-muted/40 border-border/30 pl-10 h-12 rounded-xl"
              />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
          
          {/* Country Field */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Globe className="w-4 h-4 text-primary" />
              Country
            </label>
            <div className="relative">
              <Input 
                value={userData?.country} 
                readOnly 
                className="bg-muted/40 border-border/30 pl-10 h-12 rounded-xl"
              />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
        
        {/* Verification Status */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2 text-foreground">
            <HelpCircle className="w-4 h-4 text-primary" />
            Verification Status
          </label>
          <div className="relative">
            <div className="bg-muted/40 border border-border/30 rounded-xl h-12 flex items-center pl-10">
              {userData?.verified ? (
                <div className="flex items-center gap-2 text-green-500 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Account</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-orange-500 font-medium">
                  <span>Not Verified</span>
                </div>
              )}
            </div>
            <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>
        
        {/* Wallet Addresses */}
        <div className="space-y-6">
          {/* Ethereum ERC-20 Address */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Wallet className="w-4 h-4 text-primary" />
              Ethereum ERC-20 Address
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Input 
                  value={userData?.wallet_address || ''} 
                  readOnly 
                  className="bg-muted/40 border-border/30 pl-10 pr-12 font-mono text-sm rounded-xl h-12" 
                  placeholder="No Ethereum ERC-20 address" 
                />
                <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                
                {userData?.wallet_address && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10"
                          onClick={() => copyToClipboard(userData.wallet_address || '')}
                        >
                          {copiedWallet ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedWallet ? 'Copied!' : 'Copy address'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              {!userData?.wallet_address && (
                <Button 
                  onClick={() => setIsWalletModalOpen(true)} 
                  className="bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12 px-6"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              )}
            </div>
          </div>

          {/* USDT TRC-20 Address */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Wallet className="w-4 h-4 text-primary" />
              USDT TRC-20 Address
            </label>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Input 
                  value={userData?.trc20_address || ''} 
                  readOnly 
                  className="bg-muted/40 border-border/30 pl-10 pr-12 font-mono text-sm rounded-xl h-12" 
                  placeholder="No USDT TRC-20 address" 
                />
                <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />

                {userData?.trc20_address && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10"
                          onClick={() => copyTrcToClipboard(userData.trc20_address || '')}
                        >
                          {copiedTrc ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedTrc ? 'Copied!' : 'Copy address'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {!userData?.trc20_address && (
                <Button 
                  onClick={() => setIsTrcWalletModalOpen(true)} 
                  className="bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12 px-6"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
