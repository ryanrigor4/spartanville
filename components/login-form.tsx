"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "@/app/firebase/config";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [signInWithGoogle, user, loading, googleError] =
    useSignInWithGoogle(auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log({
        title: "Logged in successfully",
        description: "Welcome back to Spartanville!",
      });
      router.push("/home");
    } catch (error) {
      let errorMessage = "Failed to login. Please try again.";
      const authError = error as AuthError;

      // Handle specific Firebase auth errors
      switch (authError.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }

      setError(errorMessage);
      console.error("Login error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle successful Google sign-in
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  // Handle Google sign-in error
  useEffect(() => {
    if (googleError) {
      setError(googleError.message);
      console.error("Google sign-in error:", googleError);
    }
  }, [googleError]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-red-500 dark:text-red-400">{error}</div>
        )}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoggingIn || loading}
        >
          {isLoggingIn ? "Logging in..." : "Login"}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-neutral-500 dark:text-neutral-400">
            Or continue with
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => signInWithGoogle()}
        disabled={isLoggingIn || loading}
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        {loading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </div>
  );
}
