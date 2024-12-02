"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { auth } from "./firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter, usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const pathname = usePathname();

  // List of paths where navbar should be hidden
  const noNavbarPaths = ["/login", "/signup"];
  const shouldShowNavbar = !noNavbarPaths.includes(pathname);

  if (!user && !noNavbarPaths.includes(pathname)) {
    router.push("/login");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        {shouldShowNavbar && <Navbar />}
        <main>{children}</main>
      </body>
    </html>
  );
}
