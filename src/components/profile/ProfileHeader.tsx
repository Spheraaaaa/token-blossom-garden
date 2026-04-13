
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";
import type { UserData } from "@/types/user";

interface ProfileHeaderProps {
  userData: UserData | null;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ userData, handleAvatarUpload }: ProfileHeaderProps) => {
  return (
    <div className="balance-card relative p-8 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/30 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group balance-card">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleAvatarUpload} 
            className="hidden" 
            id="avatar-upload" 
          />
          <label htmlFor="avatar-upload" className="cursor-pointer block relative">
            <Avatar className="w-24 h-24 rounded-2xl border-2 border-border/30 shadow-xl transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-primary/10 hover:scale-105">
              {userData?.avatar_url ? (
                <AvatarImage 
                  src={userData.avatar_url} 
                  alt={userData.login} 
                  className="rounded-2xl" 
                  loading="eager"
                  fetchPriority="high"
                />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
                  <UserRound className="w-12 h-12 text-primary" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center transform group-hover:scale-105">
              <p className="text-white text-sm font-medium">Change Avatar</p>
            </div>
          </label>
        </div>
        
        <div className="text-center sm:text-left balance-card">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
            <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              @{userData?.login}
            </span>
          </h1>
          <p className="text-muted-foreground">
            Member since {userData?.created_at ? new Date(userData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
