/**
 * @jest-environment jsdom
 */

const React = require("react");
const { render, screen } = require("@testing-library/react");

// Mock the utils module
jest.mock("@/lib/utils", () => ({
  cn: (...args: any[]) => args.filter(Boolean).join(" "),
}));

const { MapEmbed } = require("@/components/map-embed");

describe("MapEmbed", () => {
  it("renders the map component with correct title and iframe", () => {
    render(<MapEmbed />);

    // Check if the title is rendered
    expect(screen.getByText("SJSU Campus Map")).toBeInTheDocument();

    // Check if iframe is rendered with correct attributes
    const iframe = screen.getByTitle("SJSU Campus Map");
    expect(iframe).toBeInTheDocument();
    expect(iframe.tagName.toLowerCase()).toBe("iframe");
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("google.com/maps/embed")
    );
    expect(iframe).toHaveAttribute("width", "100%");
    expect(iframe).toHaveAttribute("height", "300");
    expect(iframe).toHaveAttribute("loading", "lazy");
    expect(iframe).toHaveAttribute("allowfullscreen");
  });
});
