"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { auth } from "./firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  // List of paths where navbar should be hidden and auth is not required
  const publicPaths = ["/login", "/signup"];
  const shouldShowNavbar = !publicPaths.includes(pathname);
  const isPublicRoute = publicPaths.includes(pathname);

  useEffect(() => {
    if (!loading) {
      // Only redirect to login if user is not authenticated and trying to access a protected route
      if (!user && !isPublicRoute) {
        router.push("/login");
      }
    }
  }, [user, loading, isPublicRoute, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {shouldShowNavbar && user && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
