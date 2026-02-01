import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { generateTableOfContents } from "@/utils/generateTableOfContents";
import PageTemplateManager from "@/components/PageTemplateManager";
import { PageTemplate } from "@/hooks/useCloudPageTemplates";

interface TOCEntry {
  title: string;
  page: string;
}

interface TOCTemplateData {
  documentTitle: string;
  entries: TOCEntry[];
}

const DEFAULT_ENTRIES: TOCEntry[] = [
  { title: "Executive Summary", page: "3" },
  { title: "1. Introduction", page: "5" },
  { title: "2. Scope of Work", page: "7" },
  { title: "3. Electrical Load Analysis", page: "10" },
  { title: "4. Distribution System Design", page: "15" },
  { title: "5. Calculations & Results", page: "20" },
  { title: "6. Recommendations", page: "25" },
  { title: "Appendix A - Load Schedules", page: "28" },
  { title: "Appendix B - Single Line Diagrams", page: "32" },
];

const TableOfContentsPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [documentTitle, setDocumentTitle] = useState("Table of Contents");
  const [entries, setEntries] = useState<TOCEntry[]>(DEFAULT_ENTRIES);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate<TOCTemplateData> | null>(null);

  const updateEntry = (index: number, field: keyof TOCEntry, value: string) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addEntry = () => {
    setEntries([...entries, { title: "", page: "" }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setDocumentTitle("Table of Contents");
    setEntries([...DEFAULT_ENTRIES]);
    toast.success("Form reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateTableOfContents({
        documentTitle,
        entries,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Document downloaded!");
    } catch (error) {
      toast.error("Failed to generate document");
      console.error(error);
    }
  };

  const getCurrentData = (): TOCTemplateData => ({
    documentTitle,
    entries,
  });

  const handleLoadTemplate = (data: TOCTemplateData) => {
    setDocumentTitle(data.documentTitle);
    setEntries(data.entries);
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Table of Contents
                </h2>
                <p className="text-muted-foreground">
                  Add and organize your document sections.
                </p>
              </div>
              <PageTemplateManager<TOCTemplateData>
                pageType="toc"
                currentData={getCurrentData()}
                onLoadTemplate={handleLoadTemplate}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="Table of Contents"
                />
              </div>

              <div className="space-y-3">
                <Label>Entries</Label>
                {entries.map((entry, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={entry.title}
                      onChange={(e) => updateEntry(index, "title", e.target.value)}
                      placeholder="Section title"
                      className="flex-1"
                    />
                    <Input
                      value={entry.page}
                      onChange={(e) => updateEntry(index, "page", e.target.value)}
                      placeholder="Page"
                      className="w-20"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntry(index)}
                      className="text-destructive"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addEntry} className="w-full">
                  + Add Entry
                </Button>
              </div>

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={handleReset} className="flex-1">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button className="flex-[2]" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Live Preview
              </h2>
              <p className="text-muted-foreground">
                See how your table of contents will look.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-2xl rounded-lg overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2" style={{ backgroundColor: primaryLineColor }} />
                
                <div className="p-8 pt-6 h-full flex flex-col">
                  <h1
                    className="text-2xl font-bold text-center mb-6 uppercase tracking-wide"
                    style={{ color: primaryLineColor }}
                  >
                    {documentTitle}
                  </h1>

                  <div className="h-1 mb-6" style={{ backgroundColor: primaryLineColor }} />

                  <div className="space-y-2 flex-1 overflow-auto">
                    {entries.map((entry, index) => (
                      <div key={index} className="flex items-end">
                        <span className="text-sm text-foreground">{entry.title}</span>
                        <span
                          className="flex-1 border-b border-dotted mx-2"
                          style={{ borderColor: accentLineColor }}
                        />
                        <span className="text-sm font-medium" style={{ color: primaryLineColor }}>
                          {entry.page}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-1 mt-6" style={{ backgroundColor: accentLineColor }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContentsPage;
