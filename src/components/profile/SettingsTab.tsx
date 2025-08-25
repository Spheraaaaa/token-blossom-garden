
import React, { useState } from "react";
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

  return (
    <Card className="bg-card/60 backdrop-blur-xl border border-border/30 shadow-lg rounded-2xl">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-primary" />
          </div>
          Account Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Account Security Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Account Security</h3>
              <p className="text-sm text-muted-foreground">Manage your account email and password settings</p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-border/30" />
        
        {/* Email Change Form */}
        <form onSubmit={handleEmailChange} className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Update Email Address</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              A verification link will be sent to your new email address
            </p>
          </div>
          
          <div className="relative">
            <Input 
              type="email" 
              value={newEmail} 
              onChange={e => setNewEmail(e.target.value)} 
              placeholder="Enter new email address" 
              required 
              className="bg-muted/40 border-border/30 pl-10 h-12 rounded-xl"
            />
            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            
            {emailSent && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>
          
          {emailSent && (
            <div className="text-sm text-green-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verification email sent!
            </div>
          )}
          
          <Button 
            type="submit" 
            disabled={isEmailLoading}
            className="bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12 px-6"
          >
            {isEmailLoading ? "Processing..." : "Update Email"}
          </Button>
        </form>
        
        <Separator className="bg-border/30" />
        
        {/* Password Change Form */}
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-primary" />
              <h4 className="font-medium text-foreground">Change Password</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Please make sure your new password is at least 8 characters long
            </p>
          </div>
          
          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-primary hover:text-primary/80 transition-colors text-sm flex items-center gap-1"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  required 
                  className="bg-muted/40 border-border/30 pl-10 h-12 rounded-xl" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            
            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  required 
                  className="bg-muted/40 border-border/30 pl-10 h-12 rounded-xl" 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              
              {newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength.text === "Weak" || passwordStrength.text === "Fair" 
                        ? "text-orange-500" 
                        : passwordStrength.text === "Good" 
                          ? "text-yellow-500" 
                          : "text-green-500"
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm New Password</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)} 
                  required 
                  className={`bg-muted/40 border-border/30 pl-10 pr-10 h-12 rounded-xl ${
                    newPassword && confirmNewPassword && newPassword !== confirmNewPassword
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`} 
                />
                <Key className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                
                {newPassword && confirmNewPassword && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {newPassword === confirmNewPassword ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
              
              {newPassword && confirmNewPassword && newPassword !== confirmNewPassword && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Passwords don't match
                </p>
              )}
            </div>
          </div>
          
          {passwordChanged && (
            <div className="text-sm text-green-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Password updated successfully!
            </div>
          )}
          
          <Button 
            type="submit"
            disabled={isLoading || (newPassword && confirmNewPassword && newPassword !== confirmNewPassword)} 
            className="bg-gradient-to-r from-primary via-accent to-secondary hover:from-primary/90 hover:via-accent/90 hover:to-secondary/90 text-white font-medium rounded-xl h-12 px-6"
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="pt-0 border-t border-border/30 mt-6">
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </CardFooter>
    </Card>
  );
};
