
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  BookOpen, 
  MessageSquare,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';

interface Story {
  id: string;
  title: string;
  categories: string[];
  tags: string[];
  createdAt: Date;
}

interface Answer {
  id: string;
  createdAt: Date;
  question: {
    id: string;
    questionText: string;
    category: string;
    difficulty: string;
    company: {
      id: string;
      name: string;
    };
  };
}

interface Company {
  id: string;
  name: string;
  questions: Array<{
    id: string;
    category: string;
    difficulty: string;
  }>;
}

interface Question {
  id: string;
  category: string;
  difficulty: string;
  company: {
    id: string;
    name: string;
  };
}

interface ProgressTrackerClientProps {
  userStories: Story[];
  userAnswers: Answer[];
  companies: Company[];
  questions: Question[];
  userId: string;
}

export function ProgressTrackerClient({ 
  userStories, 
  userAnswers, 
  companies, 
  questions 
}: ProgressTrackerClientProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');

  // Calculate progress metrics
  const progressMetrics = useMemo(() => {
    const totalQuestions = questions.length;
    const answeredQuestions = userAnswers.length;
    const totalStories = userStories.length;
    
    // Progress by company
    const companyProgress = companies.map(company => {
      const companyQuestions = company.questions.length;
      const companyAnswered = userAnswers.filter(
        answer => answer.question.company.id === company.id
      ).length;
      
      return {
        name: company.name,
        total: companyQuestions,
        answered: companyAnswered,
        percentage: companyQuestions > 0 ? Math.round((companyAnswered / companyQuestions) * 100) : 0
      };
    });

    // Progress by category
    const categories = [...new Set(questions.map(q => q.category))];
    const categoryProgress = categories.map(category => {
      const categoryQuestions = questions.filter(q => q.category === category).length;
      const categoryAnswered = userAnswers.filter(
        answer => answer.question.category === category
      ).length;
      
      return {
        name: category,
        total: categoryQuestions,
        answered: categoryAnswered,
        percentage: categoryQuestions > 0 ? Math.round((categoryAnswered / categoryQuestions) * 100) : 0
      };
    });

    // Progress by difficulty
    const difficulties = [...new Set(questions.map(q => q.difficulty))];
    const difficultyProgress = difficulties.map(difficulty => {
      const difficultyQuestions = questions.filter(q => q.difficulty === difficulty).length;
      const difficultyAnswered = userAnswers.filter(
        answer => answer.question.difficulty === difficulty
      ).length;
      
      return {
        name: difficulty,
        total: difficultyQuestions,
        answered: difficultyAnswered,
        percentage: difficultyQuestions > 0 ? Math.round((difficultyAnswered / difficultyQuestions) * 100) : 0
      };
    });

    // Story categories coverage
    const storyCategories = [...new Set(userStories.flatMap(story => story.categories))];
    const storyCoverage = storyCategories.length;

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentAnswers = userAnswers.filter(
      answer => new Date(answer.createdAt) >= thirtyDaysAgo
    ).length;
    
    const recentStories = userStories.filter(
      story => new Date(story.createdAt) >= thirtyDaysAgo
    ).length;

    return {
      overall: {
        questionsAnswered: answeredQuestions,
        totalQuestions,
        questionsPercentage: totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0,
        storiesCreated: totalStories,
        storyCategoriesCovered: storyCoverage
      },
      companies: companyProgress,
      categories: categoryProgress,
      difficulties: difficultyProgress,
      recent: {
        answers: recentAnswers,
        stories: recentStories
      }
    };
  }, [userStories, userAnswers, companies, questions]);

  const getCompanyColor = (companyName: string) => {
    switch (companyName.toLowerCase()) {
      case 'meta': return 'bg-blue-500';
      case 'amazon': return 'bg-orange-500';
      case 'google': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'hard': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  // Activity timeline (last 7 days)
  const activityTimeline = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayAnswers = userAnswers.filter(
        answer => answer.createdAt.toISOString().split('T')[0] === date
      ).length;
      
      const dayStories = userStories.filter(
        story => story.createdAt.toISOString().split('T')[0] === date
      ).length;

      return {
        date,
        answers: dayAnswers,
        stories: dayStories,
        total: dayAnswers + dayStories
      };
    });
  }, [userAnswers, userStories]);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Progress</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overall Progress Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Questions Answered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressMetrics.overall.questionsAnswered}</div>
                <p className="text-xs text-muted-foreground">
                  of {progressMetrics.overall.totalQuestions} total
                </p>
                <Progress 
                  value={progressMetrics.overall.questionsPercentage} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Stories Created
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressMetrics.overall.storiesCreated}</div>
                <p className="text-xs text-muted-foreground">
                  {progressMetrics.overall.storyCategoriesCovered} categories covered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressMetrics.recent.answers + progressMetrics.recent.stories}</div>
                <p className="text-xs text-muted-foreground">
                  Last 30 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Completion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressMetrics.overall.questionsPercentage}%</div>
                <p className="text-xs text-muted-foreground">
                  Overall progress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Company Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progress by Company
              </CardTitle>
              <CardDescription>
                Track your preparation progress for each company
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {progressMetrics.companies.map((company) => (
                <div key={company.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCompanyColor(company.name)}`} />
                      <span className="font-medium">{company.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {company.answered}/{company.total} questions ({company.percentage}%)
                    </div>
                  </div>
                  <Progress value={company.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          {/* Category Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Progress by Category
              </CardTitle>
              <CardDescription>
                See how you're progressing across different question categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {progressMetrics.categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{category.name}</span>
                        <Badge variant="outline">
                          {category.answered}/{category.total}
                        </Badge>
                      </div>
                      <Progress value={category.percentage} className="h-2" />
                    </div>
                    <div className="ml-4 text-2xl font-bold text-primary">
                      {category.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Difficulty Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progress by Difficulty
              </CardTitle>
              <CardDescription>
                Track your progress across different difficulty levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {progressMetrics.difficulties.map((difficulty) => (
                  <Card key={difficulty.name}>
                    <CardHeader className="pb-2">
                      <CardTitle className={`text-lg ${getDifficultyColor(difficulty.name)}`}>
                        {difficulty.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold mb-2">{difficulty.percentage}%</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {difficulty.answered} of {difficulty.total} questions
                      </p>
                      <Progress value={difficulty.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Story Categories Coverage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Story Categories Coverage
              </CardTitle>
              <CardDescription>
                Categories covered by your STAR stories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[...new Set(userStories.flatMap(story => story.categories))].map((category) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
              </div>
              {userStories.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No stories created yet. Start building your STAR story collection!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                7-Day Activity Timeline
              </CardTitle>
              <CardDescription>
                Your daily preparation activity over the last week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityTimeline.map((day) => (
                  <div key={day.date} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-20 text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{day.answers} answers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{day.stories} stories</span>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {day.total}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Recent Answers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userAnswers.slice(0, 5).map((answer) => (
                    <div key={answer.id} className="flex items-start gap-3 p-2 border rounded">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getCompanyColor(answer.question.company.name)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {answer.question.questionText}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {answer.question.company.name}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(answer.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {userAnswers.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No answers yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Stories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userStories.slice(0, 5).map((story) => (
                    <div key={story.id} className="p-2 border rounded">
                      <p className="text-sm font-medium">{story.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {story.categories.slice(0, 2).map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                        <span className="text-xs text-muted-foreground">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  {userStories.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">
                      No stories yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
