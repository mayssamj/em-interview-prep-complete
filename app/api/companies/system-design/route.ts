
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyName = searchParams.get('company');

    if (!companyName) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      );
    }

    const company = await prisma.company.findUnique({
      where: { name: companyName },
      include: {
        questions: {
          where: {
            question_type: 'system_design'
          },
          include: {
            system_design_questions: true,
            _count: {
              select: {
                system_design_answers: true
              }
            }
          },
          orderBy: [
            { is_critical: 'desc' },
            { usage_count: 'desc' }
          ]
        }
      }
    });

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      );
    }

    // Group questions by category
    const questionsByCategory = company.questions.reduce((acc: any, question) => {
      if (!acc[question.category]) {
        acc[question.category] = [];
      }
      acc[question.category].push(question);
      return acc;
    }, {});

    return NextResponse.json({
      company: {
        id: company.id,
        name: company.name,
        values: company.values,
        evaluationCriteria: company.evaluation_criteria,
        interviewFormat: company.interview_format,
        successTips: company.success_tips,
        redFlags: company.red_flags
      },
      systemDesignQuestions: company.questions,
      questionsByCategory,
      stats: {
        totalQuestions: company.questions.length,
        criticalQuestions: company.questions.filter(q => q.is_critical).length,
        categories: Object.keys(questionsByCategory).length
      }
    });
  } catch (error) {
    console.error('System design questions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design questions' },
      { status: 500 }
    );
  }
}
