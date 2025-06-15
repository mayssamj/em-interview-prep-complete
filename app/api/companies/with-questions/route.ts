
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const companies = await prisma.company.findMany({
      include: {
        questions: {
          orderBy: [
            { isCritical: 'desc' },
            { usageCount: 'desc' },
            { createdAt: 'desc' }
          ],
          take: 10 // Get top 10 questions per company (mix of behavioral and system design)
        }
      },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies with questions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
