
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      toast({
        title: isLogin ? 'Welcome back!' : 'Account created!',
        description: `Successfully ${isLogin ? 'logged in' : 'registered'} as ${data.user.username}`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        const redirectUrl = searchParams.get('redirect') || '/dashboard';
        router.push(redirectUrl);
        router.refresh();
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
    setUsername(demoUsername);
    setPassword(demoPassword);
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
        router.push(redirectUrl);
        router.refresh();
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
          <div>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              minLength={6}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
        
        <div className="mt-4 text-center">
          <Button
            variant="link"
            onClick={() => setIsLogin(!isLogin)}
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
            <p className="text-sm font-medium text-center">Try Demo Account:</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleDemoLogin('demo', 'demodemo')}
              disabled={isLoading}
            >
              Demo User Login
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
