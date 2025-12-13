import { NextResponse } from "next/server";
import { getAllTemplates } from "@/lib/email-templates";

export async function GET() {
  try {
    const templates = getAllTemplates();
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("[Admin] Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
