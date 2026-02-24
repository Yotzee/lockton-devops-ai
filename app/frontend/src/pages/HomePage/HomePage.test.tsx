import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { HomePage } from './HomePage';
import { useEffect, type ReactNode } from 'react';

function LoggedInWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <MemoryRouter>
        <LoginHelper>{children}</LoginHelper>
      </MemoryRouter>
    </AuthProvider>
  );
}

function LoginHelper({ children }: { children: ReactNode }) {
  const { login } = useAuth();
  useEffect(() => {
    login('admin', 'admin');
  }, [login]);
  return <>{children}</>;
}

describe('HomePage', () => {
  it('renders welcome message with username', () => {
    render(<HomePage />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('Welcome, admin')).toBeInTheDocument();
  });

  it('renders landing page description', () => {
    render(<HomePage />, { wrapper: LoggedInWrapper });
    expect(
      screen.getByText(/Select an item from the navigation to get started/)
    ).toBeInTheDocument();
  });
});
