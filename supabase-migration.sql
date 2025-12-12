-- SimpleResu.me Database Migration
-- Run this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synchronized with Clerk)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'My Resume',

  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  headline TEXT,
  summary TEXT,
  location TEXT,
  phone_number TEXT,
  linkedin_id TEXT,
  github_id TEXT,

  -- Complex data as JSONB
  positions JSONB DEFAULT '[]'::jsonb,
  educations JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  projects JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  custom_sections JSONB DEFAULT '[]'::jsonb,

  -- Resume configuration
  config JSONB DEFAULT '{
    "showPhoto": true,
    "showSummary": true,
    "showExperience": true,
    "showEducation": true,
    "showSkills": true,
    "showProjects": true,
    "showRepositories": true,
    "showAwards": true,
    "showCertificates": true,
    "showLanguages": true,
    "showVolunteer": true,
    "showCertifications": true
  }'::jsonb,

  -- Metadata
  template TEXT DEFAULT 'default',
  zoom INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_is_active ON resumes(is_active);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resumes_updated_at ON resumes;
CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS users_select_own ON users;
DROP POLICY IF EXISTS users_insert_own ON users;
DROP POLICY IF EXISTS users_update_own ON users;

DROP POLICY IF EXISTS resumes_select_own ON resumes;
DROP POLICY IF EXISTS resumes_insert_own ON resumes;
DROP POLICY IF EXISTS resumes_update_own ON resumes;
DROP POLICY IF EXISTS resumes_delete_own ON resumes;

-- Note: RLS policies in Supabase are typically managed through service role key
-- For now, we'll use service role key in our API routes for full control
-- You can add more restrictive RLS policies later if needed

-- Enable public access through service role (API will handle auth)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
