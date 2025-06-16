
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    const { questionId } = await request.json()

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Track the view
    await prisma.question_views.create({
      data: {
        id: uuidv4(),
        user_id: user.id,
        question_id: questionId
      }
    })

    // Update question usage count
    await prisma.questions.update({
      where: { id: questionId },
      data: {
        usage_count: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ message: 'View tracked successfully' })
  } catch (error) {
    console.error('Error tracking question view:', error)
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    )
  }
}
