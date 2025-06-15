
import { prisma } from '@/lib/db';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { CompanyValuesClient } from '@/components/company-values/company-values-client';

// Mock user for testing
const mockUser = {
  id: "cmbx5b4vc0000u41ugdwm5uxh",
  username: "admin",
  isAdmin: true
};

export default async function CompanyValuesPage() {
  // Get all companies with their values and criteria
  const companies = await prisma.company.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header user={mockUser} />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Company Values</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Understand the core values and evaluation criteria for top tech companies
            </p>
          </div>

          {/* Company Values Content */}
          <CompanyValuesClient companies={companies} />
        </div>
      </main>
    </div>
  );
}
