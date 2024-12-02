"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase/config";

export function LoginForm() {
  const [email, setEmail] = useState("''");
  const [password, setPassword] = useState("''");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

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
    } catch (error: any) {
      let errorMessage = "Failed to login. Please try again.";

      // Handle specific Firebase auth errors
      switch (error.code) {
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

  const handleGoogleSignIn = async () => {
    // Here you would implement the Google Sign-In logic
    // For now, we'll just simulate a delay and successful login
    setIsLoggingIn(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoggingIn(false);
    console.log({
      title: "Logged in with Google",
      description: "Welcome to Spartanville!",
    });
    router.push("/home");
  };

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
        <Button type="submit" className="w-full" disabled={isLoggingIn}>
          {isLoggingIn ? "'Logging in...'" : "'Login'"}
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
        onClick={handleGoogleSignIn}
        disabled={isLoggingIn}
      >
        <FcGoogle className="mr-2 h-4 w-4" />
        Sign in with Google
      </Button>
    </div>
  );
}
