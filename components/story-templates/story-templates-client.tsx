
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, BookOpen, Target, CheckCircle, Lightbulb, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

interface StoryTemplatesClientProps {
  userStories: Story[];
  userId: string;
}

export function StoryTemplatesClient({ userStories, userId }: StoryTemplatesClientProps) {
  const [stories, setStories] = useState<Story[]>(userStories);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    situation: '',
    task: '',
    action: '',
    result: '',
    reflection: '',
    tags: '',
    categories: ''
  });

  // Get unique categories for filtering
  const allCategories = [...new Set(stories.flatMap(story => story.categories))].sort();

  // Filter stories
  const filteredStories = stories.filter(story => {
    const matchesSearch = searchQuery === '' || 
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      story.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || story.categories.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      situation: '',
      task: '',
      action: '',
      result: '',
      reflection: '',
      tags: '',
      categories: ''
    });
    setEditingStory(null);
  };

  const openEditDialog = (story: Story) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      reflection: story.reflection || '',
      tags: story.tags.join(', '),
      categories: story.categories.join(', ')
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.situation.trim() || !formData.task.trim() || 
        !formData.action.trim() || !formData.result.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required STAR fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const storyData = {
        title: formData.title.trim(),
        situation: formData.situation.trim(),
        task: formData.task.trim(),
        action: formData.action.trim(),
        result: formData.result.trim(),
        reflection: formData.reflection.trim() || null,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat)
      };

      const url = editingStory ? `/api/stories/${editingStory.id}` : '/api/stories';
      const method = editingStory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storyData),
      });

      if (response.ok) {
        const savedStory = await response.json();
        
        if (editingStory) {
          setStories(stories.map(story => 
            story.id === editingStory.id ? savedStory : story
          ));
          toast({
            title: 'Success',
            description: 'Story updated successfully.',
          });
        } else {
          setStories([savedStory, ...stories]);
          toast({
            title: 'Success',
            description: 'Story created successfully.',
          });
        }
        
        setIsDialogOpen(false);
        resetForm();
      } else {
        throw new Error('Failed to save story');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save story. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) {
      return;
    }

    try {
      const response = await fetch(`/api/stories/${storyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setStories(stories.filter(story => story.id !== storyId));
        toast({
          title: 'Success',
          description: 'Story deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete story');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete story. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const starTemplates = [
    {
      title: "Leadership Challenge",
      categories: ["Leadership", "Team Management"],
      tags: ["conflict resolution", "team building", "decision making"],
      example: {
        situation: "Describe a challenging team situation you faced as a leader",
        task: "What was your responsibility or goal in this situation?",
        action: "What specific actions did you take to address the challenge?",
        result: "What was the outcome? Include metrics if possible."
      }
    },
    {
      title: "Technical Decision",
      categories: ["Technical Leadership", "Architecture"],
      tags: ["system design", "technical debt", "scalability"],
      example: {
        situation: "Describe a complex technical decision you had to make",
        task: "What problem were you trying to solve?",
        action: "How did you evaluate options and make the decision?",
        result: "What was the impact of your decision?"
      }
    },
    {
      title: "Cross-functional Collaboration",
      categories: ["Collaboration", "Communication"],
      tags: ["stakeholder management", "alignment", "influence"],
      example: {
        situation: "Describe a time when you had to work with multiple teams",
        task: "What was the shared goal or challenge?",
        action: "How did you facilitate collaboration and alignment?",
        result: "What was achieved through this collaboration?"
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* STAR Method Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            STAR Method Guide
          </CardTitle>
          <CardDescription>
            Structure your behavioral interview stories using the STAR framework
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                S
              </div>
              <h3 className="font-semibold">Situation</h3>
              <p className="text-sm text-muted-foreground">Set the context and background</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                T
              </div>
              <h3 className="font-semibold">Task</h3>
              <p className="text-sm text-muted-foreground">Describe your responsibility</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                A
              </div>
              <h3 className="font-semibold">Action</h3>
              <p className="text-sm text-muted-foreground">Explain what you did</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold">
                R
              </div>
              <h3 className="font-semibold">Result</h3>
              <p className="text-sm text-muted-foreground">Share the outcome and impact</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Story Templates
          </CardTitle>
          <CardDescription>
            Use these templates to get started with common EM interview scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {starTemplates.map((template, index) => (
              <Card key={index} className="border-dashed">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.map((cat, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm space-y-1">
                    <p><strong>S:</strong> {template.example.situation}</p>
                    <p><strong>T:</strong> {template.example.task}</p>
                    <p><strong>A:</strong> {template.example.action}</p>
                    <p><strong>R:</strong> {template.example.result}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      setFormData({
                        title: template.title,
                        situation: '',
                        task: '',
                        action: '',
                        result: '',
                        reflection: '',
                        tags: template.tags.join(', '),
                        categories: template.categories.join(', ')
                      });
                      setIsDialogOpen(true);
                    }}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Stories ({stories.length})
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingStory ? 'Edit Story' : 'Create New Story'}
                  </DialogTitle>
                  <DialogDescription>
                    Use the STAR method to structure your behavioral interview story
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Story Title *</label>
                    <Input
                      placeholder="e.g., Led team through major system migration"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Categories</label>
                      <Input
                        placeholder="e.g., Leadership, Technical"
                        value={formData.categories}
                        onChange={(e) => setFormData({...formData, categories: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Tags</label>
                      <Input
                        placeholder="e.g., team building, conflict resolution"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Situation *</label>
                    <Textarea
                      placeholder="Describe the context and background of the situation..."
                      value={formData.situation}
                      onChange={(e) => setFormData({...formData, situation: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Task *</label>
                    <Textarea
                      placeholder="What was your responsibility or what needed to be accomplished?"
                      value={formData.task}
                      onChange={(e) => setFormData({...formData, task: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Action *</label>
                    <Textarea
                      placeholder="Describe the specific actions you took to address the situation..."
                      value={formData.action}
                      onChange={(e) => setFormData({...formData, action: e.target.value})}
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Result *</label>
                    <Textarea
                      placeholder="What was the outcome? Include metrics and impact where possible..."
                      value={formData.result}
                      onChange={(e) => setFormData({...formData, result: e.target.value})}
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Reflection (Optional)</label>
                    <Textarea
                      placeholder="What did you learn? What would you do differently?"
                      value={formData.reflection}
                      onChange={(e) => setFormData({...formData, reflection: e.target.value})}
                      rows={2}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? 'Saving...' : (editingStory ? 'Update Story' : 'Create Story')}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {allCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stories List */}
          <div className="space-y-4">
            {filteredStories.map((story) => (
              <Card key={story.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{story.title}</CardTitle>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {story.categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                        {story.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(story.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Situation</h4>
                    <p className="text-sm text-muted-foreground">{story.situation}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Task</h4>
                    <p className="text-sm text-muted-foreground">{story.task}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Action</h4>
                    <p className="text-sm text-muted-foreground">{story.action}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Result</h4>
                    <p className="text-sm text-muted-foreground">{story.result}</p>
                  </div>
                  {story.reflection && (
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Reflection</h4>
                      <p className="text-sm text-muted-foreground">{story.reflection}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStories.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {stories.length === 0 
                  ? "No stories yet. Create your first STAR story to get started!"
                  : "No stories found matching your search criteria."
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
