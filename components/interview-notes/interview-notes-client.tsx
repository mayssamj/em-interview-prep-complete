
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Calendar, 
  Building, 
  User, 
  Edit, 
  Trash2, 
  Save,
  X,
  FileText,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

interface InterviewNote {
  id: string;
  company: string;
  interviewerName?: string;
  interviewerRole?: string;
  questionsAsked: string[];
  takeaways?: string;
  followUpThoughts?: string;
  interviewDate: string;
  createdAt: string;
  updatedAt: string;
}

interface InterviewNotesClientProps {
  userId: string;
}

export function InterviewNotesClient({ userId }: InterviewNotesClientProps) {
  const [notes, setNotes] = useState<InterviewNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    interviewerName: '',
    interviewerRole: '',
    questionsAsked: [''],
    takeaways: '',
    followUpThoughts: '',
    interviewDate: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const companies = [
    'Meta', 'Amazon', 'Google', 'Microsoft', 'OpenAI', 'Anthropic',
    'Netflix', 'Uber', 'Airbnb', 'TikTok', 'LinkedIn', 'Snowflake',
    'Scale AI', 'Reddit', 'Startups & Scale-ups', 'Other'
  ];

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/interview-notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch interview notes',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.interviewDate) {
      toast({
        title: 'Error',
        description: 'Company and interview date are required',
        variant: 'destructive'
      });
      return;
    }

    const filteredQuestions = formData.questionsAsked.filter(q => q.trim() !== '');
    
    try {
      const url = editingId ? `/api/interview-notes/${editingId}` : '/api/interview-notes';
      const method = editingId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          questionsAsked: filteredQuestions
        })
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Interview note ${editingId ? 'updated' : 'created'} successfully`
        });
        resetForm();
        fetchNotes();
      } else {
        throw new Error('Failed to save note');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save interview note',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (note: InterviewNote) => {
    setFormData({
      company: note.company,
      interviewerName: note.interviewerName || '',
      interviewerRole: note.interviewerRole || '',
      questionsAsked: note.questionsAsked.length > 0 ? note.questionsAsked : [''],
      takeaways: note.takeaways || '',
      followUpThoughts: note.followUpThoughts || '',
      interviewDate: note.interviewDate.split('T')[0]
    });
    setEditingId(note.id);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this interview note?')) return;

    try {
      const response = await fetch(`/api/interview-notes/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Interview note deleted successfully'
        });
        fetchNotes();
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete interview note',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      interviewerName: '',
      interviewerRole: '',
      questionsAsked: [''],
      takeaways: '',
      followUpThoughts: '',
      interviewDate: new Date().toISOString().split('T')[0]
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const addQuestionField = () => {
    setFormData(prev => ({
      ...prev,
      questionsAsked: [...prev.questionsAsked, '']
    }));
  };

  const updateQuestion = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked.map((q, i) => i === index ? value : q)
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questionsAsked: prev.questionsAsked.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading interview notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Interview Notes</h2>
          <p className="text-muted-foreground">Track your interview experiences and learnings</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {editingId ? 'Edit Interview Note' : 'Add New Interview Note'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Select value={formData.company} onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(company => (
                        <SelectItem key={company} value={company}>{company}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewDate">Interview Date *</Label>
                  <Input
                    id="interviewDate"
                    type="date"
                    value={formData.interviewDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewerName">Interviewer Name</Label>
                  <Input
                    id="interviewerName"
                    value={formData.interviewerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewerName: e.target.value }))}
                    placeholder="e.g., John Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewerRole">Interviewer Role</Label>
                  <Input
                    id="interviewerRole"
                    value={formData.interviewerRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, interviewerRole: e.target.value }))}
                    placeholder="e.g., Senior Engineering Manager"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Questions Asked</Label>
                {formData.questionsAsked.map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      placeholder="Enter question asked during interview"
                    />
                    {formData.questionsAsked.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeQuestion(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addQuestionField} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="takeaways">Key Takeaways</Label>
                <Textarea
                  id="takeaways"
                  value={formData.takeaways}
                  onChange={(e) => setFormData(prev => ({ ...prev, takeaways: e.target.value }))}
                  placeholder="What did you learn from this interview? What went well or could be improved?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUpThoughts">Follow-up Thoughts</Label>
                <Textarea
                  id="followUpThoughts"
                  value={formData.followUpThoughts}
                  onChange={(e) => setFormData(prev => ({ ...prev, followUpThoughts: e.target.value }))}
                  placeholder="Any additional thoughts, action items, or areas to focus on for future interviews?"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {editingId ? 'Update Note' : 'Save Note'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No interview notes yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Start tracking your interview experiences to improve your preparation
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{note.company}</Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(note.interviewDate), 'MMM dd, yyyy')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(note)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(note.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {(note.interviewerName || note.interviewerRole) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {note.interviewerName && <span>{note.interviewerName}</span>}
                    {note.interviewerName && note.interviewerRole && <span>•</span>}
                    {note.interviewerRole && <span>{note.interviewerRole}</span>}
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {note.questionsAsked.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Questions Asked:</h4>
                    <ul className="space-y-1">
                      {note.questionsAsked.map((question, index) => (
                        <li key={index} className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {note.takeaways && (
                  <div>
                    <h4 className="font-medium mb-2">Key Takeaways:</h4>
                    <p className="text-sm text-muted-foreground">{note.takeaways}</p>
                  </div>
                )}

                {note.followUpThoughts && (
                  <div>
                    <h4 className="font-medium mb-2">Follow-up Thoughts:</h4>
                    <p className="text-sm text-muted-foreground">{note.followUpThoughts}</p>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <Clock className="h-3 w-3" />
                  Created {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                  {note.updatedAt !== note.createdAt && (
                    <span> • Updated {format(new Date(note.updatedAt), 'MMM dd, yyyy')}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
