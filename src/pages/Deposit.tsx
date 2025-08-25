import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountdownTimer } from "@/components/CountdownTimer";
import { Loader2, HelpCircle, ExternalLink, ArrowLeft, ArrowDownCircle, Copy, CheckCircle, AlertCircle, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase";
import { useSecureAuth } from "@/hooks/useSecureAuth";

const Deposit = () => {
  const navigate = useNavigate();
  const { user } = useSecureAuth();
  const [step, setStep] = useState<'amount' | 'hash'>('amount');
  const [depositAmount, setDepositAmount] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const walletAddress = "0xc68c825191546453e36aaa005ebf10b5219ce175";

  const validateHash = (hash: string) => {
    if (hash.length < 10) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Invalid hash, please check your input"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateHash(transactionHash)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user?.id,
          type: 'deposit',
          amount: parseFloat(depositAmount),
          status: 'pending',
          wallet_address: walletAddress,
          hash: transactionHash
        }]);
      
      if (error) throw error;
      
      toast({
        title: "Deposit Requested",
        description: `Your deposit request for ${depositAmount} ETH has been submitted`,
        variant: "default"
      });
      
      navigate('/profile');
    } catch (error) {
      console.error("Error processing deposit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    const amount = parseFloat(depositAmount);
    if (!depositAmount || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid amount greater than 0"
      });
      return;
    }
    setStep('hash');
  };

  const handleCancel = (shouldResetTimer: boolean = false) => {
    if (shouldResetTimer) {
      localStorage.removeItem('countdownEndTime');
    }
    navigate('/profile');
  };

  const handleTelegramHelp = () => {
    window.open('https://t.me/purenftsupport', '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast({
      title: "Address copied to clipboard",
      description: "You can now paste it into your wallet"
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto py-8 px-4 mt-16 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/profile')}
          className="mb-6 pl-0 text-muted-foreground flex items-center gap-2 hover:bg-transparent hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to profile
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main flow */}
          <div className="md:col-span-2">
            <Card className="border-border/50 shadow-xl transition-all duration-300 backdrop-blur-xl bg-card/90 overflow-hidden rounded-2xl">
              <CardHeader className="relative pb-2">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <div className="p-2 rounded-md bg-muted/30 border border-border/50">
                      <ArrowDownCircle className="w-5 h-5 text-muted-foreground" />
                    </div>
                    Deposit
                  </CardTitle>
                  <CardDescription className="text-muted-foreground mt-1">
                    Add funds to your wallet
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="relative space-y-6 pt-4">
                {step === 'amount' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-muted-foreground">
                          Amount (ETH)
                        </label>
                        <span className="text-xs text-muted-foreground">
                          Min: 0.0001 ETH
                        </span>
                      </div>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.0001"
                          min="0.0001"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="bg-background/60 border border-border/50 focus-visible:ring-2 focus-visible:ring-ring pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-foreground/80 bg-muted/30 px-2 py-0.5 rounded">
                          ETH
                        </span>
                      </div>
                    </div>

                    {parseFloat(depositAmount) > 0 && (
                      <div className="p-3 border border-border/50 rounded-lg bg-muted/20 space-y-1 animate-in fade-in">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deposit Amount:</span>
                          <span className="font-medium text-foreground">{depositAmount} ETH</span>
                        </div>
                        <div className="h-px bg-border my-1"></div>
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-muted-foreground">You'll receive:</span>
                          <span className="text-foreground">{parseFloat(depositAmount) > 0 ? parseFloat(depositAmount).toFixed(4) : '0.0000'} ETH</span>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full" 
                      onClick={handleNextStep}
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                      <p className="text-center text-sm text-foreground font-medium">
                        Request created for {depositAmount} ETH
                      </p>
                      
                      <div className="mt-3 bg-muted/30 rounded-lg p-2">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Time remaining</span>
                          <span>Complete deposit before timer ends</span>
                        </div>
                        <div className="mt-1">
                          <CountdownTimer endTime={new Date(new Date().getTime() + 30 * 60000).toISOString()} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4">
                      <h3 className="font-medium text-foreground flex items-center gap-2">
                        <ArrowDownCircle className="h-4 w-4 text-muted-foreground" />
                        Send ETH to this address
                      </h3>
                      <div className="bg-muted/20 p-4 rounded-md border border-border/50 hover:border-primary/30 transition-colors group">
                        <div className="flex justify-between items-center">
                          <div className="break-all font-mono text-foreground/90 text-sm">
                            {walletAddress}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={copyToClipboard}
                            className="ml-2 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/20"
                          >
                            {copied ? <CheckCircle className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          ERC-20 Network Only
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/50">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground mt-0.5" />
                          <p>If you have already transferred Ethereum, but the timer has expired, the funds will be credited back to your original wallet.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Transaction Hash
                        </label>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-primary/60" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm bg-background/95 backdrop-blur-sm border-primary/20">
                              <p>This is the transaction ID. After successful withdrawal of funds from another wallet, you will need to provide a confirmation with the number that appears in the other wallet.</p>
                              <Button 
                                variant="link" 
                                className="mt-2 h-auto p-0 text-primary"
                                onClick={handleTelegramHelp}
                              >
                                I need help <ExternalLink className="ml-1 h-3 w-3" />
                              </Button>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <Input
                        value={transactionHash}
                        onChange={(e) => setTransactionHash(e.target.value)}
                        placeholder="Enter transaction hash"
                        className="font-mono bg-background/60 border border-border/50 focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCancel(true)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleSubmit}
                        disabled={!transactionHash || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          'Confirm'
                        )}
                      </Button>
                    </div>

                    <div className="text-center mt-2">
                      <Button
                        variant="link"
                        className="h-auto p-0"
                        onClick={handleTelegramHelp}
                      >
                        Need help? <ExternalLink className="ml-0.5 h-3 w-3" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info aside */}
          <div>
            <Card className="border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
                  <Shield className="h-4 w-4" /> How deposits work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">1.</span>
                    <p>Enter the amount and create a deposit request.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">2.</span>
                    <p>Send ETH to the provided ERC‑20 address.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">3.</span>
                    <p>Paste the transaction hash and confirm.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5">4.</span>
                    <p>We verify and credit your balance.</p>
                  </div>
                </div>
                <div className="h-px bg-border" />
                <div className="space-y-2">
                  
                  <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Network: ERC‑20 only</div>
                  <div className="flex items-center gap-2"><AlertCircle className="h-4 w-4" /> Min amount: 0.0001 ETH</div>
                  <Button variant="link" className="px-0 h-auto" onClick={handleTelegramHelp}>Need help? <ExternalLink className="ml-1 h-3 w-3" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
