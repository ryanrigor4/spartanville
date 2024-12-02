"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signOut } from "firebase/auth";
import { auth } from "@/app/firebase/config";

interface ManageAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManageAccountModal({
  isOpen,
  onClose,
}: ManageAccountModalProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("''");
  const [newPassword, setNewPassword] = useState("''");
  const [confirmNewPassword, setConfirmNewPassword] = useState("''");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Here you would typically call your logout API
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoggingOut(false);
    onClose();
    router.push("/login");
    console.log({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      console.log({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    setIsResettingPassword(true);
    // Here you would typically call your password reset API
    // For now, we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsResettingPassword(false);
    setCurrentPassword("''");
    setNewPassword("''");
    setConfirmNewPassword("''");
    onClose();
    console.log({
      title: "Password reset successfully",
      description: "Your password has been updated.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Account</DialogTitle>
          <DialogDescription>
            Manage your account settings or log out.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-new-password">Confirm New Password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isResettingPassword}>
              {isResettingPassword ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-neutral-500 dark:bg-neutral-950 dark:text-neutral-400">
                Or
              </span>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="outline"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
