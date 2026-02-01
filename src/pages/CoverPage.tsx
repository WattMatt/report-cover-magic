import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverPagePreview from "@/components/CoverPagePreview";
import CoverPageForm from "@/components/CoverPageForm";
import TemplateManager from "@/components/TemplateManager";
import { generateWordDocument } from "@/utils/generateWordDocument";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { CoverPageTemplateData, CoverPageTemplate } from "@/hooks/useCloudTemplates";
import wmLogo from "@/assets/wm-logo.jpg";

const DEFAULTS = {
  reportTitle: "Electrical Load\nEstimate Report",
  projectName: "Central Plaza Shopping Centre",
  projectSubtitle: "Retail Development",
  projectLocation: "123 Main Street, Sydney NSW 2000",
  clientName: "ABC Developments Pty Ltd",
  documentNumber: "ELE-RPT-001",
  revision: "Rev A",
  preparedBy: "WM Engineering",
};

const CoverPage = () => {
  const { primaryLineColor, accentLineColor, customLogo } = useTheme();
  
  const [reportTitle, setReportTitle] = useState(DEFAULTS.reportTitle);
  const [projectName, setProjectName] = useState(DEFAULTS.projectName);
  const [projectSubtitle, setProjectSubtitle] = useState(DEFAULTS.projectSubtitle);
  const [projectLocation, setProjectLocation] = useState(DEFAULTS.projectLocation);
  const [clientName, setClientName] = useState(DEFAULTS.clientName);
  const [documentNumber, setDocumentNumber] = useState(DEFAULTS.documentNumber);
  const [revision, setRevision] = useState(DEFAULTS.revision);
  const [preparedBy, setPreparedBy] = useState(DEFAULTS.preparedBy);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CoverPageTemplate | null>(null);

  const handleReset = () => {
    setReportTitle(DEFAULTS.reportTitle);
    setProjectName(DEFAULTS.projectName);
    setProjectSubtitle(DEFAULTS.projectSubtitle);
    setProjectLocation(DEFAULTS.projectLocation);
    setClientName(DEFAULTS.clientName);
    setDocumentNumber(DEFAULTS.documentNumber);
    setRevision(DEFAULTS.revision);
    setPreparedBy(DEFAULTS.preparedBy);
    setDate(new Date().toISOString().split("T")[0]);
    toast.success("Form reset to defaults");
  };

  const getCurrentTemplateData = (): CoverPageTemplateData => ({
    reportTitle,
    projectName,
    projectSubtitle,
    projectLocation,
    clientName,
    documentNumber,
    revision,
    preparedBy,
    primaryLineColor,
    accentLineColor,
  });

  const handleLoadTemplate = (data: CoverPageTemplateData) => {
    setReportTitle(data.reportTitle);
    setProjectName(data.projectName);
    setProjectSubtitle(data.projectSubtitle);
    setProjectLocation(data.projectLocation);
    setClientName(data.clientName);
    setDocumentNumber(data.documentNumber);
    setRevision(data.revision);
    setPreparedBy(data.preparedBy);
    toast.success("Template loaded!");
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      let logoBase64: string;

      if (customLogo) {
        logoBase64 = customLogo;
      } else {
        const response = await fetch(wmLogo);
        const blob = await response.blob();
        logoBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      await generateWordDocument(
        {
          reportTitle,
          projectName,
          projectSubtitle,
          projectLocation,
          clientName,
          documentNumber,
          revision,
          preparedBy,
          date: new Date(date).toLocaleDateString("en-AU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          primaryLineColor,
          accentLineColor,
        },
        logoBase64
      );
      toast.success("Cover page downloaded successfully!");
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Cover Page
                </h2>
                <p className="text-muted-foreground">
                  Fill in the project information to customize your cover page.
                </p>
              </div>
            </div>

            <TemplateManager
              currentData={getCurrentTemplateData()}
              onLoadTemplate={handleLoadTemplate}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <CoverPageForm
                reportTitle={reportTitle}
                setReportTitle={setReportTitle}
                projectName={projectName}
                setProjectName={setProjectName}
                projectSubtitle={projectSubtitle}
                setProjectSubtitle={setProjectSubtitle}
                projectLocation={projectLocation}
                setProjectLocation={setProjectLocation}
                clientName={clientName}
                setClientName={setClientName}
                documentNumber={documentNumber}
                setDocumentNumber={setDocumentNumber}
                revision={revision}
                setRevision={setRevision}
                preparedBy={preparedBy}
                setPreparedBy={setPreparedBy}
                date={date}
                setDate={setDate}
              />

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 py-6"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="flex-[2] bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Download className="h-5 w-5" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Download Word Document
                  </>
                )}
              </Button>
              </div>
            </div>
          </motion.div>

          {/* Preview Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Live Preview
              </h2>
              <p className="text-muted-foreground">
                See how your cover page will look in real-time.
              </p>
            </div>

            <div className="flex justify-center">
              <CoverPagePreview
                reportTitle={reportTitle}
                projectName={projectName}
                projectSubtitle={projectSubtitle}
                projectLocation={projectLocation}
                clientName={clientName}
                documentNumber={documentNumber}
                revision={revision}
                preparedBy={preparedBy}
                date={new Date(date).toLocaleDateString("en-AU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
                customLogo={customLogo}
                primaryLineColor={primaryLineColor}
                accentLineColor={accentLineColor}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CoverPage;
