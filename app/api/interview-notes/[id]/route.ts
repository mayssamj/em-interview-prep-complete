
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);

    const note = await prisma.interviewNote.findFirst({
      where: {
        id: params.id,
        user_id: user.id
      }
    });

    if (!note) {
      return NextResponse.json(
        { error: 'Interview note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ note });
  } catch (error) {
    console.error('Interview note fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview note' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const note = await prisma.interviewNote.updateMany({
      where: {
        id: params.id,
        user_id: user.id
      },
      data: {
        company,
        interviewer_name: interviewerName || null,
        interviewer_role: interviewerRole || null,
        questions_asked: questionsAsked || [],
        takeaways: takeaways || null,
        follow_up_thoughts: followUpThoughts || null,
        interview_date: interviewDate ? new Date(interviewDate) : undefined,
        updated_at: new Date()
      }
    });

    if (note.count === 0) {
      return NextResponse.json(
        { error: 'Interview note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Interview note updated successfully' 
    });
  } catch (error) {
    console.error('Interview note update error:', error);
    return NextResponse.json(
      { error: 'Failed to update interview note' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);

    const result = await prisma.interviewNote.deleteMany({
      where: {
        id: params.id,
        user_id: user.id
      }
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: 'Interview note not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: 'Interview note deleted successfully' 
    });
  } catch (error) {
    console.error('Interview note deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete interview note' },
      { status: 500 }
    );
  }
}
