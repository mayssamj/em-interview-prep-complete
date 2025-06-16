
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const where = category ? { category } : {};

    const frameworks = await prisma.system_design_frameworks.findMany({
      where,
      orderBy: [
        { difficulty: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(frameworks);
  } catch (error) {
    console.error('System design frameworks fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system design frameworks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      description, 
      category, 
      keyPrinciples, 
      useCases, 
      tradeoffs, 
      examples, 
      resources, 
      difficulty 
    } = await request.json();

    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Name, description, and category are required' },
        { status: 400 }
      );
    }

    const framework = await prisma.system_design_frameworks.create({
      data: {
        id: uuidv4(),
        name,
        description,
        category,
        key_principles: keyPrinciples || [],
        use_cases: useCases || [],
        tradeoffs: tradeoffs || [],
        examples: examples || [],
        resources: resources || [],
        difficulty: difficulty || 'medium',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'System design framework created successfully',
      framework 
    });
  } catch (error) {
    console.error('System design framework creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create system design framework' },
      { status: 500 }
    );
  }
}
