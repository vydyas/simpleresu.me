import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '../../lib/auth';
import { supabaseAdmin } from '../../lib/supabase-server';
import { errorResponse } from '../../lib/errors';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface ScoreResponse {
  score: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    overall: string;
  };
  breakdown: {
    ats: number;
    content: number;
    design: number;
    keywords: number;
  };
}

/**
 * Analyze resume and generate score using Gemini AI
 */
async function analyzeResumeWithGemini(resumeData: Record<string, unknown>): Promise<ScoreResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  const prompt = `Analyze this resume and provide a comprehensive score out of 100. Consider:
1. ATS (Applicant Tracking System) compatibility (0-25 points)
2. Content quality and relevance (0-25 points)
3. Design and formatting (0-25 points)
4. Keyword optimization (0-25 points)

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Provide your response in the following JSON format:
{
  "score": <overall_score_0-100>,
  "feedback": {
    "strengths": ["strength1", "strength2", "strength3"],
    "improvements": ["improvement1", "improvement2", "improvement3"],
    "overall": "overall assessment in 2-3 sentences"
  },
  "breakdown": {
    "ats": <score_0-25>,
    "content": <score_0-25>,
    "design": <score_0-25>,
    "keywords": <score_0-25>
  }
}

Only return the JSON, no additional text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Extract JSON from response (handle markdown code blocks if present)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : text;
    
    const result = JSON.parse(jsonText);
    
    // Validate and normalize scores
    return {
      score: Math.min(100, Math.max(0, result.score || 0)),
      feedback: {
        strengths: Array.isArray(result.feedback?.strengths) ? result.feedback.strengths : [],
        improvements: Array.isArray(result.feedback?.improvements) ? result.feedback.improvements : [],
        overall: result.feedback?.overall || 'Resume analysis completed.',
      },
      breakdown: {
        ats: Math.min(25, Math.max(0, result.breakdown?.ats || 0)),
        content: Math.min(25, Math.max(0, result.breakdown?.content || 0)),
        design: Math.min(25, Math.max(0, result.breakdown?.design || 0)),
        keywords: Math.min(25, Math.max(0, result.breakdown?.keywords || 0)),
      },
    };
  } catch (error) {
    console.error('[Resume Score] Gemini API error:', error);
    throw error;
  }
}

/**
 * POST /api/resume/score
 * Score a resume using Gemini AI
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth();
    if (authResult instanceof NextResponse) return authResult;
    const { userId } = authResult;

    const body = await request.json();
    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Resume ID is required' },
        { status: 400 }
      );
    }

    // Get user's UUID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get resume data
    const { data: resume, error: resumeError } = await supabaseAdmin
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single();

    if (resumeError || !resume) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    // Analyze resume with Gemini
    const scoreData = await analyzeResumeWithGemini(resume);

    return NextResponse.json({ score: scoreData });
  } catch (error) {
    console.error('[Resume Score] Error:', error);
    return errorResponse(error);
  }
}

