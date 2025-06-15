
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if the note belongs to the user
    const existingNote = await prisma.interviewNote.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const note = await prisma.interviewNote.update({
      where: { id: params.id },
      data: {
        company,
        interviewerName: interviewerName || null,
        interviewerRole: interviewerRole || null,
        questionsAsked: questionsAsked || [],
        takeaways: takeaways || null,
        followUpThoughts: followUpThoughts || null,
        interviewDate: new Date(interviewDate)
      }
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating interview note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the note belongs to the user
    const existingNote = await prisma.interviewNote.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await prisma.interviewNote.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview note:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
