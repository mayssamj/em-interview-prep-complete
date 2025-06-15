
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MessageSquare, 
  Search, 
  Calendar,
  Edit,
  Eye,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

interface Answer {
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
}

interface CompanyAnswersProps {
  answers: Answer[];
  companyName: string;
  userId: string;
}

export function CompanyAnswers({ answers, companyName, userId }: CompanyAnswersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  // Filter answers based on search and category
  const filteredAnswers = answers.filter(answer => {
    const matchesSearch = answer.question.questionText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         answer.answerText.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (answer.notes && answer.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           answer.question.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from all answers
  const allCategories = Array.from(new Set(answers.map(answer => answer.question.category)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" />
            My {companyName} Answers
          </h2>
          <p className="text-muted-foreground">
            {filteredAnswers.length} answered questions for {companyName} interviews
          </p>
        </div>
        <Button onClick={() => router.push(`/company/${companyName.toLowerCase()}?tab=questions`)}>
          <HelpCircle className="h-4 w-4 mr-2" />
          Answer More Questions
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions and answers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All
              </Button>
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="hidden sm:inline-flex"
                >
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answers List */}
      {filteredAnswers.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {answers.length === 0 ? 'No answers yet' : 'No answers match your search'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {answers.length === 0 
                ? `Start answering ${companyName} interview questions to build your preparation`
                : 'Try adjusting your search criteria'
              }
            </p>
            <Button onClick={() => router.push(`/company/${companyName.toLowerCase()}?tab=questions`)}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Browse Questions
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAnswers.map((answer) => (
            <Card key={answer.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight mb-2">
                      {answer.question.questionText}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(answer.question.category)}>
                        {answer.question.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                      <Badge className={getDifficultyColor(answer.question.difficulty)}>
                        {answer.question.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
                        <Calendar className="h-4 w-4" />
                        {formatDate(answer.createdAt)}
                      </div>
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Your Answer
                  </h4>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
                      {answer.answerText}
                    </p>
                  </div>
                </div>
                
                {answer.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-2">
                        {answer.notes}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/answers/${answer.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Full Answer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/answers/${answer.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit Answer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
