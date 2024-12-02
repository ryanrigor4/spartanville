"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const [title, setTitle] = useState("''");
  const [date, setDate] = useState("''");
  const [time, setTime] = useState("''");
  const [location, setLocation] = useState("''");
  const [image, setImage] = useState("''");
  const [clubAssociation, setClubAssociation] = useState("''");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call your API to create a new event
    console.log("'New event:'", {
      title,
      date,
      time,
      location,
      image,
      clubAssociation,
    });
    toast({
      title: "Event created",
      description: "Your new event has been successfully added.",
    });
    // Reset form and close modal
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle("''");
    setDate("''");
    setTime("''");
    setLocation("''");
    setImage("''");
    setClubAssociation("''");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
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
          <Input
            type="text"
            placeholder="Club/Association"
            value={clubAssociation}
            onChange={(e) => setClubAssociation(e.target.value)}
          />
          <DialogFooter>
            <Button type="submit">Add Event</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
