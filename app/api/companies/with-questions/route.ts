
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeSystemDesign = searchParams.get('includeSystemDesign') === 'true';

    const companies = await prisma.companies.findMany({
      include: {
        questions: {
          where: includeSystemDesign ? {} : {
            question_type: {
              not: 'system_design'
            }
          },
          include: {
            _count: {
              select: {
                answers: true,
                system_design_answers: true
              }
            }
          },
          orderBy: [
            { is_critical: 'desc' },
            { usage_count: 'desc' }
          ]
        },
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Transform the data to match expected format
    const transformedCompanies = companies.map(company => ({
      id: company.id,
      name: company.name,
      values: company.values,
      evaluationCriteria: company.evaluation_criteria,
      interviewFormat: company.interview_format,
      successTips: company.success_tips,
      redFlags: company.red_flags,
      questions: company.questions.map(question => ({
        ...question,
        questionText: question.question_text,
        questionType: question.question_type,
        isCritical: question.is_critical,
        usageCount: question.usage_count,
        createdAt: question.created_at,
        updatedAt: question.updated_at
      })),
      questionCount: company._count.questions
    }));

    return NextResponse.json({ companies: transformedCompanies });
  } catch (error) {
    console.error('Companies with questions fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies with questions' },
      { status: 500 }
    );
  }
}
