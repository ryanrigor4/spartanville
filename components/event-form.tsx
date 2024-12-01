"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast"

export function EventForm() {
  const [title, setTitle] = useState("''");
  const [date, setDate] = useState("''");
  const [time, setTime] = useState("''");
  const [location, setLocation] = useState("''");
  const [image, setImage] = useState("''");
  // const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your API to create a new event
    console.log("'New event:'", { title, date, time, location, image });
    console.log({
      title: "Event created",
      description: "Your new event has been successfully added.",
    });
    // Reset form
    setTitle("''");
    setDate("''");
    setTime("''");
    setLocation("''");
    setImage("''");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />
      <Input
        type="url"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button type="submit">Add Event</Button>
    </form>
  );
}
