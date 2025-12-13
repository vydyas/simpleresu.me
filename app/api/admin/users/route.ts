import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../lib/supabase-server";
import { errorResponse } from "../../lib/errors";

export async function GET() {
  try {
    // In production, add proper admin authentication here
    // For now, we'll allow access from the admin dashboard
    
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, clerk_user_id, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Admin] Error fetching users:", error);
      throw error;
    }

    return NextResponse.json({ users: users || [] });
  } catch (error) {
    console.error("[Admin] Error:", error);
    return errorResponse(error);
  }
}
