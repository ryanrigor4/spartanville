/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AddEventModal } from "@/components/add-event-modal";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc } from "firebase/firestore";

// Mock Firebase
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

jest.mock("@/app/firebase/config", () => ({
  db: {},
}));

// Mock the toast hook
jest.mock("@/hooks/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("AddEventModal", () => {
  const mockOnClose = jest.fn();
  const mockToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it("renders all form fields correctly", () => {
    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("add-event-form")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Event Title")).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event time/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Location")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Image URL (optional)")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Club/Association (optional)")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add event/i })
    ).toBeInTheDocument();
  });

  it("updates form values when typing", () => {
    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    const titleInput = screen.getByPlaceholderText("Event Title");
    const dateInput = screen.getByLabelText(/event date/i);
    const timeInput = screen.getByLabelText(/event time/i);
    const locationInput = screen.getByPlaceholderText("Location");
    const imageInput = screen.getByPlaceholderText("Image URL (optional)");
    const clubInput = screen.getByPlaceholderText(
      "Club/Association (optional)"
    );

    fireEvent.change(titleInput, { target: { value: "Test Event" } });
    fireEvent.change(dateInput, { target: { value: "2024-01-01" } });
    fireEvent.change(timeInput, { target: { value: "12:00" } });
    fireEvent.change(locationInput, { target: { value: "Test Location" } });
    fireEvent.change(imageInput, {
      target: { value: "https://test.com/image.jpg" },
    });
    fireEvent.change(clubInput, { target: { value: "Test Club" } });

    expect(titleInput).toHaveValue("Test Event");
    expect(dateInput).toHaveValue("2024-01-01");
    expect(timeInput).toHaveValue("12:00");
    expect(locationInput).toHaveValue("Test Location");
    expect(imageInput).toHaveValue("https://test.com/image.jpg");
    expect(clubInput).toHaveValue("Test Club");
  });

  it("validates required fields", () => {
    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    const form = screen.getByTestId("add-event-form");
    const titleInput = screen.getByPlaceholderText("Event Title");
    const dateInput = screen.getByLabelText(/event date/i);
    const timeInput = screen.getByLabelText(/event time/i);
    const locationInput = screen.getByPlaceholderText("Location");

    expect(titleInput).toBeRequired();
    expect(dateInput).toBeRequired();
    expect(timeInput).toBeRequired();
    expect(locationInput).toBeRequired();
  });

  it("handles form submission correctly", async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({});

    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Event Title"), {
      target: { value: "Test Event" },
    });
    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/event time/i), {
      target: { value: "12:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Test Location" },
    });

    // Submit the form
    const submitButton = screen.getByRole("button", { name: /add event/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent("Adding...");
    });

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Event created",
        description: "Your new event has been successfully added.",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("handles submission errors correctly", async () => {
    (addDoc as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Event Title"), {
      target: { value: "Test Event" },
    });
    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/event time/i), {
      target: { value: "12:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Test Location" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add event/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
    });
  });

  it("resets form on successful submission", async () => {
    (addDoc as jest.Mock).mockResolvedValueOnce({});

    render(<AddEventModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText("Event Title"), {
      target: { value: "Test Event" },
    });
    fireEvent.change(screen.getByLabelText(/event date/i), {
      target: { value: "2024-01-01" },
    });
    fireEvent.change(screen.getByLabelText(/event time/i), {
      target: { value: "12:00" },
    });
    fireEvent.change(screen.getByPlaceholderText("Location"), {
      target: { value: "Test Location" },
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /add event/i }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Event Title")).toHaveValue("");
      expect(screen.getByPlaceholderText("Location")).toHaveValue("");
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});