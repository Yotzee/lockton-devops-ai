import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { LeftNav } from './LeftNav';
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

describe('LeftNav', () => {
  it('renders the app name', () => {
    render(<LeftNav />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('Lockton App')).toBeInTheDocument();
  });

  it('renders Home navigation link', () => {
    render(<LeftNav />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('renders the signed-in username', () => {
    render(<LeftNav />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('admin')).toBeInTheDocument();
  });

  it('renders sign out button', () => {
    render(<LeftNav />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('Sign out')).toBeInTheDocument();
  });
});
