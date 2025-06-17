
export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { NextRequest } from 'next/server';
import { Header } from '@/components/layout/header';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  
  if (!token) {
    redirect('/login');
  }

  // Create a mock request to use with getSession
  const mockRequest = {
    cookies: {
      get: (name: string) => ({ value: token })
    }
  } as NextRequest;

  const user = await getSession(mockRequest);
  
  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} />
      <DashboardClient user={user} />
    </div>
  );
}
