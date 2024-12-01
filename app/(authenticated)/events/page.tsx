import { EventList } from "@/components/event-list";
import { EventForm } from "@/components/event-form";

export default function EventsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">SJSU Events</h1>
      <EventForm />
      <EventList />
    </div>
  );
}
