import { useState } from "react";
import { motion } from "framer-motion";
import { Download, FileText, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverPagePreview from "@/components/CoverPagePreview";
import CoverPageForm from "@/components/CoverPageForm";
import { generateWordDocument } from "@/utils/generateWordDocument";
import { toast } from "sonner";
import wmLogo from "@/assets/wm-logo.jpg";

const Index = () => {
  const [projectName, setProjectName] = useState("Central Plaza Shopping Centre");
  const [projectLocation, setProjectLocation] = useState("123 Main Street, Sydney NSW 2000");
  const [clientName, setClientName] = useState("ABC Developments Pty Ltd");
  const [documentNumber, setDocumentNumber] = useState("ELE-RPT-001");
  const [revision, setRevision] = useState("Rev A");
  const [preparedBy, setPreparedBy] = useState("WM Engineering");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      let logoBase64: string;

      if (customLogo) {
        // Use custom logo directly (already base64)
        logoBase64 = customLogo;
      } else {
        // Convert default logo to base64
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
          projectName,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-cover-gradient text-cover-text-light py-6 px-8 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Cover Page Generator</h1>
              <p className="text-sm text-white/70">Electrical Load Estimate Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <FileText className="h-4 w-4" />
            <span>Word Document Export</span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Document Details
              </h2>
              <p className="text-muted-foreground">
                Fill in the project information to customize your cover page.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-lg border border-border">
              <CoverPageForm
                projectName={projectName}
                setProjectName={setProjectName}
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
                customLogo={customLogo}
                setCustomLogo={setCustomLogo}
              />

              <Button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
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
                projectName={projectName}
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
              />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary/50 border-t border-border py-6 px-8 mt-10">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WM Engineering. Professional Document Solutions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
