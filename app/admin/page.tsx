
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, Building, MessageSquare, Shield, Search, UserCheck, UserX, Activity, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  email?: string;
  preferences?: any;
}

interface AdminUser {
  id: string;
  username: string;
  isAdmin: boolean;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

interface AdminStats {
  userCount: number;
  storyCount: number;
  questionCount: number;
  companyCount: number;
  recentUsers: Array<{
    id: string;
    username: string;
    isAdmin: boolean;
    createdAt: string;
  }>;
}

interface ActivityData {
  recentUsers: Array<{
    id: string;
    username: string;
    createdAt: string;
    isAdmin: boolean;
  }>;
  recentStories: Array<{
    id: string;
    title: string;
    createdAt: string;
    userId: string;
  }>;
  recentQuestions: number;
  dailyRegistrations: Array<{
    date: string;
    count: number;
  }>;
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        
        const userData = await response.json();
        if (!userData.user.isAdmin) {
          router.push('/dashboard');
          return;
        }
        
        setUser(userData.user);
        
        // Fetch admin stats
        const statsResponse = await fetch('/api/admin/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }

        // Fetch activity data
        const activityResponse = await fetch('/api/admin/activity');
        if (activityResponse.ok) {
          const activityData = await activityResponse.json();
          setActivity(activityData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  const fetchUsers = async (page = 1, search = '') => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) {
      fetchUsers(currentPage, searchTerm);
    }
  }, [user, currentPage, searchTerm]);

  const handleToggleAdmin = async (userId: string, currentIsAdmin: boolean) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          isAdmin: !currentIsAdmin,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `User ${currentIsAdmin ? 'removed from' : 'promoted to'} admin`,
        });
        fetchUsers(currentPage, searchTerm);
      } else {
        throw new Error('Failed to update user');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update user permissions',
        variant: 'destructive',
      });
    }
  };

  const handleReseed = async () => {
    try {
      const response = await fetch('/api/seed', { method: 'POST' });
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Database reseeded successfully',
        });
        // Refresh stats
        const statsResponse = await fetch('/api/admin/stats');
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData);
        }
      } else {
        throw new Error('Failed to reseed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reseed database',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !stats) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              System overview and management tools
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.userCount}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stories</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.storyCount}</div>
                <p className="text-xs text-muted-foreground">
                  STAR stories created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.questionCount}</div>
                <p className="text-xs text-muted-foreground">
                  Interview questions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Companies</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.companyCount}</div>
                <p className="text-xs text-muted-foreground">
                  Company profiles
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for different admin sections */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>
                    Latest user registrations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentUsers.map((recentUser) => (
                      <div key={recentUser.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{recentUser.username}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(recentUser.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {recentUser.isAdmin && (
                          <Badge variant="secondary">Admin</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>

                    {usersLoading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((adminUser) => (
                            <TableRow key={adminUser.id}>
                              <TableCell className="font-medium">
                                {adminUser.username}
                              </TableCell>
                              <TableCell>
                                {adminUser.email || 'Not provided'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={adminUser.isAdmin ? 'default' : 'secondary'}>
                                  {adminUser.isAdmin ? 'Admin' : 'User'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(adminUser.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleAdmin(adminUser.id, adminUser.isAdmin)}
                                  disabled={adminUser.id === user.id}
                                >
                                  {adminUser.isAdmin ? (
                                    <>
                                      <UserX className="h-4 w-4 mr-1" />
                                      Remove Admin
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4 mr-1" />
                                      Make Admin
                                    </>
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              {activity && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                      <CardDescription>
                        System activity over the last 7 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">New Users</h4>
                          <div className="space-y-2">
                            {activity.recentUsers.slice(0, 5).map((activityUser) => (
                              <div key={activityUser.id} className="flex items-center justify-between text-sm">
                                <span>{activityUser.username}</span>
                                <span className="text-muted-foreground">
                                  {new Date(activityUser.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">New Stories</h4>
                          <div className="space-y-2">
                            {activity.recentStories.slice(0, 5).map((story) => (
                              <div key={story.id} className="flex items-center justify-between text-sm">
                                <span className="truncate">{story.title}</span>
                                <span className="text-muted-foreground">
                                  {new Date(story.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Management</CardTitle>
                  <CardDescription>
                    System administration tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={handleReseed}
                    >
                      Reseed Database
                    </Button>
                    <Button variant="outline" disabled>
                      Export Data (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      System Logs (Coming Soon)
                    </Button>
                    <Button variant="outline" disabled>
                      Backup Database (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
