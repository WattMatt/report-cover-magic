import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { generateDocumentHistory } from "@/utils/generateDocumentHistory";
import PageTemplateManager from "@/components/PageTemplateManager";

interface RevisionEntry {
  revision: string;
  date: string;
  author: string;
  description: string;
}

interface DocumentHistoryTemplateData {
  title: string;
  revisions: RevisionEntry[];
}

const DEFAULT_REVISIONS: RevisionEntry[] = [
  { revision: "A", date: "15 Jan 2026", author: "J. Smith", description: "Initial issue for review" },
  { revision: "B", date: "22 Jan 2026", author: "J. Smith", description: "Incorporated client comments" },
  { revision: "C", date: "30 Jan 2026", author: "M. Jones", description: "Final issue for construction" },
];

const DocumentHistoryPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [title, setTitle] = useState("Document Revision History");
  const [revisions, setRevisions] = useState<RevisionEntry[]>([...DEFAULT_REVISIONS]);

  const updateRevision = (index: number, field: keyof RevisionEntry, value: string) => {
    const newRevisions = [...revisions];
    newRevisions[index][field] = value;
    setRevisions(newRevisions);
  };

  const addRevision = () => {
    setRevisions([...revisions, { revision: "", date: "", author: "", description: "" }]);
  };

  const removeRevision = (index: number) => {
    setRevisions(revisions.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    setTitle("Document Revision History");
    setRevisions([...DEFAULT_REVISIONS]);
    toast.success("Form reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateDocumentHistory({
        title,
        revisions,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Document downloaded!");
    } catch (error) {
      toast.error("Failed to generate document");
      console.error(error);
    }
  };

  const getCurrentData = (): DocumentHistoryTemplateData => ({
    title,
    revisions,
  });

  const handleLoadTemplate = (data: DocumentHistoryTemplateData) => {
    setTitle(data.title);
    setRevisions(data.revisions);
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
                  Document History
                </h2>
                <p className="text-muted-foreground">
                  Track revisions with dates and authors.
                </p>
              </div>
              <PageTemplateManager<DocumentHistoryTemplateData>
                pageType="document_history"
                currentData={getCurrentData()}
                onLoadTemplate={handleLoadTemplate}
              />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <Label>Revision Entries</Label>
                {revisions.map((rev, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={rev.revision}
                        onChange={(e) => updateRevision(index, "revision", e.target.value)}
                        placeholder="Rev"
                        className="w-16"
                      />
                      <Input
                        value={rev.date}
                        onChange={(e) => updateRevision(index, "date", e.target.value)}
                        placeholder="Date"
                        className="flex-1"
                      />
                      <Input
                        value={rev.author}
                        onChange={(e) => updateRevision(index, "author", e.target.value)}
                        placeholder="Author"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRevision(index)}
                        className="text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Input
                      value={rev.description}
                      onChange={(e) => updateRevision(index, "description", e.target.value)}
                      placeholder="Description of changes"
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={addRevision} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Revision
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
                See how your document history will look.
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
                    className="text-xl font-bold text-center mb-6 uppercase tracking-wide"
                    style={{ color: primaryLineColor }}
                  >
                    {title}
                  </h1>

                  <div className="h-0.5 mb-6" style={{ backgroundColor: primaryLineColor }} />

                  {/* Table Header */}
                  <div
                    className="grid grid-cols-12 gap-1 text-xs font-bold uppercase tracking-wide p-2 rounded-t"
                    style={{ backgroundColor: primaryLineColor, color: "white" }}
                  >
                    <div className="col-span-2">Rev</div>
                    <div className="col-span-3">Date</div>
                    <div className="col-span-3">Author</div>
                    <div className="col-span-4">Description</div>
                  </div>

                  {/* Table Body */}
                  <div className="flex-1 overflow-auto border-x border-b rounded-b" style={{ borderColor: primaryLineColor }}>
                    {revisions.map((rev, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-12 gap-1 text-xs p-2 border-b last:border-b-0"
                        style={{
                          borderColor: `${primaryLineColor}30`,
                          backgroundColor: index % 2 === 0 ? "transparent" : `${accentLineColor}10`,
                        }}
                      >
                        <div className="col-span-2 font-medium" style={{ color: primaryLineColor }}>
                          {rev.revision}
                        </div>
                        <div className="col-span-3 text-muted-foreground">{rev.date}</div>
                        <div className="col-span-3">{rev.author}</div>
                        <div className="col-span-4 text-muted-foreground">{rev.description}</div>
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

export default DocumentHistoryPage;
