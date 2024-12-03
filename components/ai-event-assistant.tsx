"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase/config";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  clubAssociation?: string;
  attendanceCount: number;
}

interface AIEventAssistantProps {
  onClose: () => void;
}

export function AIEventAssistant({ onClose }: AIEventAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Event Assistant. How can I help you with SJSU events today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch events when component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsData = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Event[];
      setEvents(eventsData);
    };

    fetchEvents();
  }, []);

  const processUserQuery = async (query: string) => {
    // Format events data for the AI
    const eventsContext = events
      .map(
        (event) => `
      Event: ${event.title}
      Date: ${event.date}
      Time: ${event.time}
      Location: ${event.location}
      Club/Association: ${event.clubAssociation || "N/A"}
      Attendance: ${event.attendanceCount} people
    `
      )
      .join("\n\n");

    // Prepare the prompt for Anthropic
    const prompt = `
      You are an AI assistant helping users find information about SJSU events. Here are the current events:

      ${eventsContext}

      User question: ${query}

      Please provide a helpful, concise response based on the available event information. If asked about attendance, provide exact numbers. If asked about recommendations, suggest specific events that match the criteria. If the information isn't available, politely say so.

      Format the response in a human-readable that flows into a next well-formed sentence.
    `;

    try {
      // Make API call to your backend endpoint that handles Anthropic
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error getting AI response:", error);
      return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const aiResponse = await processUserQuery(input);
      const aiMessage: Message = {
        role: "assistant",
        content: aiResponse,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-[500px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Event Assistant</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" ? "text-right" : "text-left"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Ask about SJSU events..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "..." : "Send"}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
