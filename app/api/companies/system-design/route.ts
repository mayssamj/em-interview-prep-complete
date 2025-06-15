
export const dynamic = "force-dynamic";

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

    const company = await prisma.company.findFirst({
      where: {
        name: {
          contains: companyName,
          mode: 'insensitive'
        }
      },
      include: {
        questions: {
          where: {
            questionType: 'system_design'
          },
          include: {
            systemDesignDetails: true,
            _count: {
              select: {
                systemDesignAnswers: true
              }
            }
          },
          orderBy: [
            { isCritical: 'desc' },
            { usageCount: 'desc' }
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

    const response = {
      company: {
        id: company.id,
        name: company.name,
        values: company.values,
        evaluationCriteria: company.evaluationCriteria,
        interviewFormat: company.interviewFormat,
        successTips: company.successTips,
        redFlags: company.redFlags
      },
      systemDesignQuestions: company.questions,
      questionsByCategory,
      stats: {
        totalQuestions: company.questions.length,
        criticalQuestions: company.questions.filter(q => q.isCritical).length,
        categories: Object.keys(questionsByCategory).length
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching company system design data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch company system design data' },
      { status: 500 }
    );
  }
}
