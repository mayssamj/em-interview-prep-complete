
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

    const answer = await prisma.system_design_answers.findUnique({
      where: {
        user_id_question_id: {
          user_id: user.id,
          question_id: questionId
        }
      },
      include: {
        questions: true
      }
    });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('System design answer fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design answer' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
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
    } = await request.json();

    if (!questionId || !highLevelDesign) {
      return NextResponse.json(
        { error: 'Question ID and high-level design are required' },
        { status: 400 }
      );
    }

    // Verify question exists and is system design type
    const question = await prisma.questions.findUnique({
      where: { id: questionId }
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    if (question.question_type !== 'system_design') {
      return NextResponse.json(
        { error: 'Question is not a system design question' },
        { status: 400 }
      );
    }

    const answer = await prisma.system_design_answers.upsert({
      where: {
        user_id_question_id: {
          user_id: user.id,
          question_id: questionId
        }
      },
      update: {
        high_level_design: highLevelDesign,
        detailed_components: detailedComponents || null,
        scalability_approach: scalabilityApproach || null,
        data_storage_strategy: dataStorageStrategy || null,
        tradeoffs_discussed: tradeoffsDiscussed || [],
        frameworks_used: frameworksUsed || [],
        estimated_scale: estimatedScale || null,
        notes: notes || null,
        updated_at: new Date()
      },
      create: {
        id: uuidv4(),
        user_id: user.id,
        question_id: questionId,
        high_level_design: highLevelDesign,
        detailed_components: detailedComponents || null,
        scalability_approach: scalabilityApproach || null,
        data_storage_strategy: dataStorageStrategy || null,
        tradeoffs_discussed: tradeoffsDiscussed || [],
        frameworks_used: frameworksUsed || [],
        estimated_scale: estimatedScale || null,
        notes: notes || null,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'System design answer saved successfully',
      answer 
    });
  } catch (error) {
    console.error('System design answer save error:', error);
    return NextResponse.json(
      { error: 'Failed to save system design answer' },
      { status: 500 }
    );
  }
}
