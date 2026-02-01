import { useState } from "react";
import { Save, FolderOpen, Trash2, Loader2, Pencil, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useCloudTemplates, CoverPageTemplateData, CoverPageTemplate } from "@/hooks/useCloudTemplates";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

interface TemplateManagerProps {
  currentData: CoverPageTemplateData;
  onLoadTemplate: (data: CoverPageTemplateData) => void;
  selectedTemplate: CoverPageTemplate | null;
  onSelectTemplate: (template: CoverPageTemplate | null) => void;
}

const TemplateManager = ({ 
  currentData, 
  onLoadTemplate, 
  selectedTemplate,
  onSelectTemplate 
}: TemplateManagerProps) => {
  const { templates, loading, saveTemplate, deleteTemplate, updateTemplate } = useCloudTemplates();
  const { user } = useAuth();
  const { setPrimaryLineColor, setAccentLineColor } = useTheme();
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNew = async () => {
    if (!templateName.trim()) return;
    setIsSaving(true);
    const newTemplate = await saveTemplate(templateName.trim(), currentData);
    setIsSaving(false);
    setTemplateName("");
    setSaveDialogOpen(false);
    if (newTemplate) {
      onSelectTemplate(newTemplate);
    }
  };

  const handleUpdate = async () => {
    if (!selectedTemplate) return;
    setIsSaving(true);
    await updateTemplate(selectedTemplate.id, selectedTemplate.name, currentData);
    setIsSaving(false);
  };

  const handleLoad = (template: CoverPageTemplate) => {
    onLoadTemplate(template.data);
    setPrimaryLineColor(template.data.primaryLineColor);
    setAccentLineColor(template.data.accentLineColor);
    onSelectTemplate(template);
    setLoadDialogOpen(false);
  };

  const handleClearSelection = () => {
    onSelectTemplate(null);
  };

  const handleDelete = async (id: string) => {
    await deleteTemplate(id);
    if (selectedTemplate?.id === id) {
      onSelectTemplate(null);
    }
  };

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled className="gap-2">
          <Save className="h-4 w-4" />
          Sign in to save templates
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Selected Template Indicator */}
      {selectedTemplate && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Pencil className="h-3 w-3" />
            Editing: {selectedTemplate.name}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 w-6 p-0"
            title="Create new template instead"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        {/* Update or Save New */}
        {selectedTemplate ? (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleUpdate}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Update Template
          </Button>
        ) : null}

        {/* Save as New Template Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              {selectedTemplate ? "Save as New" : "Save Template"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save as New Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="e.g., Commercial Project Template"
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNew()}
                />
              </div>
              <Button onClick={handleSaveNew} disabled={!templateName.trim() || isSaving} className="w-full">
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
              Load Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Load Template</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {loading ? (
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
                      className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedTemplate?.id === template.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <button
                        onClick={() => handleLoad(template)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium flex items-center gap-2">
                          {template.name}
                          {selectedTemplate?.id === template.id && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                      </button>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="flex gap-1">
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: template.data.primaryLineColor }}
                          />
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: template.data.accentLineColor }}
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
                                onClick={() => handleDelete(template.id)}
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
      </div>
    </div>
  );
};

export default TemplateManager;
