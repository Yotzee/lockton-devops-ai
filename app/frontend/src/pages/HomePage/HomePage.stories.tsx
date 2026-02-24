import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { HomePage } from './HomePage';
import { useEffect, type ReactNode } from 'react';

function LoginHelper({ children }: { children: ReactNode }) {
  const { login } = useAuth();
  useEffect(() => {
    login('admin', 'admin');
  }, [login]);
  return <>{children}</>;
}

const meta = {
  title: 'Pages/HomePage',
  component: HomePage,
  decorators: [
    (Story) => (
      <AuthProvider>
        <MemoryRouter>
          <LoginHelper>
            <Story />
          </LoginHelper>
        </MemoryRouter>
      </AuthProvider>
    ),
  ],
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
