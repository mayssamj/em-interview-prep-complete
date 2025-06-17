
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/auth/login-form';

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it('renders login form by default', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account? Sign up")).toBeInTheDocument();
  });

  it('switches to registration mode', () => {
    render(<LoginForm />);
    
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText('Already have an account? Sign in')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<LoginForm />);
    
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Username is required',
        variant: 'destructive',
      });
    });
  });

  it('validates password confirmation in registration mode', async () => {
    render(<LoginForm />);
    
    // Switch to registration
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    
    // Fill form with mismatched passwords
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'different' },
    });
    
    fireEvent.click(screen.getByText('Create Account'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
    });
  });

  it('validates email format in registration mode', async () => {
    render(<LoginForm />);
    
    // Switch to registration
    fireEvent.click(screen.getByText("Don't have an account? Sign up"));
    
    // Fill form with invalid email
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Email (optional)'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByText('Create Account'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
    });
  });

  it('handles successful login', async () => {
    const mockOnSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '1', username: 'testuser', isAdmin: false },
      }),
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'password123' }),
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles demo login', async () => {
    const mockOnSuccess = jest.fn();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '1', username: 'demo', isAdmin: false },
      }),
    });

    render(<LoginForm onSuccess={mockOnSuccess} />);
    
    fireEvent.click(screen.getByText('Demo User Login'));
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'demo', password: 'demodemo' }),
      });
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('handles authentication errors', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    });

    render(<LoginForm />);
    
    fireEvent.change(screen.getByPlaceholderText('Username'), {
      target: { value: 'testuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'wrongpassword' },
    });
    
    fireEvent.click(screen.getByText('Sign In'));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
    });
  });
});
