import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, UserRound } from "lucide-react";
import type { UserData } from "@/types/user";

interface ProfileHeaderProps {
  userData: UserData | null;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({ userData, handleAvatarUpload }: ProfileHeaderProps) => {
  const memberSince = userData?.created_at
    ? new Date(userData.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    : "";

  return (
    <div className="flex items-center gap-4 lg:flex-col lg:items-start">
      <div className="relative shrink-0">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="peer sr-only"
          id="avatar-upload"
        />
        <label
          htmlFor="avatar-upload"
          className="group relative block cursor-pointer rounded-2xl peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background"
        >
          <Avatar className="h-16 w-16 rounded-2xl ring-1 ring-border lg:h-20 lg:w-20">
            {userData?.avatar_url ? (
              <AvatarImage
                src={userData.avatar_url}
                alt={userData.login}
                className="rounded-2xl object-cover"
                loading="eager"
                fetchPriority="high"
              />
            ) : (
              <AvatarFallback className="rounded-2xl bg-primary/10">
                <UserRound className="h-8 w-8 text-primary" />
              </AvatarFallback>
            )}
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <Camera className="h-5 w-5 text-foreground" aria-hidden="true" />
            <span className="sr-only">Change avatar</span>
          </span>
        </label>
      </div>

      <div className="min-w-0">
        <h1 className="truncate font-display text-2xl font-bold text-foreground lg:text-[1.75rem]">
          @{userData?.login}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Member since {memberSince}</p>
      </div>
    </div>
  );
};
