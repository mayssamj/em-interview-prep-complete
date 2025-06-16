
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => null)
  }))
}))

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

describe('LoginForm', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render login form with demo buttons', () => {
    render(<LoginForm />)
    
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /demo user login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /admin demo login/i })).toBeInTheDocument()
  })

  it('should handle successful demo user login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Login successful',
        user: { username: 'mayssam', isAdmin: false }
      })
    })

    render(<LoginForm />)
    
    const demoButton = screen.getByRole('button', { name: /demo user login/i })
    fireEvent.click(demoButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'mayssam', password: 'password123' })
      })
    })
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('should handle successful admin demo login', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Login successful',
        user: { username: 'admin', isAdmin: true }
      })
    })

    render(<LoginForm />)
    
    const adminButton = screen.getByRole('button', { name: /admin demo login/i })
    fireEvent.click(adminButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: 'adminadmin' })
      })
    })
  })

  it('should handle manual login form submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        message: 'Login successful',
        user: { username: 'testuser', isAdmin: false }
      })
    })

    render(<LoginForm />)
    
    const usernameInput = screen.getByPlaceholderText('Username')
    const passwordInput = screen.getByPlaceholderText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'testpass' } })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'testpass' })
      })
    })
  })

  it('should handle login errors', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid credentials' })
    })

    const mockToast = jest.fn()
    require('@/hooks/use-toast').useToast.mockReturnValue({ toast: mockToast })

    render(<LoginForm />)
    
    const demoButton = screen.getByRole('button', { name: /demo user login/i })
    fireEvent.click(demoButton)
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive'
      })
    })
  })

  it('should toggle between login and register modes', () => {
    render(<LoginForm />)
    
    expect(screen.getByText('Sign In')).toBeInTheDocument()
    
    const toggleButton = screen.getByRole('button', { name: /don't have an account/i })
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('Create Account')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })
})
