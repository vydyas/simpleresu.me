'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { SharedHeader } from '@/components/shared-header';
import { Loader2, TrendingUp, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface ScoreData {
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

export default function ResumeScorePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Get the first active resume for the user
    const fetchAndScoreResume = async () => {
      try {
        setLoading(true);
        
        // First, get user's resumes
        const resumesResponse = await fetch('/api/resumes');
        if (!resumesResponse.ok) {
          throw new Error('Failed to fetch resumes');
        }
        
        const resumesData = await resumesResponse.json();
        const resumes = resumesData.resumes || [];
        
        if (resumes.length === 0) {
          setError('No resume found. Please create a resume first.');
          setLoading(false);
          return;
        }

        // Use the first resume
        const firstResume = resumes[0];
        
        // Score the resume
        const scoreResponse = await fetch('/api/resume/score', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeId: firstResume.id }),
        });

        if (!scoreResponse.ok) {
          const errorData = await scoreResponse.json();
          throw new Error(errorData.error || 'Failed to score resume');
        }

        const data = await scoreResponse.json();
        setScoreData(data.score);
      } catch (err) {
        console.error('Error scoring resume:', err);
        setError(err instanceof Error ? err.message : 'Failed to score resume');
      } finally {
        setLoading(false);
      }
    };

    fetchAndScoreResume();
  }, [user, isLoaded, router]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  const getCategoryColor = (score: number) => {
    if (score >= 20) return 'text-emerald-600';
    if (score >= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
        <SharedHeader variant="landing" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
        <SharedHeader variant="landing" />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/resume-builder')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Create Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!scoreData) {
    return null;
  }

  const { score, feedback, breakdown } = scoreData;
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30">
      <SharedHeader variant="landing" />
      
      <main className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              Your Resume Score
            </h1>
            <p className="text-gray-600 text-lg">
              AI-powered analysis of your resume
            </p>
          </div>

          {/* Main Score Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Circular Score */}
              <div className="relative w-64 h-64 flex-shrink-0">
                <svg className="transform -rotate-90 w-64 h-64">
                  <circle
                    cx="128"
                    cy="128"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="90"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className={`${getScoreRingColor(score)} transition-all duration-1000`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                      {score}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Score Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'ATS Compatibility', value: breakdown.ats, max: 25 },
                      { label: 'Content Quality', value: breakdown.content, max: 25 },
                      { label: 'Design & Formatting', value: breakdown.design, max: 25 },
                      { label: 'Keyword Optimization', value: breakdown.keywords, max: 25 },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.label}</span>
                          <span className={`text-sm font-semibold ${getCategoryColor(item.value)}`}>
                            {item.value}/{item.max}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.value >= 20
                                ? 'bg-emerald-500'
                                : item.value >= 15
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${(item.value / item.max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-900">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Sparkles className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                <h3 className="text-xl font-semibold text-gray-900">Improvements</h3>
              </div>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Overall Assessment */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Overall Assessment</h3>
            <p className="text-gray-700 leading-relaxed">{feedback.overall}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/resume-builder')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-xl transition-all transform hover:scale-105"
            >
              Improve Your Resume
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-white text-gray-900 rounded-lg border-2 border-gray-200 font-semibold hover:border-emerald-300 transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

