
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const companies = await prisma.companies.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        values: true,
        evaluation_criteria: true,
        interview_format: true,
        success_tips: true,
        red_flags: true,
        created_at: true,
        updated_at: true,
        _count: {
          select: {
            questions: true
          }
        }
      }
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
      createdAt: company.created_at,
      updatedAt: company.updated_at,
      questionCount: company._count.questions
    }));

    return NextResponse.json({ companies: transformedCompanies });
  } catch (error) {
    console.error('Companies fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    );
  }
}
