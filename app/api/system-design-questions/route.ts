
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company = searchParams.get('company');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const critical = searchParams.get('critical');

    const where: any = {
      questionType: 'system_design'
    };

    if (company && company !== 'all') {
      where.company = {
        name: {
          contains: company,
          mode: 'insensitive'
        }
      };
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (critical === 'true') {
      where.isCritical = true;
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        company: true,
        systemDesignDetails: true,
        _count: {
          select: {
            answers: true,
            systemDesignAnswers: true
          }
        }
      },
      orderBy: [
        { isCritical: 'desc' },
        { usageCount: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching system design questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design questions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyId,
      category,
      questionText,
      difficulty,
      tags,
      isCritical,
      architectureFocus,
      complexityLevel,
      leadershipAspects,
      frameworks,
      evaluationCriteria,
      resources,
      estimatedTimeMinutes,
      followUpQuestions,
      commonMistakes,
      keyTradeoffs
    } = body;

    const question = await prisma.question.create({
      data: {
        companyId,
        category,
        questionText,
        difficulty,
        questionType: 'system_design',
        tags: tags || [],
        isCritical: isCritical || false,
        isGenerated: false,
        systemDesignDetails: {
          create: {
            architectureFocus: architectureFocus || [],
            complexityLevel: complexityLevel || 'mid',
            leadershipAspects: leadershipAspects || [],
            frameworks: frameworks || [],
            evaluationCriteria: evaluationCriteria || [],
            resources: resources || [],
            estimatedTimeMinutes,
            followUpQuestions: followUpQuestions || [],
            commonMistakes: commonMistakes || [],
            keyTradeoffs: keyTradeoffs || []
          }
        }
      },
      include: {
        company: true,
        systemDesignDetails: true
      }
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error creating system design question:', error);
    return NextResponse.json(
      { error: 'Failed to create system design question' },
      { status: 500 }
    );
  }
}
