
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useNavigate, Link } from "react-router-dom";
import { KeyRound, Mail, User, Shield } from "lucide-react";
import { useSecureAuth } from "@/hooks/useSecureAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [login, setLogin] = useState("");
  const [country, setCountry] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [seedAccessAgreed, setSeedAccessAgreed] = useState(false);
  const [seedTransferAgreed, setSeedTransferAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
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
    document.title = "Create Account — PureNFT Marketplace";
    const desc = "Create your PureNFT account to buy and sell NFTs securely.";
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
    link.setAttribute("href", `${window.location.origin}/register`);
  }, []);


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (!seedAccessAgreed || !seedTransferAgreed || !policyAgreed) {
        toast({
          title: "Error",
          description: "Please agree to all terms",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            login,
            country,
          }
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData.user) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        toast({
          title: "Success",
          description: "Registration successful! You are now logged in.",
        });
        
        navigate("/profile");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is already logged in, we'll see a blank page briefly during redirect
  // This could be improved with a loading state
  if (user) return null;

  return (
    <main className="min-h-screen relative flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background/98 to-background/95">
      {/* Clean background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-accent/1 to-secondary/1" />
      
      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-br from-primary/8 via-accent/5 to-transparent rounded-full blur-3xl animate-simple-float opacity-60" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] bg-gradient-to-br from-accent/6 via-secondary/4 to-transparent rounded-full blur-2xl animate-simple-float opacity-40" style={{ animationDelay: '2s' }} />
      </div>

      <Card className="relative z-10 w-full sm:max-w-md border border-border/30 bg-card/80 backdrop-blur-xl shadow-2xl hover:shadow-primary/10 transition-all duration-500 rounded-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground/80">
            Join us today and start your NFT journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
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
              <Label htmlFor="login" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="login"
                type="text"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Choose your username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry} required>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Australia">Australia</SelectItem>
                  <SelectItem value="Russia">Russia</SelectItem>
                  <SelectItem value="Germany">Germany</SelectItem>
                  <SelectItem value="France">France</SelectItem>
                  <SelectItem value="Spain">Spain</SelectItem>
                  <SelectItem value="Italy">Italy</SelectItem>
                  <SelectItem value="Japan">Japan</SelectItem>
                  <SelectItem value="China">China</SelectItem>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="Brazil">Brazil</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                  <SelectItem value="Argentina">Argentina</SelectItem>
                  <SelectItem value="South Korea">South Korea</SelectItem>
                  <SelectItem value="Singapore">Singapore</SelectItem>
                  <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                  <SelectItem value="South Africa">South Africa</SelectItem>
                  <SelectItem value="Sweden">Sweden</SelectItem>
                  <SelectItem value="Norway">Norway</SelectItem>
                  <SelectItem value="New Zealand">New Zealand</SelectItem>
                  <SelectItem value="Poland">Poland</SelectItem>
                  <SelectItem value="Turkey">Turkey</SelectItem>
                  <SelectItem value="Egypt">Egypt</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="space-y-4 rounded-lg border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-medium">Additional agreements</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="seed-access" className="text-sm text-muted-foreground leading-none flex-1">
                    I agree that only I have access to the seed and keys. If the seed is lost, access to accounts cannot be restored
                  </label>
                  <Switch id="seed-access" checked={seedAccessAgreed} onCheckedChange={setSeedAccessAgreed} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="seed-transfer" className="text-sm text-muted-foreground leading-none flex-1">
                    I agree that when transferring the seed to third parties, I may lose all my accounts
                  </label>
                  <Switch id="seed-transfer" checked={seedTransferAgreed} onCheckedChange={setSeedTransferAgreed} />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="policy" className="text-sm text-muted-foreground leading-none flex-1">
                    I agree to the website policy and terms of service
                  </label>
                  <Switch id="policy" checked={policyAgreed} onCheckedChange={setPolicyAgreed} />
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button type="submit" disabled={isLoading} variant="gradient" className="h-11 w-full">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </main>
  );

};

export default Register;
