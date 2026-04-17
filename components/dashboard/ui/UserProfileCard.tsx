"use client";

import { MapPin, Pencil } from "lucide-react";
import Image from "next/image";

export type UserProfileData = {
  name: string;
  accountId: string;
  location: string;
  avatarUrl?: string;
};

interface UserProfileCardProps {
  user: UserProfileData;
  onEdit?: () => void;
}

export default function UserProfileCard({ user, onEdit }: UserProfileCardProps) {
  return (
    <div className="flex items-start gap-4">
      {/* Avatar */}
      <div className="relative h-44 w-44 overflow-hidden rounded-2xl bg-slate-100">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={user.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary text-white text-4xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 pt-2">
        <h3 className="text-2xl font-bold text-slate-700">{user.name}</h3>
        <p className="text-base text-slate-400">Account ID: {user.accountId}</p>
        
        <div className="mt-2 flex items-center gap-1 text-slate-700">
          <MapPin className="h-5 w-5" />
          <span className="text-base">{user.location}</span>
        </div>
      </div>

      {/* Edit Button */}
      {onEdit && (
        <button
          onClick={onEdit}
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
          aria-label="Edit profile"
        >
          <Pencil className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
