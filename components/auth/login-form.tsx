
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus, Mail, User, Lock } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const validateForm = () => {
    if (!username.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Username is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!password) {
      toast({
        title: 'Validation Error',
        description: 'Password is required',
        variant: 'destructive',
      });
      return false;
    }

    if (!isLogin) {
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid email address',
          variant: 'destructive',
        });
        return false;
      }

      if (password.length < 6) {
        toast({
          title: 'Validation Error',
          description: 'Password must be at least 6 characters long',
          variant: 'destructive',
        });
        return false;
      }

      if (password !== confirmPassword) {
        toast({
          title: 'Validation Error',
          description: 'Passwords do not match',
          variant: 'destructive',
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { username, password }
        : { username, email: email || undefined, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast({
        title: isLogin ? 'Welcome back!' : 'Account created!',
        description: `Successfully ${isLogin ? 'logged in' : 'registered'} as ${data.user.username}`,
      });

      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        // Use router.replace for better test compatibility
        router.replace(redirectUrl);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: demoUsername, password: demoPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast({
        title: 'Welcome back!',
        description: `Successfully logged in as ${data.user.username}`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        // Use router.replace for better test compatibility
        router.replace(redirectUrl);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    // Clear form when switching modes
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {isLogin ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          {isLogin ? 'Sign In' : 'Create Account'}
        </CardTitle>
        <CardDescription>
          {isLogin 
            ? 'Enter your credentials to access your interview prep'
            : 'Create an account to start preparing for your interviews'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
              className="pl-10"
            />
          </div>
          
          {!isLogin && (
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="pl-10"
              />
            </div>
          )}
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
              className="pl-10"
            />
          </div>
          
          {!isLogin && (
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                className="pl-10"
              />
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={toggleMode}
            disabled={isLoading}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </Button>
        </div>

        {isLogin && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-center">Try Demo Accounts:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDemoLogin('demo', 'demo123')}
                disabled={isLoading}
              >
                Demo User Login
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                disabled={isLoading}
              >
                Admin Demo Login
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
