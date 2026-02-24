import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/helpers';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders the sign in form', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getAllByText('Sign in')).toHaveLength(2); // title + button
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows error on invalid credentials', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Username'), 'wrong');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid username or password');
  });

  it('does not show error initially', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('accepts input in username and password fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(usernameInput, 'admin');
    await user.type(passwordInput, 'admin');

    expect(usernameInput).toHaveValue('admin');
    expect(passwordInput).toHaveValue('admin');
  });
});
