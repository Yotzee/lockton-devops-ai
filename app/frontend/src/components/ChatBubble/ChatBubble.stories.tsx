import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatBubble } from "./ChatBubble";

const meta = {
  title: "Components/ChatBubble",
  component: ChatBubble,
  decorators: [
    (Story) => (
      <div className="max-w-2xl space-y-4 p-4">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    role: {
      control: "radio",
      options: ["user", "agent"],
    },
  },
} satisfies Meta<typeof ChatBubble>;

export default meta;
type Story = StoryObj<typeof meta>;

export const UserMessage: Story = {
  args: {
    role: "user",
    sender: "admin",
    content: "Can you help me deploy the latest build to staging?",
  },
};

export const AgentMessage: Story = {
  args: {
    role: "agent",
    sender: "Agent",
    content:
      "Sure! I'll start the deployment pipeline for the staging environment. This should take about 3-5 minutes.",
  },
};

export const WithTimestamp: Story = {
  args: {
    role: "user",
    sender: "admin",
    content: "What's the status of the last deployment?",
    timestamp: "2:30 PM",
  },
};

export const LongMessage: Story = {
  args: {
    role: "agent",
    sender: "Agent",
    content:
      "Here's a summary of the deployment status:\n\n1. Build: Completed successfully\n2. Tests: All 142 tests passing\n3. Staging: Deployed and healthy\n4. Production: Pending approval\n\nThe staging environment is running the latest version. Would you like me to proceed with the production deployment?",
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="space-y-4">
      <ChatBubble
        role="user"
        sender="admin"
        content="Hey, can you check the server health?"
        timestamp="2:28 PM"
      />
      <ChatBubble
        role="agent"
        sender="Agent"
        content="All systems are operational. CPU usage is at 42%, memory at 68%. No alerts in the last 24 hours."
        timestamp="2:28 PM"
      />
      <ChatBubble
        role="user"
        sender="admin"
        content="Great, how about the database connections?"
        timestamp="2:29 PM"
      />
      <ChatBubble
        role="agent"
        sender="Agent"
        content="Database connection pool is healthy. Currently 12 active connections out of 100 max. Average query time is 23ms."
        timestamp="2:29 PM"
      />
    </div>
  ),
};
