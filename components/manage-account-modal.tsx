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
import {
  signOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  AuthError,
} from "firebase/auth";
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
      onClose();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setIsResettingPassword(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        setError("No user is currently logged in.");
        console.error("No user found or email is missing");
        return;
      }

      console.log("Starting password reset process for user:", user.email);

      // First, reauthenticate the user
      try {
        console.log("Attempting to reauthenticate user");
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        console.log("Reauthentication successful");
      } catch (reAuthError) {
        const authError = reAuthError as AuthError;
        console.error("Reauthentication failed:", authError);
        if (authError.code === "auth/wrong-password") {
          setError("Current password is incorrect.");
        } else {
          setError("Failed to verify current password. Please try again.");
        }
        return;
      }

      // Then update the password
      try {
        console.log("Attempting to update password");
        await updatePassword(user, newPassword);
        console.log("Password update successful");

        // Clear form and close modal only if successful
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        onClose();
      } catch (updateError) {
        const authError = updateError as AuthError;
        console.error("Password update failed:", authError);

        switch (authError.code) {
          case "auth/weak-password":
            setError(
              "New password is too weak. Please choose a stronger password."
            );
            break;
          case "auth/requires-recent-login":
            setError("Please log in again before changing your password.");
            break;
          default:
            setError(`Failed to update password: ${authError.message}`);
        }
      }
    } catch (error) {
      const authError = error as AuthError;
      console.error("Password reset process failed:", authError);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsResettingPassword(false);
    }
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
            {error && (
              <div className="text-sm text-red-500 dark:text-red-400">
                {error}
              </div>
            )}
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
