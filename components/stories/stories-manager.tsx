
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar,
  Tag,
  Edit,
  Eye,
  Trash2,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface StoriesManagerProps {
  stories: Story[];
  userId: string;
}

export function StoriesManager({ stories: initialStories, userId }: StoriesManagerProps) {
  const [stories, setStories] = useState(initialStories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();
  const { toast } = useToast();

  // Filter and sort stories
  const filteredStories = stories
    .filter(story => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                           story.situation.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             story.categories.includes(selectedCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Get unique categories and tags
  const allCategories = Array.from(new Set(stories.flatMap(story => story.categories)));
  const allTags = Array.from(new Set(stories.flatMap(story => story.tags)));

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      setStories(prev => prev.filter(story => story.id !== storyId));
      toast({
        title: 'Story deleted',
        description: 'The story has been successfully deleted.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete story. Please try again.',
        variant: 'destructive',
      });
    }
  };

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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            My Stories
          </h1>
          <p className="text-muted-foreground">
            {filteredStories.length} of {stories.length} STAR format stories
          </p>
        </div>
        <Button onClick={() => router.push('/stories/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Story
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
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
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteStory(story.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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

      {/* Quick Stats */}
      {stories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Story Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stories.length}</div>
                <div className="text-sm text-muted-foreground">Total Stories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{allCategories.length}</div>
                <div className="text-sm text-muted-foreground">Categories Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{allTags.length}</div>
                <div className="text-sm text-muted-foreground">Unique Tags</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
