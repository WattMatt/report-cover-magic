-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Create cover_page_templates table
CREATE TABLE public.cover_page_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on cover_page_templates
ALTER TABLE public.cover_page_templates ENABLE ROW LEVEL SECURITY;

-- Cover page templates policies
CREATE POLICY "Users can view their own cover page templates"
  ON public.cover_page_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover page templates"
  ON public.cover_page_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover page templates"
  ON public.cover_page_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover page templates"
  ON public.cover_page_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create report_templates table (for multi-page builder)
CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pages JSONB NOT NULL,
  primary_line_color TEXT NOT NULL DEFAULT '#1565C0',
  accent_line_color TEXT NOT NULL DEFAULT '#D4A853',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on report_templates
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;

-- Report templates policies
CREATE POLICY "Users can view their own report templates"
  ON public.report_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own report templates"
  ON public.report_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own report templates"
  ON public.report_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own report templates"
  ON public.report_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cover_page_templates_updated_at
  BEFORE UPDATE ON public.cover_page_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
  BEFORE UPDATE ON public.report_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();