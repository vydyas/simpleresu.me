import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase-server';
import { errorResponse, ApiError } from '../../../lib/errors';
import { updateJobSchema, createJobSchema } from '../../../lib/validation';

/**
 * POST /api/jobs/[id] - Create a job in a board
 * Body should include boardId
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const { boardId, ...jobData } = body;
    const validatedData = createJobSchema.parse(jobData);

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) throw new ApiError(404, 'User not found');

    // Verify board ownership
    const { data: board } = await supabaseAdmin
      .from('job_boards')
      .select('id')
      .eq('id', boardId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (!board) throw new ApiError(404, 'Job board not found');

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .insert({
        board_id: boardId,
        ...validatedData,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ job: data }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * PUT /api/jobs/[id]
 * Update a job
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const validatedData = updateJobSchema.parse(body);

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) throw new ApiError(404, 'User not found');

    // Verify ownership through board
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select(
        `
        *,
        job_boards!inner(user_id)
      `
      )
      .eq('id', params.id)
      .single();

    if (!job || job.job_boards.user_id !== user.id) {
      throw new ApiError(404, 'Job not found or access denied');
    }

    const { data, error } = await supabaseAdmin
      .from('jobs')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new ApiError(404, 'Job not found');

    return NextResponse.json({ job: data });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * DELETE /api/jobs/[id]
 * Delete a job
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify ownership through board
    const { data: job } = await supabaseAdmin
      .from('jobs')
      .select(
        `
        *,
        job_boards!inner(user_id)
      `
      )
      .eq('id', params.id)
      .single();

    if (!job || job.job_boards.user_id !== user.id) {
      throw new ApiError(404, 'Job not found or access denied');
    }

    const { error } = await supabaseAdmin.from('jobs').delete().eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
