import { render, screen } from "@testing-library/react";
import { ChatBubble } from "./ChatBubble";

describe("ChatBubble", () => {
  it("renders user message with sender name and content", () => {
    render(
      <ChatBubble role="user" sender="admin" content="Hello there!" />
    );
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("Hello there!")).toBeInTheDocument();
  });

  it("renders agent message with sender name and content", () => {
    render(
      <ChatBubble role="agent" sender="Agent" content="How can I help?" />
    );
    expect(screen.getByText("Agent")).toBeInTheDocument();
    expect(screen.getByText("How can I help?")).toBeInTheDocument();
  });

  it("renders timestamp when provided", () => {
    render(
      <ChatBubble
        role="user"
        sender="admin"
        content="Hello"
        timestamp="2:30 PM"
      />
    );
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
  });

  it("does not render timestamp when not provided", () => {
    const { container } = render(
      <ChatBubble role="user" sender="admin" content="Hello" />
    );
    const timestamps = container.querySelectorAll(".opacity-50");
    expect(timestamps).toHaveLength(0);
  });

  it("applies primary styling for user messages", () => {
    const { container } = render(
      <ChatBubble role="user" sender="admin" content="User msg" />
    );
    const bubble = container.querySelector(".bg-primary");
    expect(bubble).toBeInTheDocument();
  });

  it("applies muted styling for agent messages", () => {
    const { container } = render(
      <ChatBubble role="agent" sender="Agent" content="Agent msg" />
    );
    const bubble = container.querySelector(".bg-muted");
    expect(bubble).toBeInTheDocument();
  });

  it("shows User icon for user role", () => {
    const { container } = render(
      <ChatBubble role="user" sender="admin" content="msg" />
    );
    const avatar = container.querySelector("[aria-hidden='true']");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("bg-primary");
  });

  it("shows Bot icon for agent role", () => {
    const { container } = render(
      <ChatBubble role="agent" sender="Agent" content="msg" />
    );
    const avatar = container.querySelector("[aria-hidden='true']");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("bg-muted");
  });

  it("preserves whitespace in content", () => {
    render(
      <ChatBubble
        role="agent"
        sender="Agent"
        content={"Line 1\nLine 2"}
      />
    );
    const paragraph = screen.getByText((_content, element) => {
      return element?.tagName === "P" && element.textContent === "Line 1\nLine 2";
    });
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass("whitespace-pre-wrap");
  });
});
