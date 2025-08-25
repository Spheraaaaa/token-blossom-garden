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
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WithdrawalErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawalErrorModal = ({ isOpen, onClose }: WithdrawalErrorModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        title: "Уведомление закрыто",
        description: "Это окно больше не будет показываться",
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating modal flag:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить настройки. Попробуйте еще раз.",
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-left">Проблема с выводом средств</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left">
            К сожалению, вывод средств произошел неуспешно. Вам необходимо связаться со службой поддержки для уточнения деталей и решения данной проблемы.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Что делать дальше:</strong>
          </p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1">
            <li>• Свяжитесь со службой поддержки</li>
            <li>• Укажите ваш ID пользователя</li>
            <li>• Опишите детали вашего запроса на вывод</li>
          </ul>
        </div>

        <DialogFooter>
          <Button 
            onClick={handleAcknowledge} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Обработка..." : "Я ознакомился"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};