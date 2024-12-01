import { WeatherWidget } from "@/components/weather-widget";
import { MapEmbed } from "@/components/map-embed";
import { UserEventsSummary } from "@/components/user-events-summary";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Spartanville</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <WeatherWidget />
        <MapEmbed />
      </div>
      <UserEventsSummary />
    </div>
  );
}
