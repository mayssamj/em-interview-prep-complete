
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('questionId');

    const where: any = {
      userId: user.id
    };

    if (questionId) {
      where.questionId = questionId;
    }

    const answers = await prisma.systemDesignAnswer.findMany({
      where,
      include: {
        question: {
          include: {
            company: true,
            systemDesignDetails: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Error fetching system design answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design answers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      questionId,
      highLevelDesign,
      detailedComponents,
      scalabilityApproach,
      dataStorageStrategy,
      tradeoffsDiscussed,
      frameworksUsed,
      estimatedScale,
      notes
    } = body;

    const answer = await prisma.systemDesignAnswer.upsert({
      where: {
        userId_questionId: {
          userId: user.id,
          questionId
        }
      },
      update: {
        highLevelDesign,
        detailedComponents,
        scalabilityApproach,
        dataStorageStrategy,
        tradeoffsDiscussed: tradeoffsDiscussed || [],
        frameworksUsed: frameworksUsed || [],
        estimatedScale,
        notes
      },
      create: {
        userId: user.id,
        questionId,
        highLevelDesign,
        detailedComponents,
        scalabilityApproach,
        dataStorageStrategy,
        tradeoffsDiscussed: tradeoffsDiscussed || [],
        frameworksUsed: frameworksUsed || [],
        estimatedScale,
        notes
      },
      include: {
        question: {
          include: {
            company: true,
            systemDesignDetails: true
          }
        }
      }
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.error('Error saving system design answer:', error);
    return NextResponse.json(
      { error: 'Failed to save system design answer' },
      { status: 500 }
    );
  }
}
