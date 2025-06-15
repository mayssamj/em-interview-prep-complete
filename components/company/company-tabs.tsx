
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CompanyOverview } from './company-overview';
import { QuestionBank } from './question-bank';
import { InterviewStrategy } from './interview-strategy';
import { CompanyStories } from './company-stories';
import { CompanyAnswers } from './company-answers';
import { 
  Building2, 
  HelpCircle, 
  Target, 
  BookOpen, 
  MessageSquare 
} from 'lucide-react';

interface CompanyTabsProps {
  company: {
    id: string;
    name: string;
    values: string[];
    evaluationCriteria: string[];
    interviewFormat: string;
    successTips: string[];
    redFlags: string[];
    questions: Array<{
      id: string;
      category: string;
      questionText: string;
      difficulty: string;
      tags: string[];
    }>;
  };
  userStories: Array<{
    id: string;
    title: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    reflection: string | null;
    tags: string[];
    categories: string[];
    createdAt: Date;
  }>;
  userAnswers: Array<{
    id: string;
    answerText: string;
    notes: string | null;
    createdAt: Date;
    question: {
      id: string;
      questionText: string;
      category: string;
      difficulty: string;
    };
  }>;
  userId: string;
}

export function CompanyTabs({ company, userStories, userAnswers, userId }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Company Values',
      icon: Building2,
      description: 'Values & evaluation criteria'
    },
    {
      id: 'questions',
      label: 'Question Bank',
      icon: HelpCircle,
      description: `${company.questions.length} questions`
    },
    {
      id: 'strategy',
      label: 'Interview Strategy',
      icon: Target,
      description: 'Tips & format'
    },
    {
      id: 'stories',
      label: 'My Stories',
      icon: BookOpen,
      description: `${userStories.length} stories`
    },
    {
      id: 'answers',
      label: 'My Answers',
      icon: MessageSquare,
      description: `${userAnswers.length} answered`
    }
  ];

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 h-auto p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex flex-col items-center gap-1 py-3 px-2 data-[state=active]:bg-background"
            >
              <Icon className="h-4 w-4" />
              <div className="text-center">
                <div className="text-xs font-medium">{tab.label}</div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {tab.description}
                </div>
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>

      <div className="mt-6">
        <TabsContent value="overview" className="space-y-6">
          <CompanyOverview company={company} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionBank 
            questions={company.questions} 
            companyName={company.name}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="strategy" className="space-y-6">
          <InterviewStrategy company={company} />
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <CompanyStories 
            stories={userStories} 
            companyName={company.name}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="answers" className="space-y-6">
          <CompanyAnswers 
            answers={userAnswers}
            companyName={company.name}
            userId={userId}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
}
