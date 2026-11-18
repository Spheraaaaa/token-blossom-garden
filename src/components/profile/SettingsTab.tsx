
import React, { useState } from "react";
import { Panel } from "./Panel";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, Settings, LogOut, Shield, AlertTriangle, Eye, EyeOff, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

interface SettingsTabProps {
  handleLogout: () => void;
}

const Section = ({ title, description, children }: { title: string; description: string; children: React.ReactNode }) => (
  <div className="grid gap-5 py-7 first:pt-1 last:pb-1 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
    <div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
    <div className="max-w-md">{children}</div>
  </div>
);

export const SettingsTab = ({ handleLogout }: SettingsTabProps) => {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  
  const [passwordStrength, setPasswordStrength] = useState<{
    strength: number;
    text: string;
    color: string;
  }>({
    strength: 0,
    text: "",
    color: ""
  });
  
  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };
  
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    try {
      setIsEmailLoading(true);
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: "Verification email sent",
        description: "Please check your email to verify the change"
      });
      
      setTimeout(() => {
        setEmailSent(false);
        setNewEmail("");
      }, 5000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update email",
        variant: "destructive"
      });
    } finally {
      setIsEmailLoading(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) return;
    
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) throw error;
      
      setPasswordChanged(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      
      toast({
        title: "Password updated",
        description: "Your password has been successfully updated"
      });
      
      setTimeout(() => {
        setPasswordChanged(false);
      }, 5000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate password strength
  React.useEffect(() => {
    if (!newPassword) {
      setPasswordStrength({
        strength: 0,
        text: "",
        color: ""
      });
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (newPassword.length >= 8) strength += 1;
    
    // Contains lowercase
    if (/[a-z]/.test(newPassword)) strength += 1;
    
    // Contains uppercase
    if (/[A-Z]/.test(newPassword)) strength += 1;
    
    // Contains number
    if (/[0-9]/.test(newPassword)) strength += 1;
    
    let text = "";
    let color = "";
    
    switch (strength) {
      case 0:
      case 1:
        text = "Weak";
        color = "bg-red-500";
        break;
      case 2:
        text = "Fair";
        color = "bg-orange-500";
        break;
      case 3:
        text = "Good";
        color = "bg-yellow-500";
        break;
      case 4:
        text = "Strong";
        color = "bg-green-500";
        break;
      default:
        text = "";
        color = "";
    }
    
    setPasswordStrength({ strength, text, color });
  }, [newPassword]);

  const inputClass =
    "h-11 rounded-xl border-border bg-background/60 pl-10 transition-colors hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0";
  const passwordsMismatch = Boolean(newPassword && confirmNewPassword && newPassword !== confirmNewPassword);


  return (
    <Panel title="Account Settings" description="Manage your account email and password settings">
      <div className="divide-y divide-border">
        <Section title="Update Email Address" description="A verification link will be sent to your new email address">
          <form onSubmit={handleEmailChange} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="settings-new-email" className="text-sm font-medium text-foreground">New email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="settings-new-email"
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {emailSent && (
              <p className="flex items-center gap-2 text-sm text-accent" role="status">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Verification email sent!
              </p>
            )}

            <Button type="submit" disabled={isEmailLoading} className="btn-brand h-11 rounded-full px-6 font-semibold">
              {isEmailLoading ? "Processing..." : "Update Email"}
            </Button>
          </form>
        </Section>

        <Section title="Change Password" description="Please make sure your new password is at least 8 characters long">
          <form onSubmit={handlePasswordChange} className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="settings-current-password" className="text-sm font-medium text-foreground">Current Password</label>
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="flex items-center gap-1 rounded text-sm text-primary transition-colors hover:text-primary/80"
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" aria-hidden="true" /> : <Eye className="h-3.5 w-3.5" aria-hidden="true" />}
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </div>
              <div className="relative">
                <Key className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="settings-current-password"
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="settings-new-password" className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <Key className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="settings-new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className={inputClass}
                />
              </div>

              {newPassword && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span
                      className={`font-medium ${
                        passwordStrength.text === "Weak" || passwordStrength.text === "Fair"
                          ? "text-orange-400"
                          : passwordStrength.text === "Good"
                            ? "text-yellow-400"
                            : "text-accent"
                      }`}
                    >
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="settings-confirm-password" className="text-sm font-medium text-foreground">Confirm New Password</label>
              <div className="relative">
                <Key className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="settings-confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-invalid={passwordsMismatch}
                  className={`${inputClass} pr-10 ${passwordsMismatch ? "border-red-500/70 focus-visible:border-red-500" : ""}`}
                />
                {newPassword && confirmNewPassword && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {passwordsMismatch ? (
                      <X className="h-4 w-4 text-red-400" aria-hidden="true" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-accent" aria-hidden="true" />
                    )}
                  </span>
                )}
              </div>

              {passwordsMismatch && (
                <p className="flex items-center gap-1.5 text-sm text-red-400" role="alert">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  Passwords don't match
                </p>
              )}
            </div>

            {passwordChanged && (
              <p className="flex items-center gap-2 text-sm text-accent" role="status">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Password updated successfully!
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading || passwordsMismatch}
              className="btn-brand h-11 rounded-full px-6 font-semibold"
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </Section>

        <Section title="Logout" description="Sign out of your account on this device">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="h-11 gap-2 rounded-full border-red-500/40 px-6 text-red-400 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>Logout</span>
          </Button>
        </Section>
      </div>
    </Panel>
  );
};
