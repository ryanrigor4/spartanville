"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ManageAccountModal } from "@/components/manage-account-modal";

export function Navbar() {
  const [showManageAccountModal, setShowManageAccountModal] = useState(false);

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home" className="text-2xl font-bold">
          Spartanville
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/home">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/events">Events</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowManageAccountModal(true)}
          >
            Manage Account
          </Button>
        </div>
      </div>
      <ManageAccountModal
        isOpen={showManageAccountModal}
        onClose={() => setShowManageAccountModal(false)}
      />
    </nav>
  );
}
