
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { generateOpenAPISpec } from '@/lib/api-docs';

export async function GET() {
  try {
    const spec = generateOpenAPISpec();
    
    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('API docs generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    );
  }
}
