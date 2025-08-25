
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, Home, BadgeCheck, CheckCircle2, HelpCircle } from "lucide-react";
import type { UserData } from "@/types/user";

interface VerificationTabProps {
  userData: UserData | null;
  startKYCVerification: () => void;
  continueKYCVerification: () => void;
}

export const VerificationTab = ({ userData, startKYCVerification, continueKYCVerification }: VerificationTabProps) => {
  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          KYC Verification
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Status Overview */}
        <div className="p-6 rounded-2xl bg-muted/20 border border-border/20">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl ${userData?.verified ? 'bg-green-500/10 border border-green-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
              {userData?.verified ? <CheckCircle2 className="w-8 h-8 text-green-500" /> : <HelpCircle className="w-8 h-8 text-orange-500" />}
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  KYC Status:{' '}
                  <span className={`${userData?.verified ? 'text-green-500' : 'text-orange-500'}`}>
                    {userData?.verified ? 'Verified' : 
                     userData?.kyc_status === 'not_started' ? 'Not Started' : 
                     userData?.kyc_status === 'identity_submitted' ? 'Identity Submitted' : 
                     userData?.kyc_status === 'under_review' ? 'Under Review' : 'Not Verified'}
                  </span>
                </h3>
                {userData?.kyc_status === 'under_review' && (
                  <span className="text-sm text-orange-500 font-medium">80%</span>
                )}
              </div>
              <p className="text-muted-foreground">
                {userData?.verified ? 'Your account is fully verified and has access to all features' : 
                 userData?.kyc_status === 'under_review' ? 'Final verification check in progress' : 
                 'Complete verification to unlock all features'}
              </p>
              
              {userData?.kyc_status === 'under_review' && (
                <div className="mt-4 w-full bg-orange-500/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-1000" 
                    style={{ width: '80%' }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verification Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identity Step */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            userData?.kyc_status === 'not_started' ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${
                userData?.kyc_status === 'not_started' ? 'bg-primary/20' : 'bg-green-500/20'
              }`}>
                <User className={`w-5 h-5 ${
                  userData?.kyc_status === 'not_started' ? 'text-primary' : 'text-green-500'
                }`} />
              </div>
              <h3 className="font-bold text-foreground">Identity</h3>
            </div>
            
            {userData?.kyc_status === 'not_started' && (
              <Button 
                onClick={startKYCVerification} 
                className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12"
              >
                Start Verification
              </Button>
            )}
          </div>

          {/* Address Step */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            userData?.kyc_status === 'identity_submitted' ? 'bg-primary/5 border-primary/20' : 'bg-muted/10 border-border/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${
                userData?.kyc_status === 'identity_submitted' ? 'bg-primary/20' : 
                userData?.kyc_status === 'under_review' || userData?.verified ? 'bg-green-500/20' : 'bg-muted/20'
              }`}>
                <Home className={`w-5 h-5 ${
                  userData?.kyc_status === 'identity_submitted' ? 'text-primary' : 
                  userData?.kyc_status === 'under_review' || userData?.verified ? 'text-green-500' : 'text-muted-foreground'
                }`} />
              </div>
              <h3 className="font-bold text-foreground">Address</h3>
            </div>
            
            {(userData?.kyc_status === 'identity_submitted' || userData?.kyc_status === 'not_started') && (
              <Button 
                onClick={continueKYCVerification} 
                className="w-full bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12" 
                disabled={userData?.kyc_status === 'not_started'}
              >
                Submit Address Documents
              </Button>
            )}
          </div>

          {/* Verification Complete Step */}
          <div className={`p-6 rounded-2xl border transition-all duration-300 ${
            userData?.verified ? 'bg-green-500/5 border-green-500/20' : 'bg-muted/10 border-border/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-xl ${
                userData?.verified ? 'bg-green-500/20' : 'bg-muted/20'
              }`}>
                <BadgeCheck className={`w-5 h-5 ${
                  userData?.verified ? 'text-green-500' : 'text-muted-foreground'
                }`} />
              </div>
              <h3 className="font-bold text-foreground">Verification</h3>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
