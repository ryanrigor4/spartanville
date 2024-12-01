"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

export function UserEventsSummary() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Fetch user's events from API
    // For now, we'll use dummy data
    setEvents([
      {
        id: "'1'",
        title: "'Welcome Week'",
        date: "'2023-08-21'",
        time: "'9:00 AM'",
        location: "'Student Union'",
      },
      {
        id: "'2'",
        title: "'Career Fair'",
        date: "'2023-09-15'",
        time: "'10:00 AM'",
        location: "'Event Center'",
      },
      {
        id: "'3'",
        title: "'Hackathon'",
        date: "'2023-10-01'",
        time: "'8:00 AM'",
        location: "'Engineering Building'",
      },
    ]);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p>You haven't signed up for any events yet.</p>
        ) : (
          <ul className="space-y-2">
            {events.map((event) => (
              <li key={event.id} className="flex justify-between items-center">
                <div>
                  <Link
                    href={`/events#${event.id}`}
                    className="font-medium hover:underline"
                  >
                    {event.title}
                  </Link>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {event.date} at {event.time}
                  </p>
                </div>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  {event.location}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Link
            href="/events"
            className="text-sm text-neutral-900 hover:underline dark:text-neutral-50"
          >
            View all events
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
