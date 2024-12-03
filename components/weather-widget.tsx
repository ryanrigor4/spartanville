"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Cloud, CloudRain } from "lucide-react";

export function WeatherWidget() {
  const [weather, setWeather] = useState({
    temp: 0,
    condition: "",
    willRain: false,
  });

  const fetchWeatherData = async () => {
    try {
      const response = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=37.3394&longitude=-121.895&current=temperature_2m,precipitation&hourly=temperature_2m,precipitation_probability&temperature_unit=fahrenheit&timezone=America/Los_Angeles"
      );
      const data = await response.json();

      // Get current temperature and check precipitation probability for next few hours
      const currentTemp = Math.round(data.current.temperature_2m);
      const nextFewHours = data.hourly.precipitation_probability.slice(0, 6);
      const willRain = nextFewHours.some((prob) => prob > 30);

      // Determine condition based on precipitation probability
      let condition = "Sunny";
      const currentPrecipProb = nextFewHours[0];
      if (currentPrecipProb > 30) {
        condition = "Rainy";
      } else if (currentPrecipProb > 10) {
        condition = "Partly Cloudy";
      }

      setWeather({
        temp: currentTemp,
        condition: condition,
        willRain: willRain,
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

  const getWeatherIcon = () => {
    if (weather.willRain) return <CloudRain className="w-12 h-12" />;
    if (weather.condition.toLowerCase().includes("cloud"))
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
          <p>{weather.willRain ? "Rain expected" : "No rain expected"}</p>
        </div>
        {getWeatherIcon()}
      </CardContent>
    </Card>
  );
}
