import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { LeftNav } from './LeftNav';
import { useEffect, type ReactNode } from 'react';

function LoginHelper({ children, username = 'admin', password = 'admin' }: { children: ReactNode; username?: string; password?: string }) {
  const { login } = useAuth();
  useEffect(() => {
    login(username, password);
  }, [login, username, password]);
  return <>{children}</>;
}

const meta = {
  title: 'Components/LeftNav',
  component: LeftNav,
  decorators: [
    (Story) => (
      <AuthProvider>
        <MemoryRouter>
          <LoginHelper>
            <div className="h-screen">
              <Story />
            </div>
          </LoginHelper>
        </MemoryRouter>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof LeftNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminUser: Story = {};

export const RegularUser: Story = {
  decorators: [
    (Story) => (
      <AuthProvider>
        <MemoryRouter>
          <LoginHelper username="user" password="user">
            <div className="h-screen">
              <Story />
            </div>
          </LoginHelper>
        </MemoryRouter>
      </AuthProvider>
    ),
  ],
};
