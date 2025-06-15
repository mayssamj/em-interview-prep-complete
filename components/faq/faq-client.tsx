
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Search, HelpCircle, Users, Brain, Target, Clock, BookOpen } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export function FAQClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqData: FAQItem[] = [
    // General Preparation
    {
      id: '1',
      question: 'How long should I prepare for an Engineering Manager interview?',
      answer: 'Typically, 4-8 weeks of dedicated preparation is recommended. This includes: 2-3 weeks for story development and STAR method practice, 2-3 weeks for technical review and system design, 1-2 weeks for company-specific research and mock interviews. The timeline may vary based on your current experience and the specific role.',
      category: 'General Preparation',
      tags: ['timeline', 'preparation', 'planning']
    },
    {
      id: '2',
      question: 'What are the most important skills to demonstrate in an EM interview?',
      answer: 'Key skills include: Leadership and people management, Technical depth and system design thinking, Cross-functional collaboration and communication, Strategic thinking and prioritization, Problem-solving and decision-making under uncertainty, Ability to scale teams and processes, Cultural fit and alignment with company values.',
      category: 'General Preparation',
      tags: ['skills', 'leadership', 'technical']
    },
    {
      id: '3',
      question: 'How many STAR stories should I prepare?',
      answer: 'Prepare 8-12 well-crafted STAR stories covering different scenarios: 2-3 leadership/team management stories, 2-3 technical decision-making stories, 2-3 cross-functional collaboration stories, 1-2 conflict resolution stories, 1-2 innovation/process improvement stories. Ensure each story can be adapted to answer multiple types of questions.',
      category: 'STAR Stories',
      tags: ['STAR', 'stories', 'behavioral']
    },
    {
      id: '4',
      question: 'What if I don\'t have direct management experience?',
      answer: 'Focus on leadership experiences without formal authority: Leading cross-functional projects, Mentoring junior developers, Technical leadership in architecture decisions, Leading incident response or critical initiatives, Influencing stakeholders and driving alignment, Contributing to hiring and onboarding processes. Emphasize your potential and learning mindset.',
      category: 'STAR Stories',
      tags: ['experience', 'leadership', 'career transition']
    },
    {
      id: '5',
      question: 'How technical should I be in an EM interview?',
      answer: 'Strike a balance between technical depth and leadership focus: Be able to discuss system architecture at a high level, Understand technical trade-offs and their business impact, Demonstrate how you\'ve made technical decisions as a leader, Show you can communicate technical concepts to non-technical stakeholders, Avoid getting too deep into implementation details unless specifically asked.',
      category: 'Technical Leadership',
      tags: ['technical', 'leadership', 'communication']
    },
    {
      id: '6',
      question: 'What system design topics should I review?',
      answer: 'Focus on these key areas: Scalability patterns (load balancing, caching, sharding), Microservices architecture and trade-offs, Database design and consistency models, Monitoring, logging, and observability, Security and compliance considerations, Cloud architecture and deployment strategies, Performance optimization and bottleneck identification.',
      category: 'Technical Leadership',
      tags: ['system design', 'architecture', 'scalability']
    },
    {
      id: '7',
      question: 'How do I handle questions about managing underperformance?',
      answer: 'Use a structured approach: Early identification through regular 1:1s and clear expectations, Root cause analysis (skill gaps, motivation, role fit, external factors), Collaborative improvement plan with specific goals and timeline, Regular check-ins and support/resources provided, Documentation of progress and conversations, Difficult decisions when improvement doesn\'t occur, Always emphasize empathy and fairness in your approach.',
      category: 'People Management',
      tags: ['performance', 'management', 'difficult conversations']
    },
    {
      id: '8',
      question: 'What questions should I ask the interviewer?',
      answer: 'Ask thoughtful questions about: Team structure and current challenges, Engineering culture and development practices, Growth opportunities and career progression, How success is measured in the role, Recent technical initiatives or strategic priorities, What the interviewer enjoys most about working there, Specific projects you\'d be working on initially. Avoid questions about salary, benefits, or basic company information easily found online.',
      category: 'Interview Process',
      tags: ['questions', 'interviewer', 'research']
    },
    {
      id: '9',
      question: 'How do I research a company effectively?',
      answer: 'Comprehensive research includes: Engineering blog posts and tech talks, Recent product launches and technical challenges, Company values and engineering principles, Team structure and recent hires on LinkedIn, Glassdoor reviews (especially from engineers), Recent news, funding, or strategic initiatives, Open source contributions and technical stack, Engineering culture through podcasts or interviews.',
      category: 'Company Research',
      tags: ['research', 'company', 'preparation']
    },
    {
      id: '10',
      question: 'What are common red flags to avoid?',
      answer: 'Avoid these mistakes: Speaking negatively about previous employers or team members, Taking all credit without acknowledging team contributions, Being unable to discuss technical details of your work, Showing lack of empathy or emotional intelligence, Not having questions about the role or company, Being unprepared for basic behavioral questions, Focusing only on technical aspects without leadership examples, Not demonstrating growth mindset or learning from failures.',
      category: 'Interview Process',
      tags: ['red flags', 'mistakes', 'interview tips']
    },
    {
      id: '11',
      question: 'How do I demonstrate impact in my stories?',
      answer: 'Quantify your impact wherever possible: Team productivity improvements (velocity, deployment frequency), System performance gains (latency, throughput, uptime), Cost savings or revenue impact, Team growth and retention metrics, Process improvements and time savings, Quality improvements (bug reduction, incident frequency), Stakeholder satisfaction and alignment metrics. When numbers aren\'t available, describe qualitative improvements clearly.',
      category: 'STAR Stories',
      tags: ['impact', 'metrics', 'results']
    },
    {
      id: '12',
      question: 'What if I get a question I haven\'t prepared for?',
      answer: 'Stay calm and use these strategies: Take a moment to think before responding, Use the STAR framework even for unexpected questions, Draw from adjacent experiences that demonstrate similar skills, Be honest if you lack specific experience but show how you\'d approach it, Ask clarifying questions to better understand what they\'re looking for, Connect your response back to the role requirements, Show your problem-solving process even if you don\'t have a perfect example.',
      category: 'Interview Process',
      tags: ['unexpected questions', 'strategy', 'problem solving']
    },
    {
      id: '13',
      question: 'How do I handle technical disagreements with stakeholders?',
      answer: 'Demonstrate collaborative problem-solving: Listen to understand their perspective and constraints, Clearly articulate technical trade-offs and risks, Present options with pros/cons rather than just saying "no", Find common ground and shared objectives, Use data and examples to support your position, Escalate appropriately when consensus can\'t be reached, Follow up to ensure alignment and document decisions, Show willingness to compromise when appropriate.',
      category: 'Collaboration',
      tags: ['stakeholders', 'conflict resolution', 'technical decisions']
    },
    {
      id: '14',
      question: 'What\'s the difference between IC and EM interview focus?',
      answer: 'EM interviews emphasize different aspects: Less focus on coding/algorithms, more on system design and architecture, Heavy emphasis on leadership and people management scenarios, Questions about scaling teams and processes, Cross-functional collaboration and stakeholder management, Strategic thinking and business impact, Cultural and values alignment, Ability to develop others and build high-performing teams. Technical depth is still important but applied through a leadership lens.',
      category: 'General Preparation',
      tags: ['EM vs IC', 'interview focus', 'leadership']
    },
    {
      id: '15',
      question: 'How do I prepare for company-specific values questions?',
      answer: 'Research and align with company values: Study the company\'s stated values and principles, Find specific examples from your experience that demonstrate each value, Understand how values translate to day-to-day work, Prepare stories that show values in action, not just awareness, Research how the company applies values in decision-making, Be authentic - don\'t fabricate alignment that doesn\'t exist, Show how you\'ve helped others embody similar values.',
      category: 'Company Research',
      tags: ['company values', 'culture fit', 'alignment']
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'General Preparation': return Target;
      case 'STAR Stories': return BookOpen;
      case 'Technical Leadership': return Brain;
      case 'People Management': return Users;
      case 'Interview Process': return HelpCircle;
      case 'Company Research': return Search;
      case 'Collaboration': return Users;
      default: return HelpCircle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'General Preparation': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'STAR Stories': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Technical Leadership': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'People Management': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'Interview Process': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'Company Research': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Collaboration': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search FAQs
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions, answers, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredFAQs.length} of {faqData.length} questions
          </div>
        </CardContent>
      </Card>

      {/* FAQ Categories Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = getCategoryIcon(category);
          const categoryCount = faqData.filter(item => item.category === category).length;
          
          return (
            <Card 
              key={category} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCategory(category)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon className="h-5 w-5" />
                  {category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {categoryCount} question{categoryCount !== 1 ? 's' : ''}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Questions & Answers
          </CardTitle>
          <CardDescription>
            Click on any question to expand the detailed answer
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-1">
                        <div className="font-medium">{faq.question}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`text-xs ${getCategoryColor(faq.category)}`}>
                            {faq.category}
                          </Badge>
                          {faq.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-2 space-y-3">
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {faq.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No questions found matching your search criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Interview Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Before the Interview</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Research the company and role thoroughly</li>
                <li>• Practice your STAR stories out loud</li>
                <li>• Prepare thoughtful questions to ask</li>
                <li>• Review your resume and be ready to discuss any point</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">During the Interview</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Listen carefully and ask clarifying questions</li>
                <li>• Use specific examples with measurable impact</li>
                <li>• Show enthusiasm and genuine interest</li>
                <li>• Be honest about areas for growth</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
