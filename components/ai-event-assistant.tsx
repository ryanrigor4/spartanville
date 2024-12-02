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

interface Message {
  role: "'user'" | "'assistant'";
  content: string;
}

interface AIEventAssistantProps {
  onClose: () => void;
}

export function AIEventAssistant({ onClose }: AIEventAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "'assistant'",
      content:
        "'Hello! I'm your AI Event Assistant. How can I help you with SJSU events today?'",
    },
  ]);
  const [input, setInput] = useState("''");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "'user'", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("''");

    // Here you would typically call your AI API
    // For now, we'll use a dummy response
    setTimeout(() => {
      const aiMessage: Message = {
        role: "'assistant'",
        content: `Thank you for your question about "${input}". Here's some information about SJSU events: [AI-generated content would go here]`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "'smooth'" });
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
                message.role === "'user'" ? "'text-right'" : "'text-left'"
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.role === "'user'"
                    ? "'bg-primary text-primary-foreground'"
                    : "'bg-muted'"
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
          />
          <Button type="submit">Send</Button>
        </form>
      </CardFooter>
    </Card>
  );
}
