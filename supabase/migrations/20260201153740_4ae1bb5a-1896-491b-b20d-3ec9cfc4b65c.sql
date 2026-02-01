-- Create page_templates table for all individual page types
CREATE TABLE public.page_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  page_type TEXT NOT NULL,
  data JSONB NOT NULL,
  primary_line_color TEXT NOT NULL DEFAULT '#1565C0',
  accent_line_color TEXT NOT NULL DEFAULT '#D4A853',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own page templates"
  ON public.page_templates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own page templates"
  ON public.page_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own page templates"
  ON public.page_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own page templates"
  ON public.page_templates FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_page_templates_updated_at
  BEFORE UPDATE ON public.page_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for efficient queries by page_type
CREATE INDEX idx_page_templates_user_type ON public.page_templates(user_id, page_type);