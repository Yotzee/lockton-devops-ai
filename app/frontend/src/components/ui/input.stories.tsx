import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './input';

const meta = {
  title: 'Components/UI/Input',
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Enter text...' },
};

export const WithValue: Story = {
  args: { value: 'Hello world', readOnly: true },
};

export const Password: Story = {
  args: { type: 'password', placeholder: 'Enter password...' },
};

export const Disabled: Story = {
  args: { placeholder: 'Disabled', disabled: true },
};
