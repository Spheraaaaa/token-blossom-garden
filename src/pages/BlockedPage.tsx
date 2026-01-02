import { ShieldX, Mail, MessageCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlockedPageProps {
  reason?: string | null;
}

const BlockedPage = ({ reason }: BlockedPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-destructive/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-[100px]" />
        
        {/* Floating particles */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-destructive/30 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-3 h-3 bg-destructive/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-destructive/15 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>
      
      {/* Main content card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-destructive/20 via-destructive/10 to-primary/20 rounded-2xl blur-xl opacity-70" />
        
        <div className="relative glass-card rounded-2xl p-6 sm:p-8 md:p-10 border border-destructive/20">
          {/* Icon with animated ring */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
              
              {/* Main icon container */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-destructive/30 to-destructive/10 flex items-center justify-center border border-destructive/30 backdrop-blur-sm">
                <ShieldX className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3 bg-gradient-to-r from-destructive via-destructive to-destructive/70 bg-clip-text text-transparent">
            Аккаунт заблокирован
          </h1>
          
          {/* Subtitle */}
          <p className="text-center text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
            Ваш аккаунт был временно приостановлен
          </p>
          
          {/* Reason block */}
          {reason && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-xl bg-destructive/5 border border-destructive/20 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Причина блокировки:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Info text */}
          <div className="space-y-3 text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 text-center">
            <p>
              Доступ к вашему профилю и функциям покупки ограничен.
            </p>
            <p>
              Если вы считаете, что это ошибка, свяжитесь с нашей службой поддержки.
            </p>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6 sm:mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Связаться с нами</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
          
          {/* Contact buttons */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              className="w-full h-12 sm:h-14 gap-3 text-sm sm:text-base rounded-xl border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => window.open('https://t.me/purenftsupport', '_blank')}
            >
              <div className="w-8 h-8 rounded-full bg-[#0088cc]/20 flex items-center justify-center group-hover:bg-[#0088cc]/30 transition-colors">
                <MessageCircle className="w-4 h-4 text-[#0088cc]" />
              </div>
              <span>Telegram: @purenftsupport</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-12 sm:h-14 gap-3 text-sm sm:text-base rounded-xl border-primary/30 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 group"
              onClick={() => window.location.href = 'mailto:support@purenft.io'}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <span>support@purenft.io</span>
            </Button>
          </div>
          
          {/* Footer note */}
          <p className="text-center text-xs text-muted-foreground/60 mt-6 sm:mt-8">
            Мы ответим вам в течение 24 часов
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockedPage;