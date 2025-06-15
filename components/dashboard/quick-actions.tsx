
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  BookOpen, 
  MessageSquare, 
  Search,
  Zap,
  Clock,
  ArrowRight,
  Network,
  Layers
} from 'lucide-react';

export function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: 'Create New Story',
      description: 'Add a new STAR format story to your collection',
      icon: Plus,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      action: () => router.push('/stories/new'),
    },
    {
      title: 'Behavioral Questions',
      description: 'Practice leadership and behavioral questions',
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      action: () => router.push('/question-bank'),
    },
    {
      title: 'System Design',
      description: 'Practice system design questions',
      icon: Network,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950',
      action: () => router.push('/system-design-questions'),
    },
    {
      title: 'My Stories',
      description: 'Review and edit your existing stories',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      action: () => router.push('/stories'),
    },
    {
      title: 'Interview Notes',
      description: 'Log your interview experiences',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      action: () => router.push('/interview-notes'),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          Quick Actions
        </h2>
        <p className="text-muted-foreground">
          Jump into your interview preparation
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index} 
              className="card-hover cursor-pointer group"
              onClick={action.action}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-md ${action.bgColor}`}>
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {action.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Preparation Links Section */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Zap className="h-5 w-5" />
            Preparation Paths
          </CardTitle>
          <CardDescription>
            Choose your preparation approach based on available time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors cursor-pointer group"
                  onClick={() => router.push('/question-bank')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-950">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold group-hover:text-blue-600 transition-colors">Behavioral Prep</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Leadership and behavioral questions with STAR framework
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">50+ questions</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-indigo-200 hover:border-indigo-300 transition-colors cursor-pointer group"
                  onClick={() => router.push('/system-design-questions')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-indigo-50 dark:bg-indigo-950">
                    <Network className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold group-hover:text-indigo-600 transition-colors">System Design</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Architecture and scalability questions for EM roles
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">40+ questions</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-200 hover:border-red-300 transition-colors cursor-pointer group"
                  onClick={() => router.push('/question-bank?filter=critical')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-red-50 dark:bg-red-950">
                    <Clock className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="font-semibold group-hover:text-red-600 transition-colors">Critical Only</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  High-impact behavioral questions for quick prep
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">15+ critical</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors cursor-pointer group"
                  onClick={() => router.push('/system-design-strategy')}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-md bg-purple-50 dark:bg-purple-950">
                    <Layers className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold group-hover:text-purple-600 transition-colors">SD Strategy</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Frameworks and strategies for system design
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Frameworks</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-purple-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Sample Questions */}
          <div className="mt-6 space-y-3">
            <h4 className="font-medium text-sm">Sample Questions by Type:</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-blue-600">Behavioral Questions</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div>
                      <p className="font-medium text-sm">Tell me about a time you led a team through a challenging project</p>
                      <p className="text-xs text-muted-foreground">Leadership • High Frequency</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/question-bank')}>
                      Practice
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div>
                      <p className="font-medium text-sm">Describe resolving a significant disagreement within your team</p>
                      <p className="text-xs text-muted-foreground">Conflict Resolution • High Impact</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/question-bank')}>
                      Practice
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-indigo-600">System Design Questions</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div>
                      <p className="font-medium text-sm">Design a scalable chat system like Meta Messenger</p>
                      <p className="text-xs text-muted-foreground">Distributed Systems • Meta</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/system-design-questions')}>
                      Practice
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                    <div>
                      <p className="font-medium text-sm">Design a recommendation system for e-commerce</p>
                      <p className="text-xs text-muted-foreground">ML Systems • Amazon</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push('/system-design-questions')}>
                      Practice
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
