import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLogin?: string;
}

export const WithdrawalErrorModal = ({ isOpen, onClose, userLogin }: WithdrawalErrorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleContactSupport = () => {
    // Open Telegram support account
    window.open('https://t.me/purenftsupport', '_blank');
  };

  const handleAcknowledge = async () => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ show_withdrawal_error_modal: false })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Notification closed",
        description: "This window will no longer be shown",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating modal flag:', error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <DialogTitle className="text-left">Withdrawal Issue</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left">
            Unfortunately, your withdrawal was unsuccessful. You need to contact our support team to clarify some details and resolve this issue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Next steps:</strong>
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Contact our support team</li>
            <li>• Provide your username: @{userLogin || "username"}</li>
            <li>• Describe details of your withdrawal request</li>
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button 
            onClick={handleContactSupport}
            variant="default"
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Contact Support
          </Button>
          <Button 
            onClick={handleAcknowledge} 
            disabled={isLoading}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isLoading ? "Processing..." : "I Acknowledge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};