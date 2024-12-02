"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  clubAssociation?: string;
  attendanceCount: number;
  userAttending: boolean;
}

interface EventListProps {
  searchQuery: string;
  userEventsOnly?: boolean;
}

export function EventList({
  searchQuery,
  userEventsOnly = false,
}: EventListProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Fetch events from API
    // For now, we'll use dummy data
    setEvents([
      {
        id: "1",
        title: "Welcome Week",
        date: "2023-08-21",
        time: "9:00 AM",
        location: "Student Union",
        image: "/placeholder.svg",
        clubAssociation: "Student Life",
        attendanceCount: 50,
        userAttending: false,
      },
      {
        id: "2",
        title: "Career Fair",
        date: "2023-09-15",
        time: "10:00 AM",
        location: "Event Center",
        image: "/placeholder.svg",
        clubAssociation: "Career Center",
        attendanceCount: 100,
        userAttending: true,
      },
    ]);
  }, []);

  const handleDelete = (id: string) => {
    // Here you would typically call your API to delete the event
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Event deleted",
      description: "The event has been successfully removed.",
    });
  };

  const handleAttendanceChange = (id: string, attending: boolean) => {
    // Here you would typically call your API to update attendance
    setEvents(
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              userAttending: attending,
              attendanceCount: attending
                ? event.attendanceCount + 1
                : event.attendanceCount - 1,
            }
          : event
      )
    );
    toast({
      title: attending ? "Attending event" : "Not attending event",
      description: `You are ${attending ? "now" : "no longer"} attending "${
        events.find((e) => e.id === id)?.title
      }".`,
    });
  };

  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubAssociation
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (!userEventsOnly || event.userAttending)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-48 object-cover mb-4"
            />
            <p>
              <strong>Date:</strong> {event.date}
            </p>
            <p>
              <strong>Time:</strong> {event.time}
            </p>
            <p>
              <strong>Location:</strong> {event.location}
            </p>
            {event.clubAssociation && (
              <p>
                <strong>Club/Association:</strong> {event.clubAssociation}
              </p>
            )}
            <p>
              <strong>Attendance:</strong> {event.attendanceCount} people
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox
                id={`attend-${event.id}`}
                checked={event.userAttending}
                onCheckedChange={(checked) =>
                  handleAttendanceChange(event.id, checked as boolean)
                }
              />
              <label
                htmlFor={`attend-${event.id}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I'm attending
              </label>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={() => handleDelete(event.id)}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
