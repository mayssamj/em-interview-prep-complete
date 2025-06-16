
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  ArrowRight,
  Target,
  Users,
  Grid3X3,
  List,
  ChevronDown,
  ChevronUp,
  Star,
  HelpCircle
} from 'lucide-react';

interface Question {
  id: string;
  question_text: string;
  category: string;
  difficulty: string;
  is_critical: boolean;
}

interface CompanyData {
  id: string;
  name: string;
  description: string;
  color: string;
  highlights: string[];
  questionCount: number;
  slug: string;
  questions: Question[];
}

interface FilteredCompanySelectorProps {
  selectedCompany: string;
}

const companyMappings = [
  {
    id: 'meta',
    name: 'Meta',
    description: 'Focus on people management, technical leadership, and cultural fit',
    color: 'bg-blue-500',
    highlights: ['Move Fast', 'Long-term Impact', 'Build Awesome Things'],
    slug: 'meta',
  },
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'Leadership Principles-focused behavioral interviews',
    color: 'bg-orange-500',
    highlights: ['Customer Obsession', 'Ownership', 'Deliver Results'],
    slug: 'amazon',
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Googleyness, technical depth, and emergent leadership',
    color: 'bg-green-500',
    highlights: ['Googleyness', 'Technical Excellence', 'Innovation'],
    slug: 'google',
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    description: 'Growth mindset, inclusive leadership, and customer focus',
    color: 'bg-cyan-500',
    highlights: ['Growth Mindset', 'Inclusive Culture', 'Customer Impact'],
    slug: 'microsoft',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI safety, research excellence, and responsible development',
    color: 'bg-purple-500',
    highlights: ['AI Safety', 'Research Leadership', 'Ethical AI'],
    slug: 'openai',
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'High performance culture, innovation, and global scale',
    color: 'bg-red-500',
    highlights: ['High Performance', 'Innovation', 'Global Scale'],
    slug: 'netflix',
  },
  {
    id: 'uber',
    name: 'Uber',
    description: 'Marketplace dynamics, global scale, and real-time systems',
    color: 'bg-gray-800',
    highlights: ['Global Markets', 'Real-time Systems', 'Marketplace'],
    slug: 'uber',
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Community building, belonging, and trust & safety',
    color: 'bg-pink-500',
    highlights: ['Belonging', 'Community', 'Trust & Safety'],
    slug: 'airbnb',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: 'Professional networking, career growth, and member value',
    color: 'bg-blue-600',
    highlights: ['Professional Growth', 'Member Value', 'Career Impact'],
    slug: 'linkedin',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    description: 'Creative expression, global scale, and algorithm excellence',
    color: 'bg-black',
    highlights: ['Creative Tech', 'Global Scale', 'Algorithm Innovation'],
    slug: 'tiktok',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    description: 'Community building, content moderation, and user engagement',
    color: 'bg-orange-600',
    highlights: ['Community First', 'User Engagement', 'Content Quality'],
    slug: 'reddit',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Data cloud platform, enterprise scale, and performance',
    color: 'bg-blue-400',
    highlights: ['Data Excellence', 'Enterprise Scale', 'Cloud Innovation'],
    slug: 'snowflake',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'AI safety research, responsible AI development, and ethics',
    color: 'bg-indigo-500',
    highlights: ['AI Safety', 'Research Excellence', 'Responsible AI'],
    slug: 'anthropic',
  },
  {
    id: 'scale-ai',
    name: 'Scale AI',
    description: 'AI infrastructure, data quality, and machine learning operations',
    color: 'bg-violet-500',
    highlights: ['AI Infrastructure', 'Data Quality', 'ML Operations'],
    slug: 'scale-ai',
  },
  {
    id: 'startups',
    name: 'Startups & Scale-ups',
    description: '0-1 building, rapid scaling, and resourceful leadership',
    color: 'bg-emerald-500',
    highlights: ['0-1 Building', 'Rapid Scaling', 'Resourcefulness'],
    slug: 'startups',
  },
];

export function FilteredCompanySelector({ selectedCompany }: FilteredCompanySelectorProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCompaniesWithQuestions();
    
    // Load view preference from localStorage
    const savedViewMode = localStorage.getItem('companyViewMode') as 'grid' | 'list';
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  const fetchCompaniesWithQuestions = async () => {
    try {
      const response = await fetch('/api/companies/with-questions');
      if (response.ok) {
        const data = await response.json();
        
        // Map the data to include UI properties
        const enhancedCompanies = companyMappings.map(mapping => {
          const dbCompany = data.companies?.find((c: any) => {
            // Handle different name formats
            const dbName = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const mappingName = mapping.name.toLowerCase().replace(/[^a-z0-9]/g, '');
            return dbName === mappingName || 
                   c.name === mapping.name ||
                   (mapping.name === 'Startups & Scale-ups' && c.name === 'Startups & Scale-ups');
          });
          return {
            ...mapping,
            questionCount: dbCompany?.questions?.length || 0,
            questions: dbCompany?.questions?.slice(0, 3) || [] // Show top 3 questions
          };
        }).filter(company => company.questionCount > 0);
        
        setCompanies(enhancedCompanies);
      } else {
        throw new Error('Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: 'Error',
        description: 'Failed to load companies. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('companyViewMode', mode);
  };

  const handleCompanySelect = (companySlug: string) => {
    router.push(`/company/${companySlug}`);
  };

  const toggleExpanded = (companyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const handleQuestionClick = (questionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/question-bank?question=${questionId}`);
  };

  // Filter companies based on selection
  const filteredCompanies = selectedCompany === 'all' 
    ? companies 
    : companies.filter(company => company.id === selectedCompany);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Building2 className="h-8 w-8 text-primary" />
            Choose Your Target Company
          </h2>
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          {selectedCompany === 'all' ? 'Choose Your Target Company' : `${filteredCompanies[0]?.name || 'Company'} Interview Prep`}
        </h2>
        <p className="text-muted-foreground">
          {selectedCompany === 'all' 
            ? 'Select a company to access tailored questions, strategies, and preparation materials'
            : `Focused preparation materials and questions for ${filteredCompanies[0]?.name || 'your selected company'}`
          }
        </p>
        
        {/* View Toggle - only show for all companies */}
        {selectedCompany === 'all' && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleViewModeChange('list')}
            >
              <List className="h-4 w-4 mr-2" />
              List View
            </Button>
          </div>
        )}
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {filteredCompanies.map((company) => {
          const isExpanded = expandedCompanies.has(company.id);
          
          return (
            <Card 
              key={company.id} 
              className="card-hover cursor-pointer group"
            >
              {viewMode === 'grid' ? (
                <>
                  <CardHeader onClick={() => handleCompanySelect(company.slug)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${company.color}`} />
                        <CardTitle className="text-xl">{company.name}</CardTitle>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardDescription className="text-sm">
                      {company.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {company.highlights.map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{company.questionCount} questions</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCompanySelect(company.slug)}
                        className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      >
                        Start Prep
                      </Button>
                    </div>

                    {/* Sample Questions */}
                    {company.questions.length > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => {}}>
                        <CollapsibleTrigger 
                          className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors"
                          onClick={(e) => toggleExpanded(company.id, e)}
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Sample Questions
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2">
                          {company.questions.map((question) => (
                            <div 
                              key={question.id}
                              className="p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors cursor-pointer"
                              onClick={(e) => handleQuestionClick(question.id, e)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {question.question_text}
                                </p>
                                {question.is_critical && (
                                  <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.difficulty}
                                </Badge>
                              </div>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full mt-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompanySelect(company.slug);
                            }}
                          >
                            View All Questions
                          </Button>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between" onClick={() => handleCompanySelect(company.slug)}>
                      <div className="flex items-center space-x-4">
                        <div className={`w-4 h-4 rounded-full ${company.color}`} />
                        <div className="flex-1">
                          <CardTitle className="text-lg">{company.name}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {company.description}
                          </CardDescription>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {company.highlights.slice(0, 2).map((highlight) => (
                              <Badge key={highlight} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                            {company.highlights.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{company.highlights.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>{company.questionCount}</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>

                    {/* Sample Questions for List View */}
                    {company.questions.length > 0 && (
                      <Collapsible open={isExpanded} onOpenChange={() => {}}>
                        <CollapsibleTrigger 
                          className="flex items-center justify-between w-full text-sm font-medium hover:text-primary transition-colors"
                          onClick={(e) => toggleExpanded(company.id, e)}
                        >
                          <span className="flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" />
                            Sample Questions
                          </span>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 mt-2">
                          {company.questions.map((question) => (
                            <div 
                              key={question.id}
                              className="p-2 bg-muted/50 rounded-md hover:bg-muted transition-colors cursor-pointer"
                              onClick={(e) => handleQuestionClick(question.id, e)}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-xs text-muted-foreground">
                                  {question.question_text}
                                </p>
                                {question.is_critical && (
                                  <Star className="h-3 w-3 text-yellow-500 flex-shrink-0" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {question.category}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {question.difficulty}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredCompanies.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No companies found</h3>
            <p className="text-muted-foreground">
              {selectedCompany === 'all' 
                ? 'Companies data is being loaded. Please check back in a moment.'
                : 'No data available for the selected company. Try selecting "All Companies" to see available options.'
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* All Companies Option - only show when filtering by specific company */}
      {selectedCompany !== 'all' && (
        <Card className="border-2 border-dashed border-muted-foreground/25 card-hover cursor-pointer group">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-lg font-medium">
                <Users className="h-5 w-5" />
                View All Questions
              </div>
              <p className="text-sm text-muted-foreground">
                Browse questions across all companies for comprehensive preparation
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/question-bank')}
              >
                Browse All Questions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
