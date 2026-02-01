import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Json } from "@/integrations/supabase/types";

export interface CoverPageTemplateData {
  reportTitle: string;
  projectName: string;
  projectSubtitle: string;
  projectLocation: string;
  clientName: string;
  documentNumber: string;
  revision: string;
  preparedBy: string;
  primaryLineColor: string;
  accentLineColor: string;
}

export interface CoverPageTemplate {
  id: string;
  name: string;
  createdAt: string;
  data: CoverPageTemplateData;
}

export const useCloudTemplates = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<CoverPageTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    if (!user) {
      setTemplates([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('cover_page_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load templates');
    } else {
      setTemplates(
        (data || []).map((t) => ({
          id: t.id,
          name: t.name,
          createdAt: t.created_at,
          data: t.data as unknown as CoverPageTemplateData,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [user]);

  const saveTemplate = async (name: string, data: CoverPageTemplateData) => {
    if (!user) {
      toast.error('Please sign in to save templates');
      return null;
    }

    const { data: newTemplate, error } = await supabase
      .from('cover_page_templates')
      .insert({
        user_id: user.id,
        name,
        data: data as unknown as Json,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
      return null;
    }

    toast.success(`Template "${name}" saved!`);
    await fetchTemplates();
    return {
      id: newTemplate.id,
      name: newTemplate.name,
      createdAt: newTemplate.created_at,
      data: newTemplate.data as unknown as CoverPageTemplateData,
    };
  };

  const deleteTemplate = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    const { error } = await supabase
      .from('cover_page_templates')
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

  const updateTemplate = async (id: string, name: string, data: CoverPageTemplateData) => {
    const { error } = await supabase
      .from('cover_page_templates')
      .update({
        name,
        data: data as unknown as Json,
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
