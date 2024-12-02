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
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db, auth } from "@/app/firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";

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
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener for events
    const unsubscribe = onSnapshot(collection(db, "events"), (snapshot) => {
      const eventData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        userAttending: false, // We'll update this based on user's attendance
      })) as Event[];

      setEvents(eventData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "events", id));
      toast({
        title: "Event deleted",
        description: "The event has been successfully removed.",
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete the event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAttendanceChange = async (id: string, attending: boolean) => {
    if (!user) return;

    try {
      const eventRef = doc(db, "events", id);
      await updateDoc(eventRef, {
        attendanceCount: increment(attending ? 1 : -1),
      });

      // Update local state for immediate UI feedback
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
    } catch (error) {
      console.error("Error updating attendance:", error);
      toast({
        title: "Error",
        description: "Failed to update attendance. Please try again.",
        variant: "destructive",
      });
    }
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
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center mb-4">
                No image available
              </div>
            )}
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
                I&apos;m attending
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
