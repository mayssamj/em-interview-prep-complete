
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { seedSystemDesignContent } from '@/lib/seed-system-design';

export async function POST(request: NextRequest) {
  try {
    await seedSystemDesignContent();
    return NextResponse.json({ 
      message: 'System design content seeded successfully' 
    });
  } catch (error) {
    console.error('Error seeding system design content:', error);
    return NextResponse.json(
      { error: 'Failed to seed system design content' },
      { status: 500 }
    );
  }
}
