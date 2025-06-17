
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Try to get user, but don't fail if not authenticated
    let user;
    try {
      user = await requireAuth(request);
    } catch (authError) {
      console.log('User not authenticated for recent questions, returning empty array');
      return NextResponse.json([]);
    }

    const recentViews = await prisma.question_views.findMany({
      where: {
        user_id: user.id
      },
      include: {
        questions: {
          include: {
            companies: true
          }
        }
      },
      orderBy: {
        viewed_at: 'desc'
      },
      take: 10
    })

    const recentQuestions = recentViews.map(view => ({
      id: view.questions.id,
      question_text: view.questions.question_text,
      category: view.questions.category,
      difficulty: view.questions.difficulty,
      companies: view.questions.companies,
      viewed_at: view.viewed_at
    }))

    return NextResponse.json(recentQuestions)
  } catch (error) {
    console.error('Error fetching recent questions:', error)
    return NextResponse.json([], { status: 200 })
  }
}
