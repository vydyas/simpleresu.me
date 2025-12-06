import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../lib/auth';
import { supabaseAdmin } from '../lib/supabase-server';
import { errorResponse, ApiError } from '../lib/errors';
import { createJobBoardSchema } from '../lib/validation';

/**
 * GET /api/job-boards
 * Get all job boards for authenticated user with their jobs
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) throw new ApiError(404, 'User not found');

    // Get boards with their jobs
    const { data: boards, error: boardsError } = await supabaseAdmin
      .from('job_boards')
      .select(
        `
        *,
        jobs (*)
      `
      )
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (boardsError) throw boardsError;

    return NextResponse.json({ boards: boards || [] });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * POST /api/job-boards
 * Create a new job board
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const validatedData = createJobBoardSchema.parse(body);

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) throw new ApiError(404, 'User not found');

    const { data, error } = await supabaseAdmin
      .from('job_boards')
      .insert({
        user_id: user.id,
        name: validatedData.name,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ board: data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
