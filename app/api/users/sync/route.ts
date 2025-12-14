import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase-server';
import { errorResponse } from '../../lib/errors';
import { sendWelcomeEmail } from '@/lib/email';

/**
 * @openapi
 * /users/sync:
 *   post:
 *     summary: Sync Clerk user with Supabase
 *     description: Syncs authenticated Clerk user with Supabase database. Automatically called on first login via UserSyncProvider.
 *     tags: [Users]
 *     security:
 *       - ClerkAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: User's email address from Clerk
 *     responses:
 *       200:
 *         description: User synced successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized - Invalid or missing Clerk token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const { email } = body;

    if (!email) {
      console.error('[User Sync] No email provided in request body');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log(`[User Sync] Syncing user: ${userId} with email: ${email}`);

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, created_at')
      .eq('clerk_user_id', userId)
      .single();

    const isFirstTime = !existingUser;

    // Upsert user (insert if not exists, update if exists)
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert(
        {
          clerk_user_id: userId,
          email,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'clerk_user_id',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single();

    if (error) {
      console.error('[User Sync] Supabase error:', error);
      throw error;
    }

    // Send welcome email for first-time users
    // Note: New users default to email_subscription_enabled = true, so welcome email is sent
    if (isFirstTime) {
      console.log(`[User Sync] First-time user detected, sending welcome email to ${email}`);
      // Send email asynchronously (don't wait for it)
      sendWelcomeEmail({ email }).catch((err) => {
        console.error('[User Sync] Failed to send welcome email:', err);
        // Don't fail the sync if email fails
      });
    }

    console.log(`[User Sync] Successfully synced user: ${userId}`);
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('[User Sync] Error:', error);
    return errorResponse(error);
  }
}
