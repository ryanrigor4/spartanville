"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { auth } from "./firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

// export const metadata = {
//   title: "Spartanville",
//   description: "Showcase San Jose State and Student Life",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user] = useAuthState(auth);
  const router = useRouter();

  if (!user) {
    router.push("/login");
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
