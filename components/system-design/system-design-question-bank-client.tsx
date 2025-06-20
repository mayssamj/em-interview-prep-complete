
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Network,
  Database,
  Zap,
  Shield,
  TrendingUp,
  BookOpen,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Target
} from 'lucide-react';

interface SystemDesignQuestion {
  id: string;
  question_text: string;
  difficulty: string;
  category: string;
  categories: string[];
  is_critical: boolean;
  tags: string[];
  usage_count: number;
  companies?: {
    id: string;
    name: string;
  };
  system_design_questions?: {
    question_title?: string;
    problem_statement?: string;
    clarifying_questions: string[];
    functional_requirements: string[];
    non_functional_requirements: string[];
    core_solution?: any;
    references: string[];
    back_of_envelope_calculations?: any;
    technology_stack?: any;
    tradeoffs?: any;
    scalability_considerations: string[];
    alternative_solutions: string[];
    key_technical_criteria: string[];
    architecture_focus: string[];
    complexity_level: string;
    leadership_aspects: string[];
    frameworks: string[];
    evaluation_criteria: string[];
    resources: string[];
    estimated_time_minutes?: number;
    follow_up_questions: string[];
    common_mistakes: string[];
    key_tradeoffs: string[];
  };
  _count?: {
    answers: number;
    system_design_answers: number;
  };
}

interface SystemDesignCategory {
  id: string;
  name: string;
  description: string;
  count: number;
}

interface SystemDesignAnswer {
  id: string;
  high_level_design: string;
  detailed_components?: any;
  scalability_approach?: string;
  data_storage_strategy?: string;
  tradeoffs_discussed: string[];
  frameworks_used: string[];
  estimated_scale?: string;
  notes?: string;
}

export function SystemDesignQuestionBankClient() {
  const [questions, setQuestions] = useState<SystemDesignQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<SystemDesignQuestion[]>([]);
  const [categories, setCategories] = useState<SystemDesignCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SystemDesignQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<SystemDesignAnswer | null>(null);
  const [answerForm, setAnswerForm] = useState({
    high_level_design: '',
    scalability_approach: '',
    data_storage_strategy: '',
    tradeoffs_discussed: [] as string[],
    frameworks_used: [] as string[],
    estimated_scale: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedCompany, selectedDifficulty, selectedCategory, showCriticalOnly]);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchQuery]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCompany !== 'all') params.append('company', selectedCompany);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (showCriticalOnly) params.append('critical', 'true');

      const response = await fetch(`/api/system-design-questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        throw new Error('Failed to fetch questions');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch system design questions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/system-design-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        throw new Error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to empty array if categories API fails
      setCategories([]);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    // Only apply search filtering here, other filters are handled by API
    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.companies?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleQuestionClick = async (question: SystemDesignQuestion) => {
    setSelectedQuestion(question);
    
    // Fetch user's existing answer if any
    try {
      const response = await fetch(`/api/system-design-answers?questionId=${question.id}`);
      if (response.ok) {
        const answers = await response.json();
        if (answers.length > 0) {
          const answer = answers[0];
          setUserAnswer(answer);
          setAnswerForm({
            high_level_design: answer.high_level_design || '',
            scalability_approach: answer.scalability_approach || '',
            data_storage_strategy: answer.data_storage_strategy || '',
            tradeoffs_discussed: answer.tradeoffs_discussed || [],
            frameworks_used: answer.frameworks_used || [],
            estimated_scale: answer.estimated_scale || '',
            notes: answer.notes || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching user answer:', error);
    }
  };

  const saveAnswer = async () => {
    if (!selectedQuestion) return;

    try {
      const response = await fetch('/api/system-design-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          questionId: selectedQuestion.id,
          ...answerForm
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your system design answer has been saved'
        });
        setUserAnswer(await response.json());
      }
    } catch (error) {
      console.error('Error saving answer:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your answer',
        variant: 'destructive'
      });
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

  const getComplexityIcon = (level: string) => {
    switch (level) {
      case 'junior': return <Users className="h-4 w-4" />;
      case 'mid': return <Network className="h-4 w-4" />;
      case 'senior': return <Database className="h-4 w-4" />;
      case 'staff': return <Zap className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  const companies = [...new Set(questions.map(q => q.companies?.name).filter(Boolean))];
  const difficulties = ['Easy', 'Medium', 'Hard'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading system design questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Company</Label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company} value={company || 'all'}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
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

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4 mt-4">
            <Button
              variant={showCriticalOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowCriticalOnly(!showCriticalOnly)}
              className="flex items-center gap-2"
            >
              <Star className="h-4 w-4" />
              Critical Questions Only
            </Button>
            
            <div className="text-sm text-muted-foreground">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredQuestions.map((question) => (
          <Card key={question.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight mb-2">
                    {question.question_text}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    {question.is_critical && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Critical
                      </Badge>
                    )}
                    {question.companies && (
                      <Badge variant="outline">
                        {question.companies.name}
                      </Badge>
                    )}
                  </div>
                  {question.categories && question.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {question.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {question.system_design_questions && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getComplexityIcon(question.system_design_questions.complexity_level)}
                      <span className="text-muted-foreground">
                        {question.system_design_questions.complexity_level} level
                      </span>
                    </div>
                    {question.system_design_questions.estimated_time_minutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-muted-foreground">
                          {question.system_design_questions.estimated_time_minutes} min
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {question.system_design_questions?.architecture_focus && question.system_design_questions.architecture_focus.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.system_design_questions.architecture_focus.slice(0, 3).map((focus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                      {question.system_design_questions.architecture_focus.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{question.system_design_questions.architecture_focus.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {question.usage_count} views
                    </span>
                    {question._count && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {question._count.system_design_answers} answers
                      </span>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        onClick={() => handleQuestionClick(question)}
                        className="flex items-center gap-1"
                      >
                        Practice
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl">{question.question_text}</DialogTitle>
                        <DialogDescription>
                          System Design Practice - {question.companies?.name || 'General'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="question" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="question">Question Details</TabsTrigger>
                          <TabsTrigger value="answer">Your Answer</TabsTrigger>
                          <TabsTrigger value="guidance">Guidance</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="question" className="space-y-6">
                          {question.system_design_questions && (
                            <div className="space-y-6">
                              {/* Problem Statement */}
                              {question.system_design_questions.problem_statement && (
                                <div className="bg-muted/50 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2">Problem Statement</h4>
                                  <p className="text-sm leading-relaxed">{question.system_design_questions.problem_statement}</p>
                                </div>
                              )}

                              {/* Clarifying Questions */}
                              {question.system_design_questions.clarifying_questions?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    Clarifying Questions to Ask
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1 pl-4">
                                    {question.system_design_questions.clarifying_questions.map((q, index) => (
                                      <li key={index}>{q}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Requirements */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {question.system_design_questions.functional_requirements?.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Functional Requirements</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                      {question.system_design_questions.functional_requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {question.system_design_questions.non_functional_requirements?.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-3">Non-Functional Requirements</h4>
                                    <ul className="list-disc list-inside text-sm space-y-1">
                                      {question.system_design_questions.non_functional_requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>

                              {/* Core Solution */}
                              {question.system_design_questions.core_solution && (
                                <div>
                                  <h4 className="font-medium mb-3">Core Solution Approach</h4>
                                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                                    {question.system_design_questions.core_solution.architecture && (
                                      <div>
                                        <span className="font-medium text-sm">Architecture: </span>
                                        <span className="text-sm">{question.system_design_questions.core_solution.architecture}</span>
                                      </div>
                                    )}
                                    {question.system_design_questions.core_solution.key_components && (
                                      <div>
                                        <span className="font-medium text-sm">Key Components: </span>
                                        <ul className="list-disc list-inside text-sm mt-1">
                                          {question.system_design_questions.core_solution.key_components.map((comp: string, index: number) => (
                                            <li key={index}>{comp}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Back of Envelope Calculations */}
                              {question.system_design_questions.back_of_envelope_calculations && (
                                <div>
                                  <h4 className="font-medium mb-3">Back-of-Envelope Calculations</h4>
                                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg space-y-2">
                                    {Object.entries(question.system_design_questions.back_of_envelope_calculations).map(([key, value]) => (
                                      <div key={key}>
                                        <span className="font-medium text-sm capitalize">{key.replace(/_/g, ' ')}: </span>
                                        <span className="text-sm">{value as string}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Technology Stack */}
                              {question.system_design_questions.technology_stack && (
                                <div>
                                  <h4 className="font-medium mb-3">Technology Stack Options</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(question.system_design_questions.technology_stack).map(([category, technologies]) => (
                                      <div key={category} className="bg-muted/30 p-3 rounded-lg">
                                        <span className="font-medium text-sm capitalize block mb-2">{category.replace(/_/g, ' ')}</span>
                                        <span className="text-sm">{technologies as string}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Scalability Considerations */}
                              {question.system_design_questions.scalability_considerations?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Scalability Considerations</h4>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {question.system_design_questions.scalability_considerations.map((consideration, index) => (
                                      <li key={index}>{consideration}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Alternative Solutions */}
                              {question.system_design_questions.alternative_solutions?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3">Alternative Solutions</h4>
                                  <ul className="list-disc list-inside text-sm space-y-1">
                                    {question.system_design_questions.alternative_solutions.map((solution, index) => (
                                      <li key={index}>{solution}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="answer" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="high_level_design">High-Level Design</Label>
                              <Textarea
                                id="high_level_design"
                                placeholder="Describe your overall system architecture..."
                                value={answerForm.high_level_design}
                                onChange={(e) => setAnswerForm({...answerForm, high_level_design: e.target.value})}
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="scalability_approach">Scalability Approach</Label>
                                <Textarea
                                  id="scalability_approach"
                                  placeholder="How will you scale this system?"
                                  value={answerForm.scalability_approach}
                                  onChange={(e) => setAnswerForm({...answerForm, scalability_approach: e.target.value})}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="data_storage_strategy">Data Storage Strategy</Label>
                                <Textarea
                                  id="data_storage_strategy"
                                  placeholder="Describe your data storage approach..."
                                  value={answerForm.data_storage_strategy}
                                  onChange={(e) => setAnswerForm({...answerForm, data_storage_strategy: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="estimated_scale">Estimated Scale</Label>
                              <Input
                                id="estimated_scale"
                                placeholder="e.g., 1M users, 100K QPS"
                                value={answerForm.estimated_scale}
                                onChange={(e) => setAnswerForm({...answerForm, estimated_scale: e.target.value})}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea
                                id="notes"
                                placeholder="Any additional thoughts or considerations..."
                                value={answerForm.notes}
                                onChange={(e) => setAnswerForm({...answerForm, notes: e.target.value})}
                              />
                            </div>
                            
                            <Button onClick={saveAnswer} className="w-full">
                              Save Answer
                            </Button>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="guidance" className="space-y-6">
                          {question.system_design_questions && (
                            <div className="space-y-6">
                              {/* Key Technical Criteria */}
                              {question.system_design_questions.key_technical_criteria?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Target className="h-4 w-4" />
                                    Key Technical Criteria
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1 bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                                    {question.system_design_questions.key_technical_criteria.map((criteria, index) => (
                                      <li key={index}>{criteria}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Tradeoffs */}
                              {question.system_design_questions.tradeoffs && Object.keys(question.system_design_questions.tradeoffs).length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Key Tradeoffs to Discuss
                                  </h4>
                                  <div className="space-y-3">
                                    {Object.entries(question.system_design_questions.tradeoffs).map(([tradeoff, description]) => (
                                      <div key={tradeoff} className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg">
                                        <span className="font-medium text-sm block mb-1">{tradeoff.replace(/_/g, ' ').toUpperCase()}</span>
                                        <span className="text-sm">{description as string}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Common Mistakes */}
                              {question.system_design_questions.common_mistakes?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Shield className="h-4 w-4" />
                                    Common Mistakes to Avoid
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1 bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                                    {question.system_design_questions.common_mistakes.map((mistake, index) => (
                                      <li key={index}>{mistake}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Follow-up Questions */}
                              {question.system_design_questions.follow_up_questions?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <HelpCircle className="h-4 w-4" />
                                    Follow-up Questions
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                                    {question.system_design_questions.follow_up_questions.map((followUp, index) => (
                                      <li key={index}>{followUp}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Leadership Aspects */}
                              {question.system_design_questions.leadership_aspects?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Leadership Aspects to Demonstrate
                                  </h4>
                                  <ul className="list-disc list-inside text-sm space-y-1 bg-purple-50 dark:bg-purple-950/20 p-4 rounded-lg">
                                    {question.system_design_questions.leadership_aspects.map((aspect, index) => (
                                      <li key={index}>{aspect}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Study Resources */}
                              {question.system_design_questions.references?.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-3 flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Study Resources
                                  </h4>
                                  <ul className="space-y-2">
                                    {question.system_design_questions.references.map((resource, index) => (
                                      <li key={index}>
                                        <a 
                                          href={resource} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                        >
                                          <ExternalLink className="h-3 w-3" />
                                          {resource}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No questions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or search criteria.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
