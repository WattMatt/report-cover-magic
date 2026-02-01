import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { generateSectionDivider } from "@/utils/generateSectionDivider";
import PageTemplateManager from "@/components/PageTemplateManager";
import { PageTemplate } from "@/hooks/useCloudPageTemplates";

interface SectionDividerTemplateData {
  sectionNumber: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

const DEFAULTS = {
  sectionNumber: "Section 1",
  sectionTitle: "Introduction",
  sectionSubtitle: "Project Overview & Background",
};

const SectionDividerPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [sectionNumber, setSectionNumber] = useState(DEFAULTS.sectionNumber);
  const [sectionTitle, setSectionTitle] = useState(DEFAULTS.sectionTitle);
  const [sectionSubtitle, setSectionSubtitle] = useState(DEFAULTS.sectionSubtitle);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate<SectionDividerTemplateData> | null>(null);

  const handleReset = () => {
    setSectionNumber(DEFAULTS.sectionNumber);
    setSectionTitle(DEFAULTS.sectionTitle);
    setSectionSubtitle(DEFAULTS.sectionSubtitle);
    toast.success("Form reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateSectionDivider({
        sectionNumber,
        sectionTitle,
        sectionSubtitle,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Document downloaded!");
    } catch (error) {
      toast.error("Failed to generate document");
      console.error(error);
    }
  };

  const getCurrentData = (): SectionDividerTemplateData => ({
    sectionNumber,
    sectionTitle,
    sectionSubtitle,
  });

  const handleLoadTemplate = (data: SectionDividerTemplateData) => {
    setSectionNumber(data.sectionNumber);
    setSectionTitle(data.sectionTitle);
    setSectionSubtitle(data.sectionSubtitle);
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
                  Section Divider
                </h2>
                <p className="text-muted-foreground">
                  Create full-page section headers for your report.
                </p>
              </div>
              <PageTemplateManager<SectionDividerTemplateData>
                pageType="section_divider"
                currentData={getCurrentData()}
                onLoadTemplate={handleLoadTemplate}
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
              />
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border space-y-4">
              <div className="space-y-2">
                <Label>Section Number/Label</Label>
                <Input
                  value={sectionNumber}
                  onChange={(e) => setSectionNumber(e.target.value)}
                  placeholder="e.g., Section 1, Appendix A"
                />
              </div>

              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Main section title"
                />
              </div>

              <div className="space-y-2">
                <Label>Section Subtitle (optional)</Label>
                <Input
                  value={sectionSubtitle}
                  onChange={(e) => setSectionSubtitle(e.target.value)}
                  placeholder="Brief description"
                />
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
                See how your section divider will look.
              </p>
            </div>

            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-[500px] aspect-[1/1.414] bg-white shadow-2xl rounded-lg overflow-hidden"
              >
                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-3" style={{ backgroundColor: primaryLineColor }} />
                
                {/* Left accent bar */}
                <div
                  className="absolute top-0 left-0 w-3 h-full"
                  style={{ backgroundColor: accentLineColor }}
                />

                <div className="p-12 pl-16 h-full flex flex-col justify-center">
                  {/* Section number */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-4"
                  >
                    <span
                      className="text-lg font-medium uppercase tracking-widest"
                      style={{ color: accentLineColor }}
                    >
                      {sectionNumber}
                    </span>
                  </motion.div>

                  {/* Main title */}
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl font-bold uppercase tracking-wide mb-4"
                    style={{ color: primaryLineColor }}
                  >
                    {sectionTitle}
                  </motion.h1>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.2 }}
                    className="w-32 h-1 mb-4 origin-left"
                    style={{ backgroundColor: accentLineColor }}
                  />

                  {/* Subtitle */}
                  {sectionSubtitle && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg text-muted-foreground italic"
                    >
                      {sectionSubtitle}
                    </motion.p>
                  )}
                </div>

                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-2"
                  style={{ backgroundColor: primaryLineColor }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionDividerPage;
