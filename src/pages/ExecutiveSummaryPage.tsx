import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { generateExecutiveSummary } from "@/utils/generateExecutiveSummary";

const DEFAULTS = {
  title: "Executive Summary",
  projectName: "Central Plaza Shopping Centre",
  summaryText: `This report presents the electrical load estimate for the proposed retail development at Central Plaza Shopping Centre.

Key findings include:
• Total connected load: 2,450 kVA
• Maximum demand: 1,960 kVA (80% diversity)
• Recommended supply: 2,500 kVA transformer capacity

The analysis indicates that the existing infrastructure will require upgrades to accommodate the projected electrical demands of the development.`,
  highlights: [
    { label: "Total Load", value: "2,450 kVA" },
    { label: "Max Demand", value: "1,960 kVA" },
    { label: "Supply Rating", value: "2,500 kVA" },
  ],
};

const ExecutiveSummaryPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [title, setTitle] = useState(DEFAULTS.title);
  const [projectName, setProjectName] = useState(DEFAULTS.projectName);
  const [summaryText, setSummaryText] = useState(DEFAULTS.summaryText);
  const [highlights, setHighlights] = useState([...DEFAULTS.highlights]);

  const updateHighlight = (index: number, field: "label" | "value", value: string) => {
    const newHighlights = [...highlights];
    newHighlights[index][field] = value;
    setHighlights(newHighlights);
  };

  const handleReset = () => {
    setTitle(DEFAULTS.title);
    setProjectName(DEFAULTS.projectName);
    setSummaryText(DEFAULTS.summaryText);
    setHighlights([...DEFAULTS.highlights]);
    toast.success("Form reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateExecutiveSummary({
        title,
        projectName,
        summaryText,
        highlights,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Document downloaded!");
    } catch (error) {
      toast.error("Failed to generate document");
      console.error(error);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Executive Summary
              </h2>
              <p className="text-muted-foreground">
                Create a professional summary page for your report.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Summary Content</Label>
                <Textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label>Key Highlights</Label>
                {highlights.map((h, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={h.label}
                      onChange={(e) => updateHighlight(index, "label", e.target.value)}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      value={h.value}
                      onChange={(e) => updateHighlight(index, "value", e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                  </div>
                ))}
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
                See how your executive summary will look.
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
                    className="text-2xl font-bold text-center mb-2 uppercase tracking-wide"
                    style={{ color: primaryLineColor }}
                  >
                    {title}
                  </h1>
                  <p className="text-center text-sm text-muted-foreground mb-4">{projectName}</p>

                  <div className="h-0.5 mb-4" style={{ backgroundColor: accentLineColor }} />

                  {/* Key Highlights */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {highlights.map((h, index) => (
                      <div
                        key={index}
                        className="text-center p-2 rounded border"
                        style={{ borderColor: primaryLineColor }}
                      >
                        <div className="text-xs text-muted-foreground">{h.label}</div>
                        <div
                          className="text-sm font-bold"
                          style={{ color: primaryLineColor }}
                        >
                          {h.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-0.5 mb-4" style={{ backgroundColor: primaryLineColor, opacity: 0.3 }} />

                  {/* Summary Text */}
                  <div className="flex-1 overflow-auto text-xs text-foreground whitespace-pre-line leading-relaxed">
                    {summaryText}
                  </div>

                  <div className="h-1 mt-4" style={{ backgroundColor: accentLineColor }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryPage;
