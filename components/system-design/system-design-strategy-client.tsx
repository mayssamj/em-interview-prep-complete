
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Network, 
  Database, 
  Zap, 
  Shield, 
  TrendingUp, 
  Clock,
  Users,
  GitBranch,
  Layers,
  Globe,
  Lock,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  ExternalLink,
  Target,
  Lightbulb
} from 'lucide-react';

interface SystemDesignFramework {
  id: string;
  name: string;
  description: string;
  category: string;
  key_principles: string[]; // Fixed: Use actual API field names
  use_cases: string[];
  tradeoffs: string[];
  examples: string[];
  resources: string[];
  difficulty: string;
}

export function SystemDesignStrategyClient() {
  const [frameworks, setFrameworks] = useState<SystemDesignFramework[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchFrameworks();
  }, [selectedCategory, selectedDifficulty]);

  const fetchFrameworks = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);

      const response = await fetch(`/api/system-design-frameworks?${params}`);
      if (response.ok) {
        const data = await response.json();
        setFrameworks(data || []); // Fixed: Ensure frameworks is always an array
      } else {
        throw new Error('Failed to fetch frameworks');
      }
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system design frameworks',
        variant: 'destructive'
      });
      setFrameworks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'architecture_patterns': return <Layers className="h-5 w-5" />;
      case 'data_consistency': return <Database className="h-5 w-5" />;
      case 'scalability': return <TrendingUp className="h-5 w-5" />;
      case 'security': return <Shield className="h-5 w-5" />;
      case 'performance': return <Zap className="h-5 w-5" />;
      case 'reliability': return <CheckCircle className="h-5 w-5" />;
      default: return <Network className="h-5 w-5" />;
    }
  };

  // Safe access to frameworks array
  const categories = frameworks && frameworks.length > 0 ? [...new Set(frameworks.map(f => f.category))] : [];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Core system design principles and strategies
  const coreStrategies = [
    {
      title: "System Design Interview Approach",
      icon: <Target className="h-6 w-6" />,
      description: "A structured approach to tackle any system design interview",
      steps: [
        {
          step: "1. Clarify Requirements",
          description: "Ask questions about scale, features, constraints, and non-functional requirements",
          details: [
            "What is the expected scale? (users, requests per second, data volume)",
            "What are the core features we need to support?",
            "What are the performance requirements? (latency, availability)",
            "Are there any specific constraints or assumptions?"
          ]
        },
        {
          step: "2. High-Level Design",
          description: "Start with a simple, high-level architecture",
          details: [
            "Identify major components (web servers, databases, caches)",
            "Show data flow between components",
            "Keep it simple initially - avoid premature optimization",
            "Focus on the core functionality first"
          ]
        },
        {
          step: "3. Deep Dive",
          description: "Dive deeper into critical components",
          details: [
            "Choose 1-2 critical components to elaborate",
            "Discuss data models and schemas",
            "Explain algorithms and data structures",
            "Address specific technical challenges"
          ]
        },
        {
          step: "4. Scale the Design",
          description: "Address scalability and performance bottlenecks",
          details: [
            "Identify potential bottlenecks",
            "Discuss horizontal vs vertical scaling",
            "Add caching layers where appropriate",
            "Consider load balancing and data partitioning"
          ]
        },
        {
          step: "5. Address Edge Cases",
          description: "Discuss failure scenarios and edge cases",
          details: [
            "What happens when components fail?",
            "How to handle data consistency issues?",
            "Monitoring and alerting strategies",
            "Disaster recovery and backup plans"
          ]
        }
      ]
    },
    {
      title: "EM-Specific Considerations",
      icon: <Users className="h-6 w-6" />,
      description: "Leadership aspects unique to Engineering Manager system design interviews",
      steps: [
        {
          step: "Technical Leadership",
          description: "Demonstrate ability to lead technical discussions",
          details: [
            "Drive the conversation and ask clarifying questions",
            "Make decisions when faced with multiple options",
            "Explain technical concepts clearly to different audiences",
            "Show ownership of the overall solution"
          ]
        },
        {
          step: "Cross-functional Collaboration",
          description: "Consider stakeholder and team perspectives",
          details: [
            "How would you work with product managers on requirements?",
            "What would you communicate to executives about timeline/resources?",
            "How would you coordinate with other engineering teams?",
            "Consider impact on customer experience"
          ]
        },
        {
          step: "Team and Process Design",
          description: "Think about implementation and team structure",
          details: [
            "How would you structure teams around this system?",
            "What development processes would you implement?",
            "How would you handle technical debt and maintenance?",
            "What skills would your team need?"
          ]
        },
        {
          step: "Risk Management",
          description: "Identify and mitigate technical and business risks",
          details: [
            "What are the biggest technical risks?",
            "How would you validate assumptions early?",
            "What would be your rollback strategy?",
            "How would you measure success?"
          ]
        }
      ]
    }
  ];

  const keyTradeoffs = [
    {
      title: "Consistency vs Availability",
      description: "CAP Theorem implications",
      icon: <Database className="h-5 w-5" />,
      details: [
        "Strong consistency: All nodes see the same data simultaneously",
        "Eventual consistency: System will become consistent over time",
        "Availability: System remains operational during failures",
        "Partition tolerance: System continues despite network failures"
      ],
      examples: [
        "Banking systems prioritize consistency over availability",
        "Social media feeds can tolerate eventual consistency",
        "E-commerce inventory needs strong consistency for stock levels"
      ]
    },
    {
      title: "Latency vs Throughput",
      description: "Performance optimization trade-offs",
      icon: <Zap className="h-5 w-5" />,
      details: [
        "Latency: Time to process a single request",
        "Throughput: Number of requests processed per unit time",
        "Often inversely related - optimizing one may hurt the other",
        "Batching can improve throughput but increase latency"
      ],
      examples: [
        "Real-time gaming prioritizes low latency",
        "Data processing pipelines optimize for throughput",
        "CDNs balance both through geographic distribution"
      ]
    },
    {
      title: "Horizontal vs Vertical Scaling",
      description: "Scaling strategy considerations",
      icon: <TrendingUp className="h-5 w-5" />,
      details: [
        "Horizontal: Add more machines (scale out)",
        "Vertical: Add more power to existing machines (scale up)",
        "Horizontal scaling provides better fault tolerance",
        "Vertical scaling is simpler but has limits"
      ],
      examples: [
        "Web servers typically scale horizontally",
        "Databases often start with vertical scaling",
        "Microservices enable horizontal scaling"
      ]
    },
    {
      title: "SQL vs NoSQL",
      description: "Database technology choices",
      icon: <Database className="h-5 w-5" />,
      details: [
        "SQL: ACID properties, complex queries, structured data",
        "NoSQL: Flexible schema, horizontal scaling, eventual consistency",
        "Consider data structure and access patterns",
        "Hybrid approaches are increasingly common"
      ],
      examples: [
        "Financial transactions require SQL ACID properties",
        "User profiles and preferences suit NoSQL",
        "Analytics workloads may use both"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading system design frameworks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="approach" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="approach">Interview Approach</TabsTrigger>
          <TabsTrigger value="tradeoffs">Key Tradeoffs</TabsTrigger>
          <TabsTrigger value="frameworks">Frameworks</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="approach" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coreStrategies.map((strategy, index) => (
              <Card key={index} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {strategy.icon}
                    {strategy.title}
                  </CardTitle>
                  <CardDescription>{strategy.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {strategy.steps.map((step, stepIndex) => (
                      <AccordionItem key={stepIndex} value={`step-${stepIndex}`}>
                        <AccordionTrigger className="text-left">
                          <div>
                            <div className="font-medium">{step.step}</div>
                            <div className="text-sm text-muted-foreground">{step.description}</div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {step.details.map((detail, detailIndex) => (
                              <li key={detailIndex} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tradeoffs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {keyTradeoffs.map((tradeoff, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    {tradeoff.icon}
                    {tradeoff.title}
                  </CardTitle>
                  <CardDescription>{tradeoff.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Key Concepts:</h4>
                    <ul className="space-y-1">
                      {tradeoff.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Real-world Examples:</h4>
                    <ul className="space-y-1">
                      {tradeoff.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-start gap-2 text-sm">
                          <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="frameworks" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Frameworks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty</label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Frameworks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {frameworks && frameworks.length > 0 ? frameworks.map((framework) => (
              <Card key={framework.id} className="h-fit">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(framework.category)}
                      <div>
                        <CardTitle className="text-lg">{framework.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getDifficultyColor(framework.difficulty)}>
                            {framework.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {framework.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{framework.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="principles">
                      <AccordionTrigger>Key Principles</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {framework.key_principles && framework.key_principles.map((principle, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {principle}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="usecases">
                      <AccordionTrigger>Use Cases</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {framework.use_cases && framework.use_cases.map((useCase, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Target className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              {useCase}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="tradeoffs">
                      <AccordionTrigger>Tradeoffs</AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1">
                          {framework.tradeoffs && framework.tradeoffs.map((tradeoff, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              {tradeoff}
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {framework.examples && framework.examples.length > 0 && (
                      <AccordionItem value="examples">
                        <AccordionTrigger>Examples</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-1">
                            {framework.examples.map((example, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <BarChart3 className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                {example}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                  
                  {framework.resources && framework.resources.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Resources
                      </h4>
                      <div className="space-y-1">
                        {framework.resources.map((resource, index) => (
                          <a 
                            key={index}
                            href={resource} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline block"
                          >
                            {resource}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No frameworks found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters or check back later for more content.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Essential Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <a href="https://github.com/donnemartin/system-design-primer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      System Design Primer (GitHub)
                    </a>
                    <p className="text-sm text-muted-foreground">Comprehensive guide to system design concepts</p>
                  </li>
                  <li>
                    <a href="https://www.educative.io/courses/grokking-the-system-design-interview" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      Grokking the System Design Interview
                    </a>
                    <p className="text-sm text-muted-foreground">Structured approach to system design interviews</p>
                  </li>
                  <li>
                    <a href="https://www.hiredintech.com/courses/system-design" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                      HiredInTech System Design Course
                    </a>
                    <p className="text-sm text-muted-foreground">Free course on system design fundamentals</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Real-World Examples
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li>
                    <span className="font-medium">Netflix Architecture</span>
                    <p className="text-sm text-muted-foreground">Microservices, CDN, and chaos engineering</p>
                  </li>
                  <li>
                    <span className="font-medium">Facebook TAO</span>
                    <p className="text-sm text-muted-foreground">Distributed data store for social graph</p>
                  </li>
                  <li>
                    <span className="font-medium">Google File System</span>
                    <p className="text-sm text-muted-foreground">Distributed file system for large-scale data</p>
                  </li>
                  <li>
                    <span className="font-medium">Amazon S3</span>
                    <p className="text-sm text-muted-foreground">Object storage with 99.999999999% durability</p>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Practice Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Practice on paper or whiteboard, not just digital tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Time yourself - aim for 30-45 minutes per question</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Always start with clarifying questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Focus on high-level design before diving into details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Discuss tradeoffs and justify your decisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  EM-Specific Prep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Users className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Practice explaining technical concepts to non-technical stakeholders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Think about team structure and development processes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Consider operational aspects: monitoring, alerting, maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Discuss how you'd measure success and iterate</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
