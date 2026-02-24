import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/resources/auth';
import { ChatPage } from './ChatPage';
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

describe('ChatPage', () => {
  it('renders the page heading', () => {
    render(<ChatPage />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('AI Chat')).toBeInTheDocument();
  });

  it('renders the message input and send button', () => {
    render(<ChatPage />, { wrapper: LoggedInWrapper });
    expect(screen.getByLabelText('Message input')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('shows empty state message when no messages', () => {
    render(<ChatPage />, { wrapper: LoggedInWrapper });
    expect(screen.getByText('Send a message to start the conversation')).toBeInTheDocument();
  });

  it('sends a message and receives a mock agent response', async () => {
    const user = userEvent.setup();
    render(<ChatPage />, { wrapper: LoggedInWrapper });

    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Hello AI');
    await user.click(screen.getByLabelText('Send message'));

    expect(screen.getByText('Hello AI')).toBeInTheDocument();
    expect(screen.getByText('admin')).toBeInTheDocument();
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('does not send empty messages', async () => {
    const user = userEvent.setup();
    render(<ChatPage />, { wrapper: LoggedInWrapper });

    await user.click(screen.getByLabelText('Send message'));

    expect(screen.getByText('Send a message to start the conversation')).toBeInTheDocument();
  });

  it('sends a message on Enter key', async () => {
    const user = userEvent.setup();
    render(<ChatPage />, { wrapper: LoggedInWrapper });

    const input = screen.getByLabelText('Message input');
    await user.type(input, 'Test message{Enter}');

    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('sends multiple messages and displays them all', async () => {
    const user = userEvent.setup();
    render(<ChatPage />, { wrapper: LoggedInWrapper });

    const input = screen.getByLabelText('Message input');

    await user.type(input, 'First message{Enter}');
    await user.type(input, 'Second message{Enter}');

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    // 2 user messages + 2 agent responses = 4 total
    expect(screen.getAllByText('admin')).toHaveLength(2);
    expect(screen.getAllByText('Agent')).toHaveLength(2);
  });
});
