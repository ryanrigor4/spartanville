"use client";

import { useState } from "react";
import { EventList } from "@/components/event-list";
import { AddEventModal } from "@/components/add-event-modal";
import { AIEventAssistant } from "@/components/ai-event-assistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Plus } from "lucide-react";

export default function EventsPage() {
  const [showChat, setShowChat] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="container mx-auto px-4 py-8 relative min-h-screen">
      <h1 className="text-3xl font-bold mb-8">SJSU Events</h1>
      <div className="flex justify-between items-center mb-6">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={() => setShowAddEventModal(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
      <EventList searchQuery={searchQuery} />
      <AddEventModal
        isOpen={showAddEventModal}
        onClose={() => setShowAddEventModal(false)}
      />
      {showChat ? (
        <AIEventAssistant onClose={() => setShowChat(false)} />
      ) : (
        <Button
          className="fixed bottom-4 right-4 rounded-full p-4"
          onClick={() => setShowChat(true)}
        >
          <MessageCircle className="mr-2" />
          AI Event Assistant
        </Button>
      )}
    </div>
  );
}
