import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';
import type { ReactNode } from 'react';

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

describe('useAuth', () => {
  it('starts unauthenticated', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('logs in with valid admin credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      const success = result.current.login('admin', 'admin');
      expect(success).toBe(true);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ username: 'admin', role: 'admin' });
  });

  it('logs in with valid user credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      const success = result.current.login('user', 'user');
      expect(success).toBe(true);
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({ username: 'user', role: 'user' });
  });

  it('rejects invalid credentials', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      const success = result.current.login('admin', 'wrong');
      expect(success).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('rejects unknown username', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      const success = result.current.login('unknown', 'pass');
      expect(success).toBe(false);
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logs out successfully', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    act(() => {
      result.current.login('admin', 'admin');
    });
    expect(result.current.isAuthenticated).toBe(true);
    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
