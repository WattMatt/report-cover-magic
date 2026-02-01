import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

export type PageType = "toc" | "executive_summary" | "section_divider" | "document_history";

export interface PageTemplate<T = unknown> {
  id: string;
  name: string;
  createdAt: string;
  data: T;
  primaryLineColor: string;
  accentLineColor: string;
}

export const useCloudPageTemplates = <T>(pageType: PageType) => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<PageTemplate<T>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('page_templates')
      .select('*')
      .eq('page_type', pageType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching page templates:', error);
      toast.error('Failed to load templates');
    } else {
      setTemplates(
        (data || []).map((t) => ({
          id: t.id,
          name: t.name,
          createdAt: t.created_at,
          data: t.data as unknown as T,
          primaryLineColor: t.primary_line_color,
          accentLineColor: t.accent_line_color,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [user, pageType]);

  const saveTemplate = async (
    name: string,
    data: T,
    primaryLineColor: string,
    accentLineColor: string
  ) => {
    if (!user) {
      toast.error('Please sign in to save templates');
      return null;
    }

    const { data: newTemplate, error } = await supabase
      .from('page_templates')
      .insert({
        user_id: user.id,
        name,
        page_type: pageType,
        data: data as unknown as Json,
        primary_line_color: primaryLineColor,
        accent_line_color: accentLineColor,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving page template:', error);
      toast.error('Failed to save template');
      return null;
    }

    toast.success(`Template "${name}" saved!`);
    await fetchTemplates();
    return {
      id: newTemplate.id,
      name: newTemplate.name,
      createdAt: newTemplate.created_at,
      data: newTemplate.data as unknown as T,
      primaryLineColor: newTemplate.primary_line_color,
      accentLineColor: newTemplate.accent_line_color,
    };
  };

  const deleteTemplate = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    const { error } = await supabase
      .from('page_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
      return;
    }

    toast.success(`Template "${template?.name}" deleted`);
    await fetchTemplates();
  };

  const updateTemplate = async (
    id: string,
    name: string,
    data: T,
    primaryLineColor: string,
    accentLineColor: string
  ) => {
    const { error } = await supabase
      .from('page_templates')
      .update({
        name,
        data: data as unknown as Json,
        primary_line_color: primaryLineColor,
        accent_line_color: accentLineColor,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating template:', error);
      toast.error('Failed to update template');
      return;
    }

    toast.success(`Template "${name}" updated!`);
    await fetchTemplates();
  };

  return {
    templates,
    loading,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
    refetch: fetchTemplates,
  };
};
