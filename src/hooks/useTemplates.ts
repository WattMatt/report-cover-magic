import { useState, useEffect } from "react";
import { toast } from "sonner";

export interface CoverPageTemplate {
  id: string;
  name: string;
  createdAt: string;
  data: {
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
  };
}

const STORAGE_KEY = "cover_page_templates";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<CoverPageTemplate[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch {
        setTemplates([]);
      }
    }
  }, []);

  const saveTemplates = (newTemplates: CoverPageTemplate[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const saveTemplate = (name: string, data: CoverPageTemplate["data"]) => {
    const newTemplate: CoverPageTemplate = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      data,
    };
    const updated = [...templates, newTemplate];
    saveTemplates(updated);
    toast.success(`Template "${name}" saved!`);
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
    toast.success("Template deleted");
  };

  const updateTemplate = (id: string, name: string, data: CoverPageTemplate["data"]) => {
    const updated = templates.map((t) =>
      t.id === id ? { ...t, name, data, createdAt: new Date().toISOString() } : t
    );
    saveTemplates(updated);
    toast.success(`Template "${name}" updated!`);
  };

  return {
    templates,
    saveTemplate,
    deleteTemplate,
    updateTemplate,
  };
};
