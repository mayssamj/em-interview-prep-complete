
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  X, 
  Plus,
  Target,
  FileText,
  Lightbulb,
  TrendingUp
} from 'lucide-react';

interface StoryFormProps {
  userId: string;
  initialData?: {
    id?: string;
    title: string;
    situation: string;
    task: string;
    action: string;
    result: string;
    reflection?: string;
    tags: string[];
    categories: string[];
  };
  isEditing?: boolean;
}

export function StoryForm({ userId, initialData, isEditing = false }: StoryFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    situation: initialData?.situation || '',
    task: initialData?.task || '',
    action: initialData?.action || '',
    result: initialData?.result || '',
    reflection: initialData?.reflection || '',
    tags: initialData?.tags || [],
    categories: initialData?.categories || [],
  });
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const availableCategories = [
    'leadership',
    'conflict_resolution',
    'team_building',
    'technical_decisions',
    'ambiguity',
    'communication'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.situation.trim() || 
        !formData.task.trim() || !formData.action.trim() || !formData.result.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required STAR fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const url = isEditing ? `/api/stories/${initialData?.id}` : '/api/stories';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} story`);
      }

      const story = await response.json();

      toast({
        title: `Story ${isEditing ? 'updated' : 'created'}!`,
        description: `Your story "${formData.title}" has been ${isEditing ? 'updated' : 'saved'} successfully.`,
      });

      router.push(`/stories/${story.id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} story. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const starSections = [
    {
      key: 'situation',
      title: 'Situation',
      icon: FileText,
      color: 'text-blue-600',
      placeholder: 'Describe the context and background. Where and when did this take place? What was the environment or circumstances?',
      description: 'Set the scene with specific details about the context'
    },
    {
      key: 'task',
      title: 'Task',
      icon: Target,
      color: 'text-green-600',
      placeholder: 'Explain what needed to be accomplished. What was your responsibility or goal? What challenge did you face?',
      description: 'Define the objective or challenge you needed to address'
    },
    {
      key: 'action',
      title: 'Action',
      icon: Lightbulb,
      color: 'text-orange-600',
      placeholder: 'Detail the specific steps you took. Focus on YOUR actions and decisions. What did you do and why?',
      description: 'Describe your specific actions and decision-making process'
    },
    {
      key: 'result',
      title: 'Result',
      icon: TrendingUp,
      color: 'text-purple-600',
      placeholder: 'Share the outcomes and impact. Use metrics when possible. What did you learn or how did you grow?',
      description: 'Quantify the outcomes and highlight lessons learned'
    }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Card>
        <CardHeader>
          <CardTitle>Story Title</CardTitle>
          <CardDescription>
            Give your story a memorable and descriptive title
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="e.g., Leading Team Through Major Cloud Migration"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </CardContent>
      </Card>

      {/* STAR Sections */}
      {starSections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.key}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${section.color}`} />
                {section.title}
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={section.placeholder}
                value={formData[section.key as keyof typeof formData] as string}
                onChange={(e) => handleInputChange(section.key, e.target.value)}
                className="min-h-32"
                required={section.key !== 'reflection'}
              />
            </CardContent>
          </Card>
        );
      })}

      {/* Reflection (Optional) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Reflection (Optional)
          </CardTitle>
          <CardDescription>
            What would you do differently? What additional insights did you gain?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Reflect on what you learned, what you might do differently, or additional insights gained from this experience..."
            value={formData.reflection}
            onChange={(e) => handleInputChange('reflection', e.target.value)}
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Select the interview categories this story addresses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {availableCategories.map(category => (
              <Badge
                key={category}
                variant={formData.categories.includes(category) ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to help organize and search your stories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="cursor-pointer">
                  {tag}
                  <X 
                    className="h-3 w-3 ml-1" 
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading 
            ? `${isEditing ? 'Updating' : 'Creating'}...` 
            : `${isEditing ? 'Update' : 'Create'} Story`
          }
        </Button>
      </div>
    </form>
  );
}
