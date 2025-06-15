
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, CheckCircle, Circle, MessageSquare, Tag, Clock, Star } from 'lucide-react';

interface Question {
  id: string;
  questionText: string;
  category: string;
  difficulty: string;
  tags: string[];
  isCritical: boolean;
  usageCount: number;
  company: {
    id: string;
    name: string;
  };
}

interface RecentQuestion {
  id: string;
  questionText: string;
  company: {
    name: string;
  };
  viewedAt: string;
}

interface QuestionBankClientProps {
  questions: Question[];
  answeredQuestionIds: Set<string>;
  userId: string;
}

export function QuestionBankClient({ questions, answeredQuestionIds, userId }: QuestionBankClientProps) {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [showAnswered, setShowAnswered] = useState<string>('all');
  const [showCritical, setShowCritical] = useState<string>('all');
  const [answerText, setAnswerText] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentQuestions, setRecentQuestions] = useState<RecentQuestion[]>([]);
  const { toast } = useToast();

  // Handle URL parameters
  useEffect(() => {
    const filter = searchParams.get('filter');
    if (filter === 'critical') {
      setShowCritical('critical');
    }
  }, [searchParams]);

  // Fetch recent questions
  useEffect(() => {
    const fetchRecentQuestions = async () => {
      try {
        const response = await fetch('/api/questions/recent');
        if (response.ok) {
          const data = await response.json();
          setRecentQuestions(data);
        }
      } catch (error) {
        console.error('Failed to fetch recent questions:', error);
      }
    };

    fetchRecentQuestions();
  }, []);

  // Get unique values for filters
  const companies = [...new Set(questions.map(q => q.company.name))].sort();
  const categories = [...new Set(questions.map(q => q.category))].sort();
  const difficulties = [...new Set(questions.map(q => q.difficulty))].sort();

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === '' || 
      question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCompany = selectedCompany === 'all' || question.company.name === selectedCompany;
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    
    const isAnswered = answeredQuestionIds.has(question.id);
    const matchesAnswered = showAnswered === 'all' || 
      (showAnswered === 'answered' && isAnswered) ||
      (showAnswered === 'unanswered' && !isAnswered);

    const matchesCritical = showCritical === 'all' || 
      (showCritical === 'critical' && question.isCritical);

    return matchesSearch && matchesCompany && matchesCategory && matchesDifficulty && matchesAnswered && matchesCritical;
  });

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
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const trackQuestionView = async (questionId: string) => {
    try {
      await fetch('/api/questions/track-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId }),
      });
    } catch (error) {
      console.error('Failed to track question view:', error);
    }
  };

  const handleSubmitAnswer = async (questionId: string) => {
    if (!answerText.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an answer.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          answerText: answerText.trim(),
          notes: notes.trim() || null,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Your answer has been saved.',
        });
        setAnswerText('');
        setNotes('');
        // Track question view
        await trackQuestionView(questionId);
        // Refresh the page to update answered status
        window.location.reload();
      } else {
        throw new Error('Failed to save answer');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recent Questions */}
      {recentQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Questions
            </CardTitle>
            <CardDescription>
              Questions you've recently viewed or answered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentQuestions.slice(0, 5).map((question) => (
                <div key={question.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm line-clamp-1">{question.questionText}</p>
                    <p className="text-xs text-muted-foreground">{question.company.name}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Scroll to question in the list
                      const questionElement = document.getElementById(`question-${question.id}`);
                      if (questionElement) {
                        questionElement.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search questions or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={showAnswered} onValueChange={setShowAnswered}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="answered">Answered</SelectItem>
                <SelectItem value="unanswered">Unanswered</SelectItem>
              </SelectContent>
            </Select>

            <Select value={showCritical} onValueChange={setShowCritical}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Questions</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredQuestions.length} of {questions.length} questions
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="grid gap-4">
        {filteredQuestions.map((question) => {
          const isAnswered = answeredQuestionIds.has(question.id);
          
          return (
            <Card key={question.id} id={`question-${question.id}`} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <div className={`w-3 h-3 rounded-full ${getCompanyColor(question.company.name)}`} />
                      <span className="text-sm font-medium">{question.company.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.category}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </Badge>
                      {question.isCritical && (
                        <Badge variant="default" className="text-xs bg-red-500">
                          <Star className="h-3 w-3 mr-1" />
                          Critical
                        </Badge>
                      )}
                      {isAnswered && (
                        <Badge variant="default" className="text-xs bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Answered
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg leading-relaxed">
                      {question.questionText}
                    </CardTitle>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant={isAnswered ? "outline" : "default"} 
                        size="sm"
                        onClick={() => {
                          setAnswerText('');
                          setNotes('');
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {isAnswered ? 'Update Answer' : 'Answer'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Answer Question</DialogTitle>
                        <DialogDescription>
                          {question.questionText}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Your Answer</label>
                          <Textarea
                            placeholder="Provide your detailed answer using the STAR method (Situation, Task, Action, Result)..."
                            value={answerText}
                            onChange={(e) => setAnswerText(e.target.value)}
                            rows={8}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                          <Textarea
                            placeholder="Add any additional notes, key points to remember, or areas for improvement..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                          />
                        </div>
                        <Button 
                          onClick={() => handleSubmitAnswer(question.id)}
                          disabled={isSubmitting}
                          className="w-full"
                        >
                          {isSubmitting ? 'Saving...' : 'Save Answer'}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              
              {question.tags.length > 0 && (
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    {question.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No questions found matching your criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
