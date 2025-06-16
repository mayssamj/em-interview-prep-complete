
/**
 * Comprehensive authentication flow integration tests
 */

describe('Authentication Flow Integration', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  describe('Login Flow', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'mayssam',
          password: 'password123'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message', 'Login successful')
      expect(data).toHaveProperty('user')
      expect(data.user).toHaveProperty('username', 'mayssam')
      expect(data.user).toHaveProperty('isAdmin', false)
      
      // Should set cookie
      const cookies = response.headers.get('set-cookie')
      expect(cookies).toContain('token=')
    })

    it('should successfully login admin user', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'adminadmin'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.user).toHaveProperty('username', 'admin')
      expect(data.user).toHaveProperty('isAdmin', true)
    })

    it('should reject invalid credentials', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'invalid',
          password: 'wrong'
        })
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Invalid credentials')
    })

    it('should reject missing credentials', async () => {
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data).toHaveProperty('error', 'Username and password are required')
    })
  })

  describe('Protected Routes', () => {
    it('should redirect unauthenticated users to login', async () => {
      const protectedRoutes = [
        '/dashboard',
        '/system-design-questions',
        '/system-design-strategy',
        '/question-bank',
        '/stories'
      ]

      for (const route of protectedRoutes) {
        const response = await fetch(`${baseUrl}${route}`, {
          redirect: 'manual'
        })
        
        // Should redirect to login
        expect([301, 302, 307, 308]).toContain(response.status)
        const location = response.headers.get('location')
        expect(location).toContain('/login')
      }
    })

    it('should allow access to authenticated users', async () => {
      // First login to get token
      const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'mayssam',
          password: 'password123'
        })
      })

      const cookies = loginResponse.headers.get('set-cookie')
      const tokenMatch = cookies?.match(/token=([^;]+)/)
      const token = tokenMatch ? tokenMatch[1] : ''

      // Try accessing protected route with token
      const response = await fetch(`${baseUrl}/dashboard`, {
        headers: {
          'Cookie': `token=${token}`
        },
        redirect: 'manual'
      })

      // Should not redirect (or redirect to dashboard itself)
      expect(response.status).toBe(200)
    })
  })

  describe('Logout Flow', () => {
    it('should successfully logout', async () => {
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST'
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty('message', 'Logout successful')
      
      // Should clear cookie
      const cookies = response.headers.get('set-cookie')
      expect(cookies).toContain('token=;')
    })
  })
})
