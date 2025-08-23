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
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(true);
    toast({
      title: "Address Copied",
      description: "Ethereum ERC-20 address copied to clipboard"
    });
    setTimeout(() => {
      setCopiedWallet(false);
    }, 2000);
  };
  const copyTrcToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrc(true);
    toast({
      title: "Address Copied",
      description: "USDT TRC-20 address copied to clipboard"
    });
    setTimeout(() => {
      setCopiedTrc(false);
    }, 2000);
  };
  return <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden relative rounded-2xl">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600/50 via-primary/40 to-purple-600/50"></div>
      <CardHeader className="space-y-2 border-b border-border/50 pb-4 relative z-10">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <UserRound className="w-6 h-6 text-primary" />
          </div>
          Profile Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8 p-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Field */}
          <div className="space-y-2 group relative">
            <label className="text-sm font-medium flex items-center gap-2 text-white/70">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.email} readOnly className="bg-white/5 border-white/10 group-hover:border-primary/30 transition-colors pl-10 font-medium text-white/90 h-12" />
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            </div>
          </div>
          
          {/* Country Field */}
          <div className="space-y-2 group">
            <label className="text-sm font-medium flex items-center gap-2 text-white/70">
              <Globe className="w-4 h-4" />
              Country
            </label>
            <div className="relative overflow-hidden rounded-lg transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.country} readOnly className="bg-white/5 border-white/10 group-hover:border-primary/30 transition-colors pl-10 font-medium text-white/90 h-12" />
              <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
            </div>
          </div>
        </div>
        
        {/* Verification Status - Fixed styling to match other fields */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-white/70">
            <HelpCircle className="w-4 h-4" />
            Verification Status
          </label>
          <div className="relative overflow-hidden rounded-lg transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-white/5 border border-white/10 group-hover:border-primary/30 transition-colors rounded-lg h-12 flex items-center pl-10">
              {userData?.verified ? <div className="flex items-center gap-2 text-green-500 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified Account</span>
                </div> : <div className="flex items-center gap-2 text-yellow-500 font-medium">
                  
                  <span>Not Verified</span>
                </div>}
            </div>
            <HelpCircle className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
          </div>
        </div>
        
        {/* Wallet Address - Improved responsive layout */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-white/70">
            <Wallet className="w-4 h-4" />
            Ethereum ERC-20 Address
          </label>
          <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'} items-start`}>
            <div className={`${isMobile ? 'w-full mb-3' : 'flex-grow'} flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300`}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.wallet_address || ''} readOnly className="bg-white/5 font-mono text-sm border-white/10 group-hover:border-primary/30 transition-colors pl-10 pr-16 truncate text-white/90 h-12 w-full" placeholder="No Ethereum ERC-20 address" />
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />
              
              {userData?.wallet_address && <div className="absolute right-0 top-0 h-full flex items-center gap-0.5 pr-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-colors" onClick={() => copyToClipboard(userData.wallet_address || '')}>
                          {copiedWallet ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#1A1F2C] border border-primary/20">
                        <p>{copiedWallet ? 'Copied!' : 'Copy address'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>}
            </div>
            
            <div className={`flex items-center ${isMobile ? 'w-full' : ''}`}>
              {userData?.wallet_address ? <div className="bg-primary/20 px-3 py-1.5 rounded-md text-sm text-primary font-medium flex items-center gap-1.5 w-full justify-center md:justify-start">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  ERC-20
                </div> : <Button onClick={() => setIsWalletModalOpen(true)} className={`bg-gradient-to-r from-purple-600/20 to-primary/20 border border-primary/10 text-primary hover:from-purple-600/30 hover:to-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden h-12 ${isMobile ? 'w-full' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Wallet className="w-4 h-4 relative z-10 text-white" />
                  <span className="relative z-10 text-white">Generate Address</span>
                </Button>}
            </div>
          </div>
        </div>

        {/* USDT TRC-20 Address */}
        <div className="space-y-2 group">
          <label className="text-sm font-medium flex items-center gap-2 text-white/70">
            <Wallet className="w-4 h-4" />
            USDT TRC-20 Address
          </label>
          <div className={`flex ${isMobile ? 'flex-col' : 'gap-4'} items-start`}>
            <div className={`${isMobile ? 'w-full mb-3' : 'flex-grow'} flex gap-2 items-center relative overflow-hidden rounded-lg transition-all duration-300`}>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-purple-500/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input value={userData?.trc20_address || ''} readOnly className="bg-white/5 font-mono text-sm border-white/10 group-hover:border-primary/30 transition-colors pl-10 pr-16 truncate text-white/90 h-12 w-full" placeholder="No USDT TRC-20 address" />
              <Wallet className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-primary/60" />

              {userData?.trc20_address && (
                <div className="absolute right-0 top-0 h-full flex items-center gap-0.5 pr-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/20 hover:text-primary transition-colors" onClick={() => copyTrcToClipboard(userData.trc20_address || '')}>
                          {copiedTrc ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-[#1A1F2C] border border-primary/20">
                        <p>{copiedTrc ? 'Copied!' : 'Copy address'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>

            <div className={`flex items-center ${isMobile ? 'w-full' : ''}`}>
              {userData?.trc20_address ? (
                <div className="bg-primary/20 px-3 py-1.5 rounded-md text-sm text-primary font-medium flex items-center gap-1.5 w-full justify-center md:justify-start">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  TRC-20
                </div>
              ) : (
                <Button onClick={() => setIsTrcWalletModalOpen(true)} className={`bg-gradient-to-r from-purple-600/20 to-primary/20 border border-primary/10 text-primary hover:from-purple-600/30 hover:to-primary/30 transition-colors flex items-center gap-2 group relative overflow-hidden h-12 ${isMobile ? 'w-full' : ''}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Wallet className="w-4 h-4 relative z-10 text-white" />
                  <span className="relative z-10 text-white">Generate Address</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>;
};
