
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  HelpCircle, 
  Search, 
  Filter,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  BookOpen,
  Save,
  X
} from 'lucide-react';

interface Question {
  id: string;
  category: string;
  questionText: string;
  difficulty: string;
  tags: string[];
}

interface QuestionBankProps {
  questions: Question[];
  companyName: string;
  userId: string;
}

export function QuestionBank({ questions, companyName, userId }: QuestionBankProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  // Get unique categories and difficulties
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const difficulties = Array.from(new Set(questions.map(q => q.difficulty)));

  // Filter questions
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || question.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Group questions by category
  const questionsByCategory = filteredQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleSaveAnswer = async (questionId: string) => {
    const answerText = answers[questionId];
    const noteText = notes[questionId];

    if (!answerText?.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide an answer before saving.',
        variant: 'destructive',
      });
      return;
    }

    setSavingStates(prev => ({ ...prev, [questionId]: true }));

    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          answerText,
          notes: noteText || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save answer');
      }

      toast({
        title: 'Answer saved!',
        description: 'Your answer has been saved successfully.',
      });

      // Clear the form
      setAnswers(prev => ({ ...prev, [questionId]: '' }));
      setNotes(prev => ({ ...prev, [questionId]: '' }));
      
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save answer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSavingStates(prev => ({ ...prev, [questionId]: false }));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      leadership: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      conflict_resolution: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      team_building: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      technical_decisions: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      ambiguity: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      communication: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          {companyName} Question Bank
        </h2>
        <p className="text-muted-foreground">
          {filteredQuestions.length} interview questions organized by category
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filter Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
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

      {/* Questions by Category */}
      <div className="space-y-6">
        {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(category)}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <span className="text-lg">
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {categoryQuestions.length} questions
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryQuestions.map((question) => (
                <Card key={question.id} className="border-l-4 border-l-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-base leading-relaxed">
                          {question.questionText}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          {question.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleQuestion(question.id)}
                        className="flex-shrink-0"
                      >
                        {expandedQuestions.has(question.id) ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Answer
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {expandedQuestions.has(question.id) && (
                    <CardContent className="pt-0 border-t">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Your Answer (STAR Format Recommended)
                          </label>
                          <Textarea
                            placeholder="Situation: Describe the context and background...&#10;Task: Explain what needed to be accomplished...&#10;Action: Detail the specific actions you took...&#10;Result: Share the outcomes and what you learned..."
                            value={answers[question.id] || ''}
                            onChange={(e) => setAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                            className="min-h-32"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            Notes (Optional)
                          </label>
                          <Textarea
                            placeholder="Add any additional notes, key points to remember, or follow-up thoughts..."
                            value={notes[question.id] || ''}
                            onChange={(e) => setNotes(prev => ({ ...prev, [question.id]: e.target.value }))}
                            className="min-h-20"
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setAnswers(prev => ({ ...prev, [question.id]: '' }));
                              setNotes(prev => ({ ...prev, [question.id]: '' }));
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Clear
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveAnswer(question.id)}
                            disabled={savingStates[question.id]}
                          >
                            <Save className="h-4 w-4 mr-1" />
                            {savingStates[question.id] ? 'Saving...' : 'Save Answer'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredQuestions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No questions found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
