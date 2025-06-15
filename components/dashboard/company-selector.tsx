
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  ArrowRight,
  Target,
  Users,
  Lightbulb,
  Grid3X3,
  List,
  Zap
} from 'lucide-react';

const companies = [
  {
    id: 'meta',
    name: 'Meta',
    description: 'Focus on people management, technical leadership, and cultural fit',
    color: 'bg-blue-500',
    highlights: ['Move Fast', 'Long-term Impact', 'Build Awesome Things'],
    questionCount: 18,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    description: 'Leadership Principles-focused behavioral interviews',
    color: 'bg-orange-500',
    highlights: ['Customer Obsession', 'Ownership', 'Deliver Results'],
    questionCount: 16,
  },
  {
    id: 'google',
    name: 'Google',
    description: 'Googleyness, technical depth, and emergent leadership',
    color: 'bg-green-500',
    highlights: ['Googleyness', 'Technical Excellence', 'Innovation'],
    questionCount: 16,
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    description: 'Growth mindset, inclusive leadership, and customer focus',
    color: 'bg-cyan-500',
    highlights: ['Growth Mindset', 'Inclusive Culture', 'Customer Impact'],
    questionCount: 6,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'AI safety, research excellence, and responsible development',
    color: 'bg-purple-500',
    highlights: ['AI Safety', 'Research Leadership', 'Ethical AI'],
    questionCount: 5,
  },
  {
    id: 'netflix',
    name: 'Netflix',
    description: 'High performance culture, innovation, and global scale',
    color: 'bg-red-500',
    highlights: ['High Performance', 'Innovation', 'Global Scale'],
    questionCount: 5,
  },
  {
    id: 'uber',
    name: 'Uber',
    description: 'Marketplace dynamics, global scale, and real-time systems',
    color: 'bg-gray-800',
    highlights: ['Global Markets', 'Real-time Systems', 'Marketplace'],
    questionCount: 4,
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    description: 'Community building, belonging, and trust & safety',
    color: 'bg-pink-500',
    highlights: ['Belonging', 'Community', 'Trust & Safety'],
    questionCount: 4,
  },
  {
    id: 'startups',
    name: 'Startups',
    description: '0-1 building, rapid scaling, and resourceful leadership',
    color: 'bg-emerald-500',
    highlights: ['0-1 Building', 'Rapid Scaling', 'Resourcefulness'],
    questionCount: 5,
  },
];

export function CompanySelector() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem('companyViewMode') as 'grid' | 'list';
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('companyViewMode', mode);
  };

  const handleCompanySelect = (companyId: string) => {
    router.push(`/company/${companyId}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          Choose Your Target Company
        </h2>
        <p className="text-muted-foreground">
          Select a company to access tailored questions, strategies, and preparation materials
        </p>
        
        {/* View Toggle */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('grid')}
          >
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid View
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
          >
            <List className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
        {companies.map((company) => (
          <Card 
            key={company.id} 
            className="card-hover cursor-pointer group"
            onClick={() => handleCompanySelect(company.id)}
          >
            {viewMode === 'grid' ? (
              <>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${company.color}`} />
                      <CardTitle className="text-xl">{company.name}</CardTitle>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardDescription className="text-sm">
                    {company.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {company.highlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{company.questionCount} questions</span>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Start Prep
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-4 h-4 rounded-full ${company.color}`} />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        {company.description}
                      </CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {company.highlights.slice(0, 2).map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                        {company.highlights.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{company.highlights.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      <span>{company.questionCount}</span>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* All Companies Option */}
      <Card className="border-2 border-dashed border-muted-foreground/25 card-hover cursor-pointer group">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg font-medium">
              <Users className="h-5 w-5" />
              View All Questions
            </div>
            <p className="text-sm text-muted-foreground">
              Browse questions across all companies for comprehensive preparation
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push('/question-bank')}
            >
              Browse All Questions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
