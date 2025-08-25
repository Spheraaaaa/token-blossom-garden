import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, AlertTriangle } from "lucide-react";

interface SecurityNoticeProps {
  type: 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

export const SecurityNotice = ({ type, title, message }: SecurityNoticeProps) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Shield className="h-4 w-4" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'default' as const;
      case 'info':
      default:
        return 'default' as const;
    }
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};