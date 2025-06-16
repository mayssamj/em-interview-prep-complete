
'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  Settings,
  Menu,
  X,
  Building2,
  HelpCircle,
  BookOpen,
  Target,
  TrendingUp,
  MessageCircle,
  Network,
  Layers,
  GitBranch
} from 'lucide-react';
import { useTheme } from 'next-themes';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface HeaderProps {
  user: User;
  selectedCompany?: string;
  onCompanyChange?: (company: string) => void;
  onSearch?: (query: string) => void;
}

export function Header({ user, selectedCompany, onCompanyChange, onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const companies = [
    { value: 'all', label: 'All Companies' },
    { value: 'meta', label: 'Meta' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'google', label: 'Google' },
  ];

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: TrendingUp
    },
    {
      label: 'Company Values',
      path: '/company-values',
      icon: Building2
    },
    {
      label: 'Behavioral Questions',
      path: '/question-bank',
      icon: HelpCircle
    },
    {
      label: 'System Design',
      path: '/system-design-questions',
      icon: Network
    },
    {
      label: 'SD Strategy',
      path: '/system-design-strategy',
      icon: Layers
    },
    {
      label: 'Story Templates',
      path: '/story-templates',
      icon: BookOpen
    },
    {
      label: 'Interview Strategy',
      path: '/interview-strategy',
      icon: Target
    },
    {
      label: 'Progress Tracker',
      path: '/progress-tracker',
      icon: TrendingUp
    },
    {
      label: 'FAQ',
      path: '/faq',
      icon: MessageCircle
    }
  ];

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    if (path === '/system-design-questions') {
      return pathname === '/system-design-questions' || pathname.startsWith('/system-design-questions');
    }
    if (path === '/system-design-strategy') {
      return pathname === '/system-design-strategy' || pathname.startsWith('/system-design-strategy');
    }
    return pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center space-x-2">
              <h1 
                className="text-lg lg:text-xl font-bold cursor-pointer hover:text-primary transition-colors whitespace-nowrap"
                onClick={() => router.push('/dashboard')}
              >
                EM Interview Prep
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center">
            <div className="flex flex-wrap items-center gap-1 max-w-2xl">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    onClick={() => router.push(item.path)}
                    className="flex items-center gap-1 whitespace-nowrap text-xs"
                  >
                    <Icon className="h-3 w-3" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                );
              })}
              
              {user.isAdmin && (
                <Button
                  variant={pathname === '/admin' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push('/admin')}
                  className="whitespace-nowrap text-xs"
                >
                  Admin
                </Button>
              )}
            </div>
          </nav>

          {/* Search and Company Selection */}
          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-xs">
            <form onSubmit={handleSearch} className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 w-full"
                />
              </div>
            </form>
            
            {onCompanyChange && (
              <Select value={selectedCompany || 'all'} onValueChange={onCompanyChange}>
                <SelectTrigger className="w-28 h-9 flex-shrink-0">
                  <SelectValue placeholder="Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.value} value={company.value}>
                      {company.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <div className="hidden sm:flex items-center space-x-1">
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {user.username}
                {user.isAdmin && <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">Admin</span>}
              </span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="sm:hidden"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t py-4">
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActivePath(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className="justify-start gap-2"
                    onClick={() => {
                      router.push(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
              
              {user.isAdmin && (
                <Button
                  variant={pathname === '/admin' ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => {
                    router.push('/admin');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Admin
                </Button>
              )}
            </nav>

            {/* Mobile Search */}
            <div className="mt-4 space-y-2">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </form>
              
              {onCompanyChange && (
                <Select value={selectedCompany || 'all'} onValueChange={onCompanyChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.value} value={company.value}>
                        {company.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
