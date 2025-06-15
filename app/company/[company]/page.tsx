
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { CompanyTabs } from '@/components/company/company-tabs';
import { notFound } from 'next/navigation';

// Mock user for testing
const mockUser = {
  id: "cmbx5b4vc0000u41ugdwm5uxh",
  username: "admin",
  isAdmin: true
};

interface CompanyPageProps {
  params: {
    company: string;
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {

  const { company: companySlug } = params;
  
  // Validate company
  const validCompanies = [
    'meta', 'amazon', 'google', 'microsoft', 'openai', 'anthropic', 
    'netflix', 'uber', 'tiktok', 'startups', 'snowflake', 'scale-ai', 
    'linkedin', 'airbnb', 'reddit'
  ];
  if (!validCompanies.includes(companySlug)) {
    notFound();
  }

  // Get company data
  const companyNameMap: Record<string, string> = {
    'meta': 'Meta',
    'amazon': 'Amazon',
    'google': 'Google',
    'microsoft': 'Microsoft',
    'openai': 'OpenAI',
    'anthropic': 'Anthropic',
    'netflix': 'Netflix',
    'uber': 'Uber',
    'tiktok': 'TikTok',
    'startups': 'Startups & Scale-ups',
    'snowflake': 'Snowflake',
    'scale-ai': 'Scale AI',
    'linkedin': 'LinkedIn',
    'airbnb': 'Airbnb',
    'reddit': 'Reddit'
  };
  
  const companyName = companyNameMap[companySlug] || companySlug.charAt(0).toUpperCase() + companySlug.slice(1);
  const company = await prisma.company.findUnique({
    where: { name: companyName },
    include: {
      questions: {
        orderBy: [
          { category: 'asc' },
          { difficulty: 'asc' }
        ]
      }
    }
  });

  if (!company) {
    notFound();
  }

  // Get user's stories and answers for this company
  const userStories = await prisma.story.findMany({
    where: { userId: mockUser.id },
    orderBy: { createdAt: 'desc' }
  });

  const userAnswers = await prisma.answer.findMany({
    where: { 
      userId: mockUser.id,
      question: {
        companyId: company.id
      }
    },
    include: {
      question: true
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Company Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className={`w-4 h-4 rounded-full ${
                companySlug === 'meta' ? 'bg-blue-500' :
                companySlug === 'amazon' ? 'bg-orange-500' :
                companySlug === 'google' ? 'bg-green-500' :
                companySlug === 'microsoft' ? 'bg-cyan-500' :
                companySlug === 'openai' ? 'bg-purple-500' :
                companySlug === 'netflix' ? 'bg-red-500' :
                companySlug === 'uber' ? 'bg-gray-800' :
                companySlug === 'airbnb' ? 'bg-pink-500' :
                companySlug === 'startups' ? 'bg-emerald-500' :
                'bg-indigo-500'
              }`} />
              <h1 className="text-4xl font-bold tracking-tight">
                {company.name} Interview Preparation
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive preparation materials, questions, and strategies for {company.name} Engineering Manager interviews
            </p>
          </div>

          {/* Company Tabs */}
          <CompanyTabs 
            company={company}
            userStories={userStories}
            userAnswers={userAnswers}
            userId={mockUser.id}
          />
        </div>
      </main>
    </div>
  );
}
