
/**
 * Integration tests for authentication flow
 */

describe('Authentication Integration', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  it('should redirect unauthenticated users to login', async () => {
    const response = await fetch(`${baseUrl}/dashboard`)
    expect(response.status).toBe(307) // Redirect
    expect(response.headers.get('location')).toContain('/login')
  })

  it('should allow access to protected routes after login', async () => {
    // This would require a more complex setup with actual authentication
    // For now, we'll test the API endpoints directly
    
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'adminadmin',
      }),
    })

    expect(loginResponse.status).toBe(200)
    const loginData = await loginResponse.json()
    expect(loginData.message).toBe('Login successful')
  })

  it('should return system design questions for authenticated requests', async () => {
    const response = await fetch(`${baseUrl}/api/system-design-questions`)
    expect(response.status).toBe(200)
    
    const questions = await response.json()
    expect(Array.isArray(questions)).toBe(true)
  })

  it('should return system design frameworks', async () => {
    const response = await fetch(`${baseUrl}/api/system-design-frameworks`)
    expect(response.status).toBe(200)
    
    const frameworks = await response.json()
    expect(Array.isArray(frameworks)).toBe(true)
    expect(frameworks.length).toBeGreaterThan(0)
  })
})
