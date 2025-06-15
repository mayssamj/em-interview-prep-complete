
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Users, 
  Brain, 
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Shield
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  values: string[];
  evaluationCriteria: string[];
  interviewFormat: string;
  successTips: string[];
  redFlags: string[];
}

interface InterviewStrategyClientProps {
  companies: Company[];
}

export function InterviewStrategyClient({ companies }: InterviewStrategyClientProps) {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');

  const filteredCompanies = selectedCompany === 'all' 
    ? companies 
    : companies.filter(company => company.name.toLowerCase() === selectedCompany);

  const getCompanyColor = (companyName: string) => {
    switch (companyName.toLowerCase()) {
      case 'meta': return 'bg-blue-500';
      case 'amazon': return 'bg-orange-500';
      case 'google': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const generalStrategies = {
    preparation: [
      {
        title: "Research the Company",
        description: "Understand the company's mission, values, recent news, and engineering culture",
        tips: [
          "Read the company's engineering blog and recent tech talks",
          "Understand their product portfolio and technical challenges",
          "Research the team you'd be joining and their recent projects",
          "Know their engineering principles and development practices"
        ]
      },
      {
        title: "Prepare Your Stories",
        description: "Have 8-10 STAR stories covering different scenarios and competencies",
        tips: [
          "Leadership and team management examples",
          "Technical decision-making and architecture choices",
          "Cross-functional collaboration and stakeholder management",
          "Conflict resolution and difficult conversations",
          "Innovation and process improvement initiatives"
        ]
      },
      {
        title: "Technical Preparation",
        description: "Be ready to discuss system design and technical leadership",
        tips: [
          "Review system design fundamentals and scalability patterns",
          "Prepare to discuss technical decisions you've made",
          "Be ready to whiteboard architecture diagrams",
          "Know how to explain complex technical concepts simply"
        ]
      }
    ],
    frameworks: [
      {
        title: "STAR Method",
        description: "Structure behavioral responses with Situation, Task, Action, Result",
        icon: Target,
        details: [
          "Situation: Set the context (20% of time)",
          "Task: Define your responsibility (20% of time)",
          "Action: Describe what you did (50% of time)",
          "Result: Share the outcome with metrics (10% of time)"
        ]
      },
      {
        title: "Leadership Philosophy",
        description: "Articulate your management and leadership approach",
        icon: Users,
        details: [
          "How you build and motivate teams",
          "Your approach to 1:1s and performance management",
          "How you handle underperformance and difficult conversations",
          "Your strategy for technical mentoring and career development"
        ]
      },
      {
        title: "Technical Decision Framework",
        description: "Show how you make and communicate technical decisions",
        icon: Brain,
        details: [
          "How you evaluate trade-offs and technical debt",
          "Your approach to architecture reviews and RFC processes",
          "How you balance innovation with stability",
          "Your method for building technical consensus"
        ]
      }
    ],
    commonQuestions: [
      {
        category: "Leadership",
        questions: [
          "Tell me about a time you had to make a difficult decision as a leader",
          "How do you handle underperforming team members?",
          "Describe a time when you had to influence without authority",
          "How do you build trust with a new team?"
        ]
      },
      {
        category: "Technical",
        questions: [
          "How do you make technical decisions and trade-offs?",
          "Describe a time you had to choose between technical debt and feature delivery",
          "How do you ensure code quality across your team?",
          "Tell me about a technical architecture decision you made"
        ]
      },
      {
        category: "Collaboration",
        questions: [
          "How do you work with product managers and designers?",
          "Describe a time you had to resolve conflict between teams",
          "How do you communicate technical concepts to non-technical stakeholders?",
          "Tell me about a time you had to push back on unrealistic deadlines"
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General Strategy</TabsTrigger>
          <TabsTrigger value="company-specific">Company-Specific</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Preparation Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Interview Preparation Framework
              </CardTitle>
              <CardDescription>
                Essential preparation areas for Engineering Manager interviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {generalStrategies.preparation.map((area, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-2">{area.title}</h3>
                    <p className="text-muted-foreground mb-3">{area.description}</p>
                    <div className="space-y-2">
                      {area.tips.map((tip, tipIndex) => (
                        <div key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Frameworks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Response Frameworks
              </CardTitle>
              <CardDescription>
                Proven frameworks for structuring your interview responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {generalStrategies.frameworks.map((framework, index) => {
                  const Icon = framework.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{framework.title}</CardTitle>
                        </div>
                        <CardDescription>{framework.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {framework.details.map((detail, detailIndex) => (
                            <div key={detailIndex} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Common Question Categories
              </CardTitle>
              <CardDescription>
                Practice these common Engineering Manager interview questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {generalStrategies.commonQuestions.map((category, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <Badge variant="secondary">{category.category}</Badge>
                    </h3>
                    <div className="grid gap-2">
                      {category.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-start gap-2 p-2 bg-muted rounded">
                          <MessageSquare className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{question}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company-specific" className="space-y-6">
          {/* Company Filter */}
          <div className="flex justify-center">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.name.toLowerCase()}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Company-Specific Strategies */}
          <div className="grid gap-8">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getCompanyColor(company.name)}`} />
                    <CardTitle className="text-2xl">{company.name} Interview Strategy</CardTitle>
                  </div>
                  <CardDescription>
                    Specific strategies and tips for {company.name} Engineering Manager interviews
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Interview Format */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Interview Format</h3>
                    </div>
                    <p className="text-sm bg-muted p-3 rounded-lg">
                      {company.interviewFormat}
                    </p>
                  </div>

                  {/* Key Focus Areas */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Key Focus Areas</h3>
                    </div>
                    <div className="grid gap-2">
                      {company.evaluationCriteria.map((criteria, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{criteria}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Success Tips */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <h3 className="text-lg font-semibold">Success Strategies</h3>
                      </div>
                      <div className="space-y-2">
                        {company.successTips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-950 rounded">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Red Flags */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold">Avoid These Mistakes</h3>
                      </div>
                      <div className="space-y-2">
                        {company.redFlags.map((flag, index) => (
                          <div key={index} className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950 rounded">
                            <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{flag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Company Values Alignment */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">Align with Company Values</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {company.values.map((value, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {value}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Ensure your stories and responses demonstrate alignment with these core values.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
