/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Firebase config and auth
jest.mock("@/app/firebase/config", () => ({
  auth: {},
}));

// Mock Firebase auth
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  getAuth: jest.fn(),
  initializeApp: jest.fn(),
  getApp: jest.fn(),
  getApps: jest.fn(() => []),
}));

// Mock Firebase hooks
jest.mock("react-firebase-hooks/auth", () => ({
  useSignInWithGoogle: () => [jest.fn(), null, false, null],
}));

describe("LoginForm", () => {
  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it("renders login form with all fields and buttons", () => {
    render(<LoginForm />);

    // Check for form elements
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in with google/i })
    ).toBeInTheDocument();
  });

  it("updates form values when typing", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Type in the form fields
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Check if values are updated
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("disables login button while submitting", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByRole("button", { name: /login/i });

    // Fill out the form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    fireEvent.submit(loginButton);

    // Check if button is disabled and shows loading state
    expect(loginButton).toBeDisabled();
    expect(loginButton).toHaveTextContent(/logging in/i);
  });

  it("requires email and password fields", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Check if fields are required
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
  });

  it("has correct input types for email and password", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Check input types
    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("has proper form submission handling", () => {
    const { container } = render(<LoginForm />);

    const form = container.querySelector("form.space-y-4");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("space-y-4");
  });

  it("has proper button styling", () => {
    render(<LoginForm />);

    const loginButton = screen.getByRole("button", { name: /login/i });
    const googleButton = screen.getByRole("button", {
      name: /sign in with google/i,
    });

    // Check button styling
    expect(loginButton).toHaveClass("w-full");
    expect(googleButton).toHaveClass("w-full");
  });

  it("shows separator between login options", () => {
    render(<LoginForm />);

    expect(screen.getByText(/or continue with/i)).toBeInTheDocument();
  });

  it("maintains form state after failed submission", () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");

    // Fill out the form
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit the form
    fireEvent.submit(screen.getByRole("button", { name: /login/i }));

    // Check if values are maintained
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
