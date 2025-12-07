import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase-server';
import { errorResponse, ApiError } from '../../lib/errors';
import { updateResumeSchema } from '../../lib/validation';

/**
 * @openapi
 * /resumes/{id}:
 *   get:
 *     summary: Get a specific resume
 *     description: Retrieve a single resume by ID for the authenticated user
 *     tags: [Resumes]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Resume not found or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { data, error } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (error) throw error;
    if (!data) throw new ApiError(404, 'Resume not found');

    return NextResponse.json({ resume: data });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * @openapi
 * /resumes/{id}:
 *   put:
 *     summary: Update a specific resume
 *     description: Update any fields of an existing resume. All fields are optional - only provided fields will be updated.
 *     tags: [Resumes]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Resume Name
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.updated@example.com
 *               headline:
 *                 type: string
 *                 example: Senior Software Engineer
 *               summary:
 *                 type: string
 *                 example: Updated professional summary...
 *               location:
 *                 type: string
 *                 example: New York, NY
 *               phoneNumber:
 *                 type: string
 *                 example: +1 (555) 987-6543
 *               linkedinId:
 *                 type: string
 *                 example: johndoe
 *               githubId:
 *                 type: string
 *                 example: johndoe
 *               positions:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Position'
 *               educations:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Education'
 *               skills:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Skill'
 *               projects:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Project'
 *               certifications:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Certification'
 *               config:
 *                 $ref: '#/components/schemas/ResumeConfig'
 *               template:
 *                 type: string
 *                 example: modern
 *               zoom:
 *                 type: integer
 *                 minimum: 50
 *                 maximum: 200
 *                 example: 120
 *     responses:
 *       200:
 *         description: Resume updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resume:
 *                   $ref: '#/components/schemas/Resume'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Resume not found or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const validatedData = updateResumeSchema.parse(body);

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const updatePayload: Record<string, unknown> = {};

    // Map validated data to database columns
    if (validatedData.name !== undefined) updatePayload.name = validatedData.name;
    if (validatedData.firstName !== undefined)
      updatePayload.first_name = validatedData.firstName;
    if (validatedData.lastName !== undefined)
      updatePayload.last_name = validatedData.lastName;
    if (validatedData.email !== undefined) updatePayload.email = validatedData.email;
    if (validatedData.headline !== undefined)
      updatePayload.headline = validatedData.headline;
    if (validatedData.summary !== undefined)
      updatePayload.summary = validatedData.summary;
    if (validatedData.location !== undefined)
      updatePayload.location = validatedData.location;
    if (validatedData.phoneNumber !== undefined)
      updatePayload.phone_number = validatedData.phoneNumber;
    if (validatedData.linkedinId !== undefined)
      updatePayload.linkedin_id = validatedData.linkedinId;
    if (validatedData.githubId !== undefined)
      updatePayload.github_id = validatedData.githubId;
    if (validatedData.positions !== undefined)
      updatePayload.positions = validatedData.positions;
    if (validatedData.educations !== undefined)
      updatePayload.educations = validatedData.educations;
    if (validatedData.skills !== undefined) updatePayload.skills = validatedData.skills;
    if (validatedData.projects !== undefined)
      updatePayload.projects = validatedData.projects;
    if (validatedData.certifications !== undefined)
      updatePayload.certifications = validatedData.certifications;
    if (validatedData.customSections !== undefined)
      updatePayload.custom_sections = validatedData.customSections;
    if (validatedData.config !== undefined) updatePayload.config = validatedData.config;
    if (validatedData.template !== undefined)
      updatePayload.template = validatedData.template;
    if (validatedData.zoom !== undefined) updatePayload.zoom = validatedData.zoom;

    const { data, error } = await supabaseAdmin
      .from('resumes')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new ApiError(404, 'Resume not found');

    return NextResponse.json({ resume: data });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * @openapi
 * /resumes/{id}:
 *   delete:
 *     summary: Delete a resume
 *     description: Soft delete a resume by setting is_active to false. The resume data is preserved but won't appear in GET requests.
 *     tags: [Resumes]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Resume ID
 *     responses:
 *       200:
 *         description: Resume deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Resume not found or user not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { error } = await supabaseAdmin
      .from('resumes')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return errorResponse(error);
  }
}
