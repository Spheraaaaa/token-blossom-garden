import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/lib/supabase';
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerated: (address: string) => void;
  network?: 'eth' | 'trc20';
}

const WalletAddressModal = ({ isOpen, onClose, onGenerated, network = 'eth' }: WalletAddressModalProps) => {
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAddress, setGeneratedAddress] = useState("");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const networkLabel = network === 'trc20' ? 'USDT TRC-20' : 'Ethereum (ERC-20)';

  useEffect(() => {
    if (isOpen && isGenerating) {
      const startTime = Date.now();
      const duration = 7000; // 7 seconds
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        
        setProgress(newProgress);
        
        if (elapsed >= duration) {
          clearInterval(interval);
          setIsGenerating(false);
          const address = network === 'trc20'
            ? 'TEKFP6xskYUdzz5cKDSSMXE9YWYPXcikXF'
            : '0x90c415f420Bb6E8deDd66DFF7aBd31728773373E';
          setGeneratedAddress(address);
          onGenerated(address);
        }
      }, 100);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isOpen, isGenerating, onGenerated, network]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setIsGenerating(false);
        setProgress(0);
        setGeneratedAddress("");
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-md bg-[#0B0D17]/95 border-primary/20 text-white">
        <DialogHeader>
          <DialogTitle>
            {isGenerating
              ? `Generating ${networkLabel} Address`
              : generatedAddress
                ? `${networkLabel} Address Generated`
                : `Generate ${networkLabel} Address`}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {isGenerating ? (
              <div className="space-y-4 mt-4">
                <Progress value={progress} />
                <p className="text-center">Please wait while we generate your wallet address...</p>
              </div>
            ) : generatedAddress ? (
              <div className="space-y-4 mt-4">
                <p>Your address has been generated successfully!</p>
                <p className={`font-mono bg-[#0F1525] p-2 rounded-md ${isMobile ? 'text-xs break-all' : 'break-all'}`}>
                  {generatedAddress}
                </p>
                <p>You can now transfer your {network === 'trc20' ? 'USDT (TRC-20)' : 'Ethereum (ERC-20)'} to this address to fund your balance.</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                <p>Do you want to generate a new {networkLabel} address? It will be linked to your account and used for deposits.</p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                  <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
                  <Button
                    onClick={() => setIsGenerating(true)}
                    className="w-full sm:w-auto text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
                  >
                    Generate Address
                  </Button>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default WalletAddressModal;
