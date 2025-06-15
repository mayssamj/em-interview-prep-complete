
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { prisma } from '@/lib/db';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = params;

    const story = await prisma.story.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(story);
  } catch (error) {
    console.error('Story fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = params;
    const { title, situation, task, action, result, reflection, tags, categories } = await request.json();

    if (!title?.trim() || !situation?.trim() || !task?.trim() || !action?.trim() || !result?.trim()) {
      return NextResponse.json(
        { error: 'Title, situation, task, action, and result are required' },
        { status: 400 }
      );
    }

    const story = await prisma.story.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        title: title.trim(),
        situation: situation.trim(),
        task: task.trim(),
        action: action.trim(),
        result: result.trim(),
        reflection: reflection?.trim() || null,
        tags: tags || [],
        categories: categories || [],
      },
    });

    return NextResponse.json(updatedStory);
  } catch (error) {
    console.error('Story update error:', error);
    return NextResponse.json(
      { error: 'Failed to update story' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth();
    const { id } = params;

    const story = await prisma.story.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    await prisma.story.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Story deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
