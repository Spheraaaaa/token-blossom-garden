import { ShieldX, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlockedPageProps {
  reason?: string | null;
}

const BlockedPage = ({ reason }: BlockedPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-destructive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
      </div>
      
      <Card className="relative max-w-md w-full border-destructive/20 bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <ShieldX className="w-10 h-10 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Account Blocked
          </CardTitle>
          <CardDescription className="text-base">
            Your account has been temporarily suspended
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {reason && (
            <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
              <p className="text-sm font-medium text-foreground mb-1">Reason:</p>
              <p className="text-sm text-muted-foreground">{reason}</p>
            </div>
          )}
          
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              Access to your profile and purchasing features has been restricted.
            </p>
            <p>
              If you believe this is a mistake, please contact our support team.
            </p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.location.href = 'mailto:support@example.com'}
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockedPage;
