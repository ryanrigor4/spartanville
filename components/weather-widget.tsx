"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from "lucide-react";

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    current: {
      temp: 0,
      condition: "",
    },
    hourly: [] as {
      time: string;
      temp: number;
      precipProb: number;
    }[],
  });

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=37.3394&longitude=-121.895&current=temperature_2m,precipitation&hourly=temperature_2m,precipitation_probability&temperature_unit=fahrenheit&timezone=America/Los_Angeles"
      );
      const data = await response.json();

      // Get current hour index
      const currentHour = new Date().getHours();

      // Get current temperature and next 4 hours starting from current hour
      const currentTemp = Math.round(data.current.temperature_2m);
      const nextHours = data.hourly.time
        .slice(currentHour, currentHour + 4)
        .map((time: string, index: number) => ({
          time: new Date(time).toLocaleTimeString("en-US", { hour: "numeric" }),
          temp: Math.round(data.hourly.temperature_2m[currentHour + index]),
          precipProb:
            data.hourly.precipitation_probability[currentHour + index],
        }));

      // Determine current condition
      const currentPrecipProb = data.hourly.precipitation_probability[0];
      let condition = "Sunny";
      if (currentPrecipProb > 30) {
        condition = "Rainy";
      } else if (currentPrecipProb > 10) {
        condition = "Partly Cloudy";
      }

      setWeather({
        current: {
          temp: currentTemp,
          condition: condition,
        },
        hourly: nextHours,
      });
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (precipProb: number) => {
    if (precipProb > 30)
      return <CloudRain data-testid="weather-icon" className="w-6 h-6" />;
    if (precipProb > 10)
      return <Cloud data-testid="weather-icon" className="w-6 h-6" />;
    return <Sun data-testid="weather-icon" className="w-6 h-6" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Weather at SJSU</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">{weather.current.temp}°F</p>
            <p className="text-lg">{weather.current.condition}</p>
          </div>
          {getWeatherIcon(weather.hourly[0]?.precipProb || 0)}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {weather.hourly.map((hour, index) => (
            <div key={index} className="text-center p-2 rounded-lg bg-muted">
              <p className="font-medium">{hour.time}</p>
              <div className="my-1">{getWeatherIcon(hour.precipProb)}</div>
              <p className="text-sm">{hour.temp}°F</p>
              <p className="text-xs text-muted-foreground">
                {hour.precipProb}% rain
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}