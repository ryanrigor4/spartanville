"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export function EventList({ searchQuery }: { searchQuery?: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, using mock data instead of API call
        setEvents([
          {
            id: "1",
            title: "Welcome Week",
            date: "2024-08-21",
            time: "9:00 AM",
            location: "Student Union",
          },
          {
            id: "2",
            title: "Career Fair",
            date: "2024-09-15",
            time: "10:00 AM",
            location: "Event Center",
          },
        ]);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to fetch events")
        );
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredEvents = searchQuery
    ? events.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : events;

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {filteredEvents.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Date: {event.date}</p>
            <p className="text-sm text-gray-600">Time: {event.time}</p>
            <p className="text-sm text-gray-600">Location: {event.location}</p>
          </CardContent>
        </Card>
      ))}
      {filteredEvents.length === 0 && (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </div>
  );
}
