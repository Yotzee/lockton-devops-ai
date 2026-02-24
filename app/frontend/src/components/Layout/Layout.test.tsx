import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '@/resources/auth';
import { Layout } from './Layout';

function AuthenticatedApp() {
  return (
    <AuthProvider initialUser={{ username: 'admin', role: 'admin' }}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Home Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

function UnauthenticatedApp() {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<div>Home Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Layout', () => {
  it('renders layout with nav and content when authenticated', () => {
    render(<AuthenticatedApp />);
    expect(screen.getByText('Lockton App')).toBeInTheDocument();
    expect(screen.getByText('Home Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(<UnauthenticatedApp />);
    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Home Content')).not.toBeInTheDocument();
  });
});
