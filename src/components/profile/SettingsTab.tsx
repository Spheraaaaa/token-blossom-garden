
import React, { useState } from "react";
import { Panel } from "./Panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Key, LogOut, AlertTriangle, Eye, EyeOff, CheckCircle2, Check, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface SettingsTabProps {
  handleLogout: () => void;
  currentEmail?: string;
}

const PASSWORD_RULES: { label: string; test: (value: string) => boolean }[] = [
  { label: "At least 8 characters", test: v => v.length >= 8 },
  { label: "One lowercase letter", test: v => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: v => /[A-Z]/.test(v) },
  { label: "One number", test: v => /[0-9]/.test(v) },
];

const inputClass =
  "h-11 rounded-xl border-border bg-background/60 pl-10 transition-colors hover:border-primary/30 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/25 focus-visible:ring-offset-0";

/** Brand gradient when actionable; a calm neutral pill while the form is incomplete. */
const submitClass =
  "btn-brand h-10 shrink-0 rounded-full px-5 font-semibold disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100 disabled:shadow-none";

const Field = ({ id, label, icon: Icon, children }: { id: string; label: string; icon: React.ElementType; children: React.ReactNode }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-foreground">
      {label}
    </label>
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      {children}
    </div>
  </div>
);

const RevealButton = ({ shown, onToggle }: { shown: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={shown ? "Hide passwords" : "Show passwords"}
    aria-pressed={shown}
    className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
  >
    {shown ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
  </button>
);

export const SettingsTab = ({ handleLogout, currentEmail }: SettingsTabProps) => {
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

  const rulesMet = PASSWORD_RULES.map(rule => rule.test(newPassword));
  const strength = rulesMet.filter(Boolean).length;
  const strengthLabel = ["Weak", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthTone =
    strength <= 1 ? "bg-red-500" : strength === 2 ? "bg-orange-500" : strength === 3 ? "bg-yellow-500" : "bg-accent";
  const strengthText =
    strength <= 1 ? "text-red-400" : strength === 2 ? "text-orange-400" : strength === 3 ? "text-yellow-400" : "text-accent";

  const passwordsMismatch = Boolean(newPassword && confirmNewPassword && newPassword !== confirmNewPassword);
  const passwordsMatch = Boolean(newPassword && confirmNewPassword && newPassword === confirmNewPassword);

  return (
    <div className="space-y-6">
      {/* Email */}
      <Panel
        title="Email address"
        description="Used to sign in and to receive account notifications"
        footer={
          <>
            {emailSent ? (
              <p className="flex items-center gap-2 text-sm text-accent" role="status">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Verification email sent. Check your new inbox.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">A verification link will be sent to your new email address</p>
            )}
            <Button
              type="submit"
              form="settings-email-form"
              disabled={isEmailLoading || !newEmail}
              className={submitClass}
            >
              {isEmailLoading ? "Processing..." : "Update Email"}
            </Button>
          </>
        }
      >
        <form id="settings-email-form" onSubmit={handleEmailChange} className="grid gap-5 md:grid-cols-2">
          {currentEmail && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Current email</p>
              <div className="flex h-11 items-center gap-2.5 rounded-xl border border-dashed border-border px-3.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{currentEmail}</span>
              </div>
            </div>
          )}
          <Field id="settings-new-email" label="New email" icon={Mail}>
            <Input
              id="settings-new-email"
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="name@example.com"
              required
              autoComplete="email"
              className={inputClass}
            />
          </Field>
        </form>
      </Panel>

      {/* Password */}
      <Panel
        title="Password"
        description="Choose a strong password you don't use anywhere else"
        footer={
          <>
            {passwordChanged ? (
              <p className="flex items-center gap-2 text-sm text-accent" role="status">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Password updated successfully!
              </p>
            ) : passwordsMismatch ? (
              <p className="flex items-center gap-2 text-sm text-red-400" role="alert">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Passwords don't match
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">You'll stay signed in on this device</p>
            )}
            <Button
              type="submit"
              form="settings-password-form"
              disabled={isLoading || passwordsMismatch || !currentPassword || !newPassword || !confirmNewPassword}
              className={submitClass}
            >
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </>
        }
      >
        <form id="settings-password-form" onSubmit={handlePasswordChange} className="grid gap-x-5 gap-y-5 md:grid-cols-2">
          <div className="md:col-span-2 md:max-w-[calc(50%-0.625rem)]">
            <Field id="settings-current-password" label="Current password" icon={Key}>
              <Input
                id="settings-current-password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputClass} pr-11`}
              />
              <RevealButton shown={showPassword} onToggle={togglePasswordVisibility} />
            </Field>
          </div>

          <Field id="settings-new-password" label="New password" icon={Key}>
            <Input
              id="settings-new-password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-describedby="settings-password-rules"
              className={`${inputClass} pr-11`}
            />
            <RevealButton shown={showPassword} onToggle={togglePasswordVisibility} />
          </Field>

          <Field id="settings-confirm-password" label="Confirm new password" icon={Key}>
            <Input
              id="settings-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={e => setConfirmNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-invalid={passwordsMismatch}
              className={`${inputClass} pr-11 ${
                passwordsMismatch ? "border-red-500/70 focus-visible:border-red-500" : passwordsMatch ? "border-accent/50" : ""
              }`}
            />
            {passwordsMatch && (
              <CheckCircle2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-accent" aria-label="Passwords match" />
            )}
          </Field>

          <div id="settings-password-rules" className="rounded-xl bg-background/50 p-4 md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-foreground">Password strength</p>
              <p className={`text-sm font-medium ${newPassword ? strengthText : "text-muted-foreground"}`}>
                {newPassword ? strengthLabel : "—"}
              </p>
            </div>
            <div className="mt-2.5 grid grid-cols-4 gap-1.5" aria-hidden="true">
              {[0, 1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-colors duration-300 ${newPassword && i < strength ? strengthTone : "bg-muted"}`}
                />
              ))}
            </div>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {PASSWORD_RULES.map((rule, i) => (
                <li
                  key={rule.label}
                  className={`flex items-center gap-2 text-sm transition-colors ${rulesMet[i] ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {rulesMet[i] ? (
                    <Check className="h-4 w-4 text-accent" aria-hidden="true" />
                  ) : (
                    <Circle className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
                  )}
                  {rule.label}
                  <span className="sr-only">{rulesMet[i] ? "(met)" : "(not met)"}</span>
                </li>
              ))}
            </ul>
          </div>
        </form>
      </Panel>

      {/* Session */}
      <section className="flex flex-col gap-4 rounded-2xl border border-red-500/20 bg-card px-5 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-base font-semibold text-foreground">Sign out</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Sign out of your account on this device</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="h-10 shrink-0 gap-2 rounded-full border-red-500/40 bg-transparent px-5 text-red-400 hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Logout
        </Button>
      </section>
    </div>
  );
};
