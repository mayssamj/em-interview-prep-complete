
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    const answer = await prisma.answer.findUnique({
      where: {
        user_id_question_id: {
          user_id: user.id,
          question_id: questionId
        }
      },
      include: {
        questions: true,
        stories: true
      }
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Answer fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { questionId, answerText, storyReferences, notes } = await request.json();

    if (!questionId || !answerText) {
      return NextResponse.json(
        { error: 'Question ID and answer text are required' },
        { status: 400 }
      );
    }

    // Verify question exists
    const question = await prisma.question.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const answer = await prisma.answer.upsert({
      where: {
        user_id_question_id: {
          user_id: user.id,
          question_id: questionId
        }
      },
      update: {
        answer_text: answerText,
        story_references: storyReferences || [],
        notes: notes || null,
        updated_at: new Date()
      },
      create: {
        id: uuidv4(),
        user_id: user.id,
        question_id: questionId,
        answer_text: answerText,
        story_references: storyReferences || [],
        notes: notes || null,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Update or create progress tracking
    await prisma.progress.upsert({
      where: {
        user_id_question_id: {
          user_id: user.id,
          question_id: questionId
        }
      },
      update: {
        status: 'answered',
        last_reviewed: new Date(),
        updated_at: new Date()
      },
      create: {
        id: uuidv4(),
        user_id: user.id,
        question_id: questionId,
        status: 'answered',
        last_reviewed: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Answer saved successfully',
      answer 
    });
  } catch (error) {
    console.error('Answer save error:', error);
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    );
  }
}
