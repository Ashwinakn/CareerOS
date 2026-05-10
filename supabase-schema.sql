-- Supabase Schema for Career OS
-- Paste this into the Supabase SQL Editor

-- 1. Create a table to store the entire JSON state per user
-- This JSONB approach ensures offline-first snappiness while backing up to Postgres!
CREATE TABLE IF NOT EXISTS public.user_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    state JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only read their own data
CREATE POLICY "Users can view their own data" 
ON public.user_data FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own data
CREATE POLICY "Users can insert their own data" 
ON public.user_data FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own data
CREATE POLICY "Users can update their own data" 
ON public.user_data FOR UPDATE 
USING (auth.uid() = user_id);

-- 4. Automatically create user_data row on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_data (user_id, state)
  VALUES (NEW.id, '{}'::jsonb);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
