
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)

    const recentViews = await prisma.question_views.findMany({
      where: {
        user_id: user.id
      },
      include: {
        questions: true
      },
      orderBy: {
        viewed_at: 'desc'
      },
      take: 10
    })

    const recentQuestions = recentViews.map(view => ({
      id: view.questions.id,
      questionText: view.questions.question_text,
      category: view.questions.category,
      difficulty: view.questions.difficulty,
      companyId: view.questions.company_id,
      viewedAt: view.viewed_at
    }))

    return NextResponse.json(recentQuestions)
  } catch (error) {
    console.error('Error fetching recent questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent questions' },
      { status: 500 }
    )
  }
}
