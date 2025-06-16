
import { render, screen, fireEvent } from '@testing-library/react'
import { Header } from '@/components/layout/header'
import { useRouter } from 'next/navigation'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}))

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

const mockUser = {
  id: 'user-123',
  username: 'testuser',
  isAdmin: false,
}

describe('Header Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  it('renders user information correctly', () => {
    render(<Header user={mockUser} />)
    
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('EM Interview Prep')).toBeInTheDocument()
  })

  it('shows admin badge for admin users', () => {
    const adminUser = { ...mockUser, isAdmin: true }
    render(<Header user={adminUser} />)
    
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders navigation items', () => {
    render(<Header user={mockUser} />)
    
    // Check for some navigation items (these might be hidden on mobile)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Company Values')).toBeInTheDocument()
  })

  it('handles logout correctly', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
    })

    render(<Header user={mockUser} />)
    
    const logoutButton = screen.getAllByRole('button').find(
      button => button.querySelector('svg') // Logout icon
    )
    
    if (logoutButton) {
      fireEvent.click(logoutButton)
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'POST' })
    }
  })
})
