import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { Download, Trash2, GripVertical, FileText, BookOpen, FileSpreadsheet, Layers, History, Save, FolderOpen, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { generateMultiPageDocument, PageConfig, PageType } from "@/utils/generateMultiPageDocument";
import { useCloudReportTemplates, ReportTemplate } from "@/hooks/useCloudReportTemplates";
import { DocumentOutlinePreview } from "@/components/DocumentOutlinePreview";
import wmLogo from "@/assets/wm-logo.jpg";

const PAGE_TYPE_INFO = {
  cover: { label: "Cover Page", icon: FileText },
  toc: { label: "Table of Contents", icon: BookOpen },
  executive: { label: "Executive Summary", icon: FileSpreadsheet },
  section: { label: "Section Divider", icon: Layers },
  history: { label: "Document History", icon: History },
};

const createDefaultPage = (type: PageType): PageConfig => {
  switch (type) {
    case "cover":
      return {
        type: "cover",
        reportTitle: "Electrical Load\nEstimate Report",
        projectName: "Central Plaza Shopping Centre",
        projectSubtitle: "Commercial Development",
        projectLocation: "123 Main Street, Sydney NSW 2000",
        clientName: "ABC Development Group",
        documentNumber: "WM-2026-001",
        revision: "A",
        preparedBy: "WM Consulting Engineers",
        date: new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }),
      };
    case "toc":
      return {
        type: "toc",
        documentTitle: "Table of Contents",
        entries: [
          { title: "Executive Summary", page: "3" },
          { title: "1. Introduction", page: "5" },
          { title: "2. Scope of Work", page: "7" },
          { title: "3. Electrical Load Analysis", page: "10" },
        ],
      };
    case "executive":
      return {
        type: "executive",
        title: "Executive Summary",
        projectName: "Central Plaza Shopping Centre",
        summaryText: "This report presents the electrical load estimate for the proposed development.\n\nKey findings include:\n• Total connected load: 2,450 kVA\n• Maximum demand: 1,960 kVA",
        highlights: [
          { label: "Total Load", value: "2,450 kVA" },
          { label: "Max Demand", value: "1,960 kVA" },
          { label: "Supply Rating", value: "2,500 kVA" },
        ],
      };
    case "section":
      return {
        type: "section",
        sectionNumber: "Section 1",
        sectionTitle: "Introduction",
        sectionSubtitle: "Project Overview & Background",
      };
    case "history":
      return {
        type: "history",
        title: "Document Revision History",
        revisions: [
          { revision: "A", date: "15 Jan 2026", author: "J. Smith", description: "Initial issue for review" },
          { revision: "B", date: "22 Jan 2026", author: "J. Smith", description: "Incorporated client comments" },
        ],
      };
  }
};

interface PageItem {
  id: string;
  config: PageConfig;
}

const MultiPageBuilderPage = () => {
  const { primaryLineColor, accentLineColor, setPrimaryLineColor, setAccentLineColor } = useTheme();
  const { user } = useAuth();
  const { templates, loading: templatesLoading, saveTemplate, deleteTemplate } = useCloudReportTemplates();
  const [pages, setPages] = useState<PageItem[]>([
    { id: crypto.randomUUID(), config: createDefaultPage("cover") },
    { id: crypto.randomUUID(), config: createDefaultPage("toc") },
  ]);
  const [logoBase64, setLogoBase64] = useState<string>("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Load default logo
  useState(() => {
    fetch(wmLogo)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setLogoBase64(reader.result as string);
        reader.readAsDataURL(blob);
      });
  });

  const addPage = (type: PageType) => {
    setPages([...pages, { id: crypto.randomUUID(), config: createDefaultPage(type) }]);
    toast.success(`Added ${PAGE_TYPE_INFO[type].label}`);
  };

  const removePage = (id: string) => {
    setPages(pages.filter((p) => p.id !== id));
    toast.success("Page removed");
  };

  const duplicatePage = (id: string) => {
    const pageIndex = pages.findIndex((p) => p.id === id);
    if (pageIndex === -1) return;
    
    const originalPage = pages[pageIndex];
    const duplicatedPage: PageItem = {
      id: crypto.randomUUID(),
      config: JSON.parse(JSON.stringify(originalPage.config)), // Deep clone the config
    };
    
    // Insert the duplicate right after the original
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, duplicatedPage);
    setPages(newPages);
    toast.success(`Duplicated ${PAGE_TYPE_INFO[originalPage.config.type].label}`);
  };

  const updatePage = (id: string, config: PageConfig) => {
    setPages(pages.map((p) => (p.id === id ? { ...p, config } : p)));
  };

  const handleDownload = async () => {
    if (pages.length === 0) {
      toast.error("Add at least one page to export");
      return;
    }
    try {
      await generateMultiPageDocument({
        pages: pages.map((p) => p.config),
        primaryLineColor,
        accentLineColor,
        logoBase64,
      });
      toast.success("Document downloaded!");
    } catch (error) {
      toast.error("Failed to generate document");
      console.error(error);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    if (pages.length === 0) {
      toast.error("Add at least one page to save as template");
      return;
    }
    setIsSaving(true);
    await saveTemplate(
      templateName.trim(),
      pages.map((p) => p.config),
      primaryLineColor,
      accentLineColor
    );
    setIsSaving(false);
    setTemplateName("");
    setSaveDialogOpen(false);
  };

  const handleLoadTemplate = (template: ReportTemplate) => {
    setPages(template.pages.map((config) => ({ id: crypto.randomUUID(), config })));
    setPrimaryLineColor(template.primaryLineColor);
    setAccentLineColor(template.accentLineColor);
    setLoadDialogOpen(false);
    toast.success(`Template "${template.name}" loaded!`);
  };

  const renderPageEditor = (item: PageItem) => {
    const { config } = item;

    switch (config.type) {
      case "cover":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-xs">Report Title</Label>
                <Textarea
                  value={config.reportTitle}
                  onChange={(e) => updatePage(item.id, { ...config, reportTitle: e.target.value })}
                  rows={2}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Project Name</Label>
                <Input
                  value={config.projectName}
                  onChange={(e) => updatePage(item.id, { ...config, projectName: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Client</Label>
                <Input
                  value={config.clientName}
                  onChange={(e) => updatePage(item.id, { ...config, clientName: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Document No.</Label>
                <Input
                  value={config.documentNumber}
                  onChange={(e) => updatePage(item.id, { ...config, documentNumber: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Revision</Label>
                <Input
                  value={config.revision}
                  onChange={(e) => updatePage(item.id, { ...config, revision: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
          </div>
        );

      case "toc":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={config.documentTitle}
                onChange={(e) => updatePage(item.id, { ...config, documentTitle: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Entries ({config.entries.length})</Label>
              {config.entries.slice(0, 3).map((entry, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={entry.title}
                    onChange={(e) => {
                      const newEntries = [...config.entries];
                      newEntries[idx] = { ...entry, title: e.target.value };
                      updatePage(item.id, { ...config, entries: newEntries });
                    }}
                    placeholder="Title"
                    className="text-sm flex-1"
                  />
                  <Input
                    value={entry.page}
                    onChange={(e) => {
                      const newEntries = [...config.entries];
                      newEntries[idx] = { ...entry, page: e.target.value };
                      updatePage(item.id, { ...config, entries: newEntries });
                    }}
                    placeholder="Page"
                    className="text-sm w-16"
                  />
                </div>
              ))}
              {config.entries.length > 3 && (
                <p className="text-xs text-muted-foreground">+{config.entries.length - 3} more entries</p>
              )}
            </div>
          </div>
        );

      case "executive":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Title</Label>
                <Input
                  value={config.title}
                  onChange={(e) => updatePage(item.id, { ...config, title: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Project Name</Label>
                <Input
                  value={config.projectName}
                  onChange={(e) => updatePage(item.id, { ...config, projectName: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Summary (first 100 chars)</Label>
              <Textarea
                value={config.summaryText}
                onChange={(e) => updatePage(item.id, { ...config, summaryText: e.target.value })}
                rows={3}
                className="text-sm"
              />
            </div>
          </div>
        );

      case "section":
        return (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-xs">Section #</Label>
                <Input
                  value={config.sectionNumber}
                  onChange={(e) => updatePage(item.id, { ...config, sectionNumber: e.target.value })}
                  className="text-sm"
                />
              </div>
              <div className="col-span-2">
                <Label className="text-xs">Title</Label>
                <Input
                  value={config.sectionTitle}
                  onChange={(e) => updatePage(item.id, { ...config, sectionTitle: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Subtitle</Label>
              <Input
                value={config.sectionSubtitle}
                onChange={(e) => updatePage(item.id, { ...config, sectionSubtitle: e.target.value })}
                className="text-sm"
              />
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Title</Label>
              <Input
                value={config.title}
                onChange={(e) => updatePage(item.id, { ...config, title: e.target.value })}
                className="text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Revisions ({config.revisions.length})</Label>
              {config.revisions.slice(0, 2).map((rev, idx) => (
                <div key={idx} className="flex gap-2 mt-1">
                  <Input value={rev.revision} className="text-sm w-12" readOnly />
                  <Input value={rev.date} className="text-sm flex-1" readOnly />
                  <Input value={rev.author} className="text-sm flex-1" readOnly />
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Multi-Page Document Builder</h2>
              <p className="text-muted-foreground">
                Combine multiple page types into a single Word document. Drag to reorder.
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!user ? (
                <Button variant="outline" size="sm" disabled className="gap-2">
                  <Save className="h-4 w-4" />
                  Sign in to save
                </Button>
              ) : (
                <>
                  {/* Save Template Dialog */}
                  <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Save Report Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="templateName">Template Name</Label>
                          <Input
                            id="templateName"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="e.g., Standard Engineering Report"
                            onKeyDown={(e) => e.key === "Enter" && handleSaveTemplate()}
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          This will save {pages.length} page{pages.length !== 1 ? "s" : ""} and current theme colors.
                        </div>
                        <Button onClick={handleSaveTemplate} disabled={!templateName.trim() || isSaving} className="w-full">
                          {isSaving ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4 mr-2" />
                          )}
                          Save Template
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Load Template Dialog */}
                  <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <FolderOpen className="h-4 w-4" />
                        Load
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Load Report Template</DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        {templatesLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                          </div>
                        ) : templates.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <FolderOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No saved templates yet.</p>
                            <p className="text-sm">Save your first template to get started!</p>
                          </div>
                        ) : (
                      <div className="space-y-2 max-h-[300px] overflow-auto">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                          >
                            <button
                              onClick={() => handleLoadTemplate(template)}
                              className="flex-1 text-left"
                            >
                              <div className="font-medium">{template.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {template.pages.length} page{template.pages.length !== 1 ? "s" : ""} • {new Date(template.createdAt).toLocaleDateString()}
                              </div>
                            </button>
                            <div className="flex items-center gap-2 ml-2">
                              <div className="flex gap-1">
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: template.primaryLineColor }}
                                />
                                <div
                                  className="w-4 h-4 rounded-full border"
                                  style={{ backgroundColor: template.accentLineColor }}
                                />
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete "{template.name}". This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteTemplate(template.id)}
                                      className="bg-destructive hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </>
              )}

              <Button onClick={handleDownload} size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Add Page Buttons */}
          <div className="bg-card rounded-xl p-4 shadow-lg border border-border">
            <Label className="text-sm mb-3 block">Add Pages</Label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(PAGE_TYPE_INFO) as PageType[]).map((type) => {
                const info = PAGE_TYPE_INFO[type];
                return (
                  <Button key={type} variant="outline" size="sm" onClick={() => addPage(type)} className="gap-2">
                    <info.icon className="h-4 w-4" />
                    {info.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Page List */}
          <div className="space-y-3">
            <Label className="text-sm">Document Pages ({pages.length})</Label>

            {pages.length === 0 ? (
              <div className="bg-card rounded-xl p-8 shadow-lg border border-border text-center">
                <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No pages added yet.</p>
                <p className="text-sm text-muted-foreground">Click the buttons above to add pages.</p>
              </div>
            ) : (
              <Reorder.Group axis="y" values={pages} onReorder={setPages} className="space-y-2">
                {pages.map((item, index) => {
                  const info = PAGE_TYPE_INFO[item.config.type];
                  return (
                    <Reorder.Item key={item.id} value={item}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-xl shadow-lg border border-border overflow-hidden"
                      >
                        <Accordion type="single" collapsible>
                          <AccordionItem value={item.id} className="border-none">
                            <div className="flex items-center gap-3 p-4">
                              <div className="cursor-grab active:cursor-grabbing">
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                style={{ backgroundColor: primaryLineColor }}
                              >
                                {index + 1}
                              </div>
                              <info.icon className="h-5 w-5 text-muted-foreground" />
                              <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                                <span className="font-medium">{info.label}</span>
                              </AccordionTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicatePage(item.id);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                                title="Duplicate page"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removePage(item.id);
                                }}
                                className="text-destructive hover:text-destructive"
                                title="Remove page"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <AccordionContent className="px-4 pb-4">
                              <div className="pl-16">{renderPageEditor(item)}</div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </motion.div>
                    </Reorder.Item>
                  );
                })}
              </Reorder.Group>
            )}
          </div>

          {/* Document Outline Preview */}
          {pages.length > 0 && (
            <DocumentOutlinePreview
              pages={pages}
              primaryLineColor={primaryLineColor}
              accentLineColor={accentLineColor}
              onReorder={setPages}
              onDuplicate={duplicatePage}
              onDelete={removePage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiPageBuilderPage;
