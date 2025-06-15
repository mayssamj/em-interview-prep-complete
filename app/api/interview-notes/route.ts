
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notes = await prisma.interviewNote.findMany({
      where: { userId: user.id },
      orderBy: { interviewDate: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching interview notes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      company,
      interviewerName,
      interviewerRole,
      questionsAsked,
      takeaways,
      followUpThoughts,
      interviewDate
    } = body;

    if (!company || !interviewDate) {
      return NextResponse.json(
        { error: 'Company and interview date are required' },
        { status: 400 }
      );
    }

    const note = await prisma.interviewNote.create({
      data: {
        userId: user.id,
        company,
        interviewerName: interviewerName || null,
        interviewerRole: interviewerRole || null,
        questionsAsked: questionsAsked || [],
        takeaways: takeaways || null,
        followUpThoughts: followUpThoughts || null,
        interviewDate: new Date(interviewDate)
      }
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Error creating interview note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
