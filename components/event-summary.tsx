import { useState } from "'react'";
import Link from "'next/link'";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
}

export function EventSummary() {
  const [events] = useState<Event[]>([
    { id: "'1'", title: "'Welcome Week'", date: "'2023-08-21'", time: "'9:00 AM'", location: "'Student Union'", image: "'/placeholder.svg?height=100&width=100'" },
    { id: "'2'", title: "'Career Fair'", date: "'2023-09-15'", time: "'10:00 AM'", location: "'Event Center'", image: "'/placeholder.svg?height=100&width=100'" },
  ])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="flex items-center space-x-4">
              <img src={event.image} alt={event.title} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <Link href={`/events#${event.id}`} className="font-semibold hover:underline">
                  {event.title}
                </Link>
                <p className="text-sm text-gray-600">{event.date} at {event.time}</p>
                <p className="text-sm text-gray-600">{event.location}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

const CardContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {children}
    </div>
  );
};

