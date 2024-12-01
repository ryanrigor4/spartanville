"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from "lucide-react";

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 0,
    condition: "''",
    willRain: false,
  });

  useEffect(() => {
    // Fetch weather data from API
    // For now, we'll use dummy data
    setWeather({ temp: 72, condition: "'Partly Cloudy'", willRain: false });
  }, []);

  const getWeatherIcon = () => {
    if (weather.willRain) return <CloudRain className="w-12 h-12" />;
    if (weather.condition.toLowerCase().includes("'cloud'"))
      return <Cloud className="w-12 h-12" />;
    return <Sun className="w-12 h-12" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather at SJSU</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-4xl font-bold">{weather.temp}°F</p>
          <p>{weather.condition}</p>
          <p>{weather.willRain ? "'Rain expected'" : "'No rain expected'"}</p>
        </div>
        {getWeatherIcon()}
      </CardContent>
    </Card>
  );
}
