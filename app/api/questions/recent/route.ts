
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get recent question views for the user
    const recentViews = await prisma.questionView.findMany({
      where: {
        userId: user.id
      },
      include: {
        question: {
          include: {
            company: true
          }
        }
      },
      orderBy: {
        viewedAt: 'desc'
      },
      take: 10
    });

    // Transform the data
    const recentQuestions = recentViews.map(view => ({
      id: view.question.id,
      questionText: view.question.questionText,
      company: {
        name: view.question.company?.name || 'General'
      },
      viewedAt: view.viewedAt.toISOString()
    }));

    return NextResponse.json(recentQuestions);
  } catch (error) {
    console.error('Failed to fetch recent questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent questions' },
      { status: 500 }
    );
  }
}
