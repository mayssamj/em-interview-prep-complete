
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { questionId, answerText, notes, storyReferences } = await request.json();

    if (!questionId || !answerText?.trim()) {
      return NextResponse.json(
        { error: 'Question ID and answer text are required' },
        { status: 400 }
      );
    }

    // Check if answer already exists
    const existingAnswer = await prisma.answer.findUnique({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId,
        },
      },
    });

    let answer;
    if (existingAnswer) {
      // Update existing answer
      answer = await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          answerText,
          notes,
          storyReferences: storyReferences || [],
        },
      });
    } else {
      // Create new answer
      answer = await prisma.answer.create({
        data: {
          userId: user.id,
          questionId,
          answerText,
          notes,
          storyReferences: storyReferences || [],
        },
      });

      // Update or create progress
      await prisma.progress.upsert({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId,
          },
        },
        update: {
          status: 'completed',
          lastReviewed: new Date(),
        },
        create: {
          userId: user.id,
          questionId,
          status: 'completed',
          lastReviewed: new Date(),
        },
      });
    }

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Answer save error:', error);
    return NextResponse.json(
      { error: 'Failed to save answer' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    if (questionId) {
      // Get specific answer
      const answer = await prisma.answer.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId,
          },
        },
        include: {
          question: true,
        },
      });

      return NextResponse.json(answer);
    } else {
      // Get all answers for user
      const answers = await prisma.answer.findMany({
        where: { userId: user.id },
        include: {
          question: {
            include: {
              company: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json(answers);
    }
  } catch (error) {
    console.error('Answer fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch answers' },
      { status: 500 }
    );
  }
}
