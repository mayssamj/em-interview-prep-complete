
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Target,
  TrendingUp,
  Users
} from 'lucide-react';

interface ProgressStats {
  totalQuestions: number;
  answeredQuestions: number;
  totalStories: number;
  interviewNotes: number;
  completionRate: number;
  recentActivity: number;
}

interface ProgressOverviewProps {
  userId: string;
}

export function ProgressOverview({ userId }: ProgressOverviewProps) {
  const [stats, setStats] = useState<ProgressStats>({
    totalQuestions: 0,
    answeredQuestions: 0,
    totalStories: 0,
    interviewNotes: 0,
    completionRate: 0,
    recentActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  const statCards = [
    {
      title: 'Questions Answered',
      value: `${stats.answeredQuestions}/${stats.totalQuestions}`,
      description: 'Interview questions completed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
    },
    {
      title: 'My Stories',
      value: stats.totalStories.toString(),
      description: 'STAR format stories created',
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Interview Notes',
      value: stats.interviewNotes.toString(),
      description: 'Interview experiences recorded',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
    {
      title: 'Completion Rate',
      value: `${Math.round(stats.completionRate)}%`,
      description: 'Overall progress',
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-24"></div>
              <div className="h-4 w-4 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 mb-2"></div>
              <div className="h-3 bg-muted rounded w-32"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-md ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold count-up">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
          <CardDescription>
            Your interview preparation journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Questions Answered</span>
              <span>{stats.answeredQuestions}/{stats.totalQuestions}</span>
            </div>
            <Progress 
              value={(stats.answeredQuestions / Math.max(stats.totalQuestions, 1)) * 100} 
              className="h-2"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalStories}</div>
              <div className="text-sm text-muted-foreground">Stories Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.interviewNotes}</div>
              <div className="text-sm text-muted-foreground">Interviews Logged</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
