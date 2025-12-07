import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

/**
 * Require authentication for an API route
 * Returns userId if authenticated, or error response if not
 */
export async function requireAuth(): Promise<{ userId: string } | NextResponse> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized', message: 'Authentication required' },
      { status: 401 }
    );
  }

  return { userId };
}
