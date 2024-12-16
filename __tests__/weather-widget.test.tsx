import { render, screen, waitFor } from "@testing-library/react";
import { WeatherWidget } from "../components/weather-widget";

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        current: {
          temperature_2m: 75,
        },
        hourly: {
          time: Array(24).fill("2024-01-01T00:00"),
          temperature_2m: Array(24).fill(75),
          precipitation_probability: Array(24).fill(5),
        },
      }),
  })
) as jest.Mock;

describe("WeatherWidget", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the weather widget with all components", async () => {
    render(<WeatherWidget />);

    // Check if the title is rendered
    expect(screen.getByText("Current Weather at SJSU")).toBeInTheDocument();

    // Wait for the data to be loaded
    await waitFor(() => {
      expect(screen.getAllByText("75°F")[0]).toBeInTheDocument();
    });

    // Check if weather condition is displayed
    expect(screen.getByText("Sunny")).toBeInTheDocument();

    // Check if weather icons are present
    const weatherIcons = document.querySelectorAll(
      '[data-testid="weather-icon"]'
    );
    expect(weatherIcons.length).toBeGreaterThan(0);
  });
});
