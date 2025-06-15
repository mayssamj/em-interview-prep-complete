
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Tag,
  Edit,
  Eye,
  Filter
} from 'lucide-react';

interface Story {
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
}

interface CompanyStoriesProps {
  stories: Story[];
  companyName: string;
  userId: string;
}

export function CompanyStories({ stories, companyName, userId }: CompanyStoriesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  // Filter stories based on search and category
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         story.situation.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
                           story.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories from all stories
  const allCategories = Array.from(new Set(stories.flatMap(story => story.categories)));

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
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
            <BookOpen className="h-6 w-6 text-primary" />
            My Stories for {companyName}
          </h2>
          <p className="text-muted-foreground">
            {filteredStories.length} STAR format stories ready for interviews
          </p>
        </div>
        <Button onClick={() => router.push('/stories/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Story
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
                  placeholder="Search stories by title, tags, or content..."
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

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">
              {stories.length === 0 ? 'No stories yet' : 'No stories match your search'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {stories.length === 0 
                ? 'Create your first STAR format story to get started with interview preparation'
                : 'Try adjusting your search criteria or create a new story'
              }
            </p>
            <Button onClick={() => router.push('/stories/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Story
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <Card key={story.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight line-clamp-2">
                    {story.title}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/stories/${story.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => router.push(`/stories/${story.id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {formatDate(story.createdAt)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <CardDescription className="line-clamp-3">
                  <strong>Situation:</strong> {story.situation}
                </CardDescription>
                
                {/* Categories */}
                {story.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.categories.map(category => (
                      <Badge key={category} className={getCategoryColor(category)}>
                        {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Tags */}
                {story.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {story.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {story.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{story.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/stories/${story.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/stories/${story.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
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
