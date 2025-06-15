
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
  ExternalLink
} from 'lucide-react';

interface SystemDesignQuestion {
  id: string;
  questionText: string;
  difficulty: string;
  category: string;
  isCritical: boolean;
  tags: string[];
  usageCount: number;
  company?: {
    id: string;
    name: string;
  };
  systemDesignDetails?: {
    architectureFocus: string[];
    complexityLevel: string;
    leadershipAspects: string[];
    frameworks: string[];
    evaluationCriteria: string[];
    resources: string[];
    estimatedTimeMinutes?: number;
    followUpQuestions: string[];
    commonMistakes: string[];
    keyTradeoffs: string[];
  };
  _count?: {
    answers: number;
    systemDesignAnswers: number;
  };
}

interface SystemDesignAnswer {
  id: string;
  highLevelDesign: string;
  detailedComponents?: any;
  scalabilityApproach?: string;
  dataStorageStrategy?: string;
  tradeoffsDiscussed: string[];
  frameworksUsed: string[];
  estimatedScale?: string;
  notes?: string;
}

export function SystemDesignQuestionBankClient() {
  const [questions, setQuestions] = useState<SystemDesignQuestion[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<SystemDesignQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<SystemDesignQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState<SystemDesignAnswer | null>(null);
  const [answerForm, setAnswerForm] = useState({
    highLevelDesign: '',
    scalabilityApproach: '',
    dataStorageStrategy: '',
    tradeoffsDiscussed: [] as string[],
    frameworksUsed: [] as string[],
    estimatedScale: '',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchQuery, selectedCompany, selectedDifficulty, selectedCategory, showCriticalOnly]);

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

  const filterQuestions = () => {
    let filtered = questions;

    if (searchQuery) {
      filtered = filtered.filter(q => 
        q.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        q.company?.name.toLowerCase().includes(searchQuery.toLowerCase())
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
            highLevelDesign: answer.highLevelDesign || '',
            scalabilityApproach: answer.scalabilityApproach || '',
            dataStorageStrategy: answer.dataStorageStrategy || '',
            tradeoffsDiscussed: answer.tradeoffsDiscussed || [],
            frameworksUsed: answer.frameworksUsed || [],
            estimatedScale: answer.estimatedScale || '',
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

  const companies = [...new Set(questions.map(q => q.company?.name).filter(Boolean))];
  const categories = [...new Set(questions.map(q => q.category))];
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
                    <SelectItem key={category} value={category}>
                      {category}
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
                    {question.questionText}
                  </CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    {question.isCritical && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Critical
                      </Badge>
                    )}
                    {question.company && (
                      <Badge variant="outline">
                        {question.company.name}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {question.systemDesignDetails && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {getComplexityIcon(question.systemDesignDetails.complexityLevel)}
                      <span className="text-muted-foreground">
                        {question.systemDesignDetails.complexityLevel} level
                      </span>
                    </div>
                    {question.systemDesignDetails.estimatedTimeMinutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-muted-foreground">
                          {question.systemDesignDetails.estimatedTimeMinutes} min
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {question.systemDesignDetails?.architectureFocus && question.systemDesignDetails.architectureFocus.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {question.systemDesignDetails.architectureFocus.slice(0, 3).map((focus, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {focus}
                        </Badge>
                      ))}
                      {question.systemDesignDetails.architectureFocus.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{question.systemDesignDetails.architectureFocus.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      {question.usageCount} views
                    </span>
                    {question._count && (
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        {question._count.systemDesignAnswers} answers
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
                        <DialogTitle className="text-xl">{question.questionText}</DialogTitle>
                        <DialogDescription>
                          System Design Practice - {question.company?.name || 'General'}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <Tabs defaultValue="question" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="question">Question Details</TabsTrigger>
                          <TabsTrigger value="answer">Your Answer</TabsTrigger>
                          <TabsTrigger value="guidance">Guidance</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="question" className="space-y-4">
                          {question.systemDesignDetails && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Architecture Focus</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {question.systemDesignDetails.architectureFocus.map((focus, index) => (
                                      <Badge key={index} variant="outline">{focus}</Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Frameworks</h4>
                                  <div className="flex flex-wrap gap-1">
                                    {question.systemDesignDetails.frameworks.map((framework, index) => (
                                      <Badge key={index} variant="secondary">{framework}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Leadership Aspects</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {question.systemDesignDetails.leadershipAspects.map((aspect, index) => (
                                    <li key={index}>{aspect}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Key Tradeoffs to Discuss</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {question.systemDesignDetails.keyTradeoffs.map((tradeoff, index) => (
                                    <li key={index}>{tradeoff}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="answer" className="space-y-4">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="highLevelDesign">High-Level Design</Label>
                              <Textarea
                                id="highLevelDesign"
                                placeholder="Describe your overall system architecture..."
                                value={answerForm.highLevelDesign}
                                onChange={(e) => setAnswerForm({...answerForm, highLevelDesign: e.target.value})}
                                className="min-h-[100px]"
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="scalabilityApproach">Scalability Approach</Label>
                                <Textarea
                                  id="scalabilityApproach"
                                  placeholder="How will you scale this system?"
                                  value={answerForm.scalabilityApproach}
                                  onChange={(e) => setAnswerForm({...answerForm, scalabilityApproach: e.target.value})}
                                />
                              </div>
                              
                              <div>
                                <Label htmlFor="dataStorageStrategy">Data Storage Strategy</Label>
                                <Textarea
                                  id="dataStorageStrategy"
                                  placeholder="Describe your data storage approach..."
                                  value={answerForm.dataStorageStrategy}
                                  onChange={(e) => setAnswerForm({...answerForm, dataStorageStrategy: e.target.value})}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="estimatedScale">Estimated Scale</Label>
                              <Input
                                id="estimatedScale"
                                placeholder="e.g., 1M users, 100K QPS"
                                value={answerForm.estimatedScale}
                                onChange={(e) => setAnswerForm({...answerForm, estimatedScale: e.target.value})}
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
                        
                        <TabsContent value="guidance" className="space-y-4">
                          {question.systemDesignDetails && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  Common Mistakes to Avoid
                                </h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {question.systemDesignDetails.commonMistakes.map((mistake, index) => (
                                    <li key={index}>{mistake}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Follow-up Questions</h4>
                                <ul className="list-disc list-inside text-sm space-y-1">
                                  {question.systemDesignDetails.followUpQuestions.map((followUp, index) => (
                                    <li key={index}>{followUp}</li>
                                  ))}
                                </ul>
                              </div>
                              
                              {question.systemDesignDetails.resources.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <ExternalLink className="h-4 w-4" />
                                    Study Resources
                                  </h4>
                                  <ul className="space-y-1">
                                    {question.systemDesignDetails.resources.map((resource, index) => (
                                      <li key={index}>
                                        <a 
                                          href={resource} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-600 hover:underline"
                                        >
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
