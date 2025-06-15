
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { questionId } = await request.json();

    if (!questionId) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }

    // Create a new question view record
    await prisma.questionView.create({
      data: {
        userId: user.id,
        questionId: questionId
      }
    });

    // Update the question's usage count
    await prisma.question.update({
      where: { id: questionId },
      data: {
        usageCount: {
          increment: 1
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to track question view:', error);
    return NextResponse.json(
      { error: 'Failed to track question view' },
      { status: 500 }
    );
  }
}
