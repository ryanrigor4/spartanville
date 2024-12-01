"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/login-form";
import { useToast } from "@/hooks/use-toast";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const loggedOut = searchParams.get("'loggedOut'");
    if (loggedOut === "'true'") {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Login to Spartanville
        </h1>
        <LoginForm />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Button variant="link" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
