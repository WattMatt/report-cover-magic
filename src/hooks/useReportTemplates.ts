import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PageConfig } from "@/utils/generateMultiPageDocument";

export interface ReportTemplate {
  id: string;
  name: string;
  createdAt: string;
  pages: PageConfig[];
  primaryLineColor: string;
  accentLineColor: string;
}

const STORAGE_KEY = "report_templates";

export const useReportTemplates = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);

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

  const saveTemplates = (newTemplates: ReportTemplate[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
    setTemplates(newTemplates);
  };

  const saveTemplate = (
    name: string,
    pages: PageConfig[],
    primaryLineColor: string,
    accentLineColor: string
  ) => {
    const newTemplate: ReportTemplate = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date().toISOString(),
      pages,
      primaryLineColor,
      accentLineColor,
    };
    const updated = [...templates, newTemplate];
    saveTemplates(updated);
    toast.success(`Template "${name}" saved!`);
    return newTemplate;
  };

  const deleteTemplate = (id: string) => {
    const template = templates.find((t) => t.id === id);
    const updated = templates.filter((t) => t.id !== id);
    saveTemplates(updated);
    toast.success(`Template "${template?.name}" deleted`);
  };

  const updateTemplate = (
    id: string,
    name: string,
    pages: PageConfig[],
    primaryLineColor: string,
    accentLineColor: string
  ) => {
    const updated = templates.map((t) =>
      t.id === id
        ? { ...t, name, pages, primaryLineColor, accentLineColor, createdAt: new Date().toISOString() }
        : t
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
