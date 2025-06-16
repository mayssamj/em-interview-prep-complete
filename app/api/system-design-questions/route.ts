
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
      question_type: 'system_design'
    };

    if (company && company !== 'all') {
      // For now, filter by company name directly in the include
      // This will be handled in the include clause below
    }

    if (difficulty && difficulty !== 'all') {
      where.difficulty = difficulty;
    }

    if (category && category !== 'all') {
      // Use the actual category name as stored in database
      where.category = category;
    }

    if (critical === 'true') {
      where.is_critical = true;
    }

    const questions = await prisma.question.findMany({
      where,
      include: {
        companies: true,
        system_design_questions: true,
        _count: {
          select: {
            answers: true,
            system_design_answers: true
          }
        }
      },
      orderBy: [
        { is_critical: 'desc' },
        { usage_count: 'desc' },
        { created_at: 'desc' }
      ]
    });

    // Filter by company name if specified
    let filteredQuestions = questions;
    if (company && company !== 'all') {
      filteredQuestions = questions.filter(q => 
        q.companies?.name === company
      );
    }

    return NextResponse.json(filteredQuestions);
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

    const questionId = questionText.toLowerCase().replace(/[^a-z0-9]+/g, '_').substring(0, 50) + '_' + Math.random().toString(36).substring(2, 8);
    
    const question = await prisma.question.create({
      data: {
        id: questionId,
        company_id: companyId,
        category,
        question_text: questionText,
        difficulty,
        question_type: 'system_design',
        tags: tags || [],
        is_critical: isCritical || false,
        is_generated: false,
        updated_at: new Date()
      },
      include: {
        companies: true,
        system_design_questions: true
      }
    });

    // Create system design details separately
    await prisma.systemDesignQuestion.create({
      data: {
        id: questionId + '_system_design',
        question_id: questionId,
        architecture_focus: architectureFocus || [],
        complexity_level: complexityLevel || 'mid',
        leadership_aspects: leadershipAspects || [],
        frameworks: frameworks || [],
        evaluation_criteria: evaluationCriteria || [],
        resources: resources || [],
        estimated_time_minutes: estimatedTimeMinutes,
        follow_up_questions: followUpQuestions || [],
        common_mistakes: commonMistakes || [],
        key_tradeoffs: keyTradeoffs || [],
        updated_at: new Date()
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
