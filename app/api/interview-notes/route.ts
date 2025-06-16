
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const notes = await prisma.interviewNote.findMany({
      where: { user_id: user.id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        company: true,
        interviewer_name: true,
        interviewer_role: true,
        interview_date: true,
        created_at: true,
        takeaways: true
      }
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Interview notes fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const { 
      company, 
      interviewerName, 
      interviewerRole, 
      questionsAsked, 
      takeaways, 
      followUpThoughts, 
      interviewDate 
    } = await request.json();

    if (!company || !interviewDate) {
      return NextResponse.json(
        { error: 'Company and interview date are required' },
        { status: 400 }
      );
    }

    const note = await prisma.interviewNote.create({
      data: {
        id: uuidv4(),
        user_id: user.id,
        company,
        interviewer_name: interviewerName || null,
        interviewer_role: interviewerRole || null,
        questions_asked: questionsAsked || [],
        takeaways: takeaways || null,
        follow_up_thoughts: followUpThoughts || null,
        interview_date: new Date(interviewDate),
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Interview note created successfully',
      note 
    });
  } catch (error) {
    console.error('Interview note creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create interview note' },
      { status: 500 }
    );
  }
}
