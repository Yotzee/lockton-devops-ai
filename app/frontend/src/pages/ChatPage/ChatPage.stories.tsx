import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { ChatPage } from './ChatPage';
import { useEffect, type ReactNode } from 'react';

function LoginHelper({ children }: { children: ReactNode }) {
  const { login } = useAuth();
  useEffect(() => {
    login('admin', 'admin');
  }, [login]);
  return <>{children}</>;
}

const meta = {
  title: 'Pages/ChatPage',
  component: ChatPage,
  decorators: [
    (Story) => (
      <AuthProvider>
        <MemoryRouter>
          <LoginHelper>
            <div className="h-[600px]">
              <Story />
            </div>
          </LoginHelper>
        </MemoryRouter>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof ChatPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
