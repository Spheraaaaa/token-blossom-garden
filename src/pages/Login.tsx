
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyRound, Mail } from "lucide-react";
import { notifications } from "@/utils/notifications";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { validateEmail, rateLimitCheck } from "@/utils/validation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { BrandMark } from "@/components/BrandLogo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSecureAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  // SEO metadata
  useEffect(() => {
    document.title = "Login — PureNFT Marketplace";
    const desc = "Login to PureNFT to access your profile, bids, and collections.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", `${window.location.origin}/login`);
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Rate limiting check
      if (!rateLimitCheck('login_attempt', 5, 300000)) { // 5 attempts per 5 minutes
        notifications.error.rateLimitExceeded();
        setIsLoading(false);
        return;
      }

      // Input validation
      if (!validateEmail(email)) {
        notifications.error.invalidEmail();
        setIsLoading(false);
        return;
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if there's a redirect URL stored in localStorage
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      
      // Clear the stored redirect path
      localStorage.removeItem('redirectAfterLogin');
      
      // Navigate to the stored path or fallback to profile page
      navigate(redirectPath || "/profile");
    } catch (error) {
      notifications.error.loginFailed(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, return null while redirecting
  if (user) return null;

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 to-accent/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      </div>

      <Card className="relative z-10 w-full sm:max-w-md border border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-2xl">
        <CardHeader className="text-center space-y-4 pb-8">
          <BrandMark className="mx-auto mb-2 h-14 w-14 drop-shadow-[0_8px_20px_rgba(139,92,246,0.35)]" />
          <CardTitle className="text-3xl font-black tracking-tight text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Sign in to access your account and continue your NFT journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} variant="gradient" className="h-11 w-full">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  );


};

export default Login;
