import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Palette } from "lucide-react";

const COLOR_THEMES = [
  { name: "Corporate Blue", primary: "#1565C0", accent: "#D4A853" },
  { name: "Elegant Gold", primary: "#B8860B", accent: "#1A1A1A" },
  { name: "Modern Green", primary: "#2E7D32", accent: "#FFB300" },
  { name: "Executive Gray", primary: "#455A64", accent: "#78909C" },
  { name: "Royal Purple", primary: "#6A1B9A", accent: "#E1BEE7" },
  { name: "Warm Terracotta", primary: "#BF360C", accent: "#FFAB91" },
];

interface CoverPageFormProps {
  reportTitle: string;
  setReportTitle: (value: string) => void;
  projectName: string;
  setProjectName: (value: string) => void;
  projectSubtitle: string;
  setProjectSubtitle: (value: string) => void;
  projectLocation: string;
  setProjectLocation: (value: string) => void;
  clientName: string;
  setClientName: (value: string) => void;
  documentNumber: string;
  setDocumentNumber: (value: string) => void;
  revision: string;
  setRevision: (value: string) => void;
  preparedBy: string;
  setPreparedBy: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  customLogo: string | null;
  setCustomLogo: (value: string | null) => void;
  primaryLineColor: string;
  setPrimaryLineColor: (value: string) => void;
  accentLineColor: string;
  setAccentLineColor: (value: string) => void;
}

const CoverPageForm = ({
  reportTitle,
  setReportTitle,
  projectName,
  setProjectName,
  projectSubtitle,
  setProjectSubtitle,
  projectLocation,
  setProjectLocation,
  clientName,
  setClientName,
  documentNumber,
  setDocumentNumber,
  revision,
  setRevision,
  preparedBy,
  setPreparedBy,
  date,
  setDate,
  customLogo,
  setCustomLogo,
  primaryLineColor,
  setPrimaryLineColor,
  accentLineColor,
  setAccentLineColor,
}: CoverPageFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCustomLogo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="space-y-4">
      {/* Logo Upload Section */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Company Logo
        </Label>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
          />
          {customLogo ? (
            <div className="flex items-center gap-3 w-full">
              <div className="h-12 w-20 bg-muted rounded-md overflow-hidden flex items-center justify-center border border-border">
                <img
                  src={customLogo}
                  alt="Custom logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-sm text-muted-foreground flex-1 truncate">
                Custom logo uploaded
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveLogo}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
              Upload custom logo
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Leave empty to use the default WM logo
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reportTitle" className="text-sm font-medium text-foreground">
          Report Title
        </Label>
        <Textarea
          id="reportTitle"
          value={reportTitle}
          onChange={(e) => setReportTitle(e.target.value)}
          placeholder="e.g., Electrical Load&#10;Estimate Report"
          className="bg-card border-border focus:ring-primary resize-none"
          rows={2}
        />
        <p className="text-xs text-muted-foreground">
          Use Enter/newline to split into multiple lines
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectName" className="text-sm font-medium text-foreground">
          Project Name
        </Label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name"
          className="bg-card border-border focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectSubtitle" className="text-sm font-medium text-foreground">
          Project Subtitle
        </Label>
        <Input
          id="projectSubtitle"
          value={projectSubtitle}
          onChange={(e) => setProjectSubtitle(e.target.value)}
          placeholder="e.g., Retail Development"
          className="bg-card border-border focus:ring-primary"
        />
        <p className="text-xs text-muted-foreground">
          Displayed in italics below the project name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="projectLocation" className="text-sm font-medium text-foreground">
          Project Location
        </Label>
        <Input
          id="projectLocation"
          value={projectLocation}
          onChange={(e) => setProjectLocation(e.target.value)}
          placeholder="Enter project location"
          className="bg-card border-border focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientName" className="text-sm font-medium text-foreground">
          Client Name
        </Label>
        <Input
          id="clientName"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
          className="bg-card border-border focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="documentNumber" className="text-sm font-medium text-foreground">
            Document Number
          </Label>
          <Input
            id="documentNumber"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            placeholder="e.g., ELE-001"
            className="bg-card border-border focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="revision" className="text-sm font-medium text-foreground">
            Revision
          </Label>
          <Input
            id="revision"
            value={revision}
            onChange={(e) => setRevision(e.target.value)}
            placeholder="e.g., Rev A"
            className="bg-card border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preparedBy" className="text-sm font-medium text-foreground">
          Prepared By
        </Label>
        <Input
          id="preparedBy"
          value={preparedBy}
          onChange={(e) => setPreparedBy(e.target.value)}
          placeholder="Enter preparer name"
          className="bg-card border-border focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium text-foreground">
          Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-card border-border focus:ring-primary"
        />
      </div>

      {/* Color Theme Presets */}
      <div className="pt-4 border-t border-border">
        <Label className="text-sm font-medium text-foreground mb-3 block">
          <Palette className="inline-block h-4 w-4 mr-1.5 -mt-0.5" />
          Color Themes
        </Label>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {COLOR_THEMES.map((theme) => (
            <button
              key={theme.name}
              type="button"
              onClick={() => {
                setPrimaryLineColor(theme.primary);
                setAccentLineColor(theme.accent);
              }}
              className={`relative p-2 rounded-lg border transition-all hover:scale-105 ${
                primaryLineColor === theme.primary && accentLineColor === theme.accent
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-muted-foreground"
              }`}
            >
              <div className="flex gap-1 mb-1.5 justify-center">
                <div
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: theme.primary }}
                />
                <div
                  className="w-5 h-5 rounded-full border border-border"
                  style={{ backgroundColor: theme.accent }}
                />
              </div>
              <span className="text-xs text-muted-foreground block truncate">
                {theme.name}
              </span>
            </button>
          ))}
        </div>

        <Label className="text-xs text-muted-foreground mb-2 block">
          Or customize manually:
        </Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryLineColor" className="text-xs text-muted-foreground">
              Primary Lines
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="primaryLineColor"
                type="color"
                value={primaryLineColor}
                onChange={(e) => setPrimaryLineColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-border"
              />
              <Input
                value={primaryLineColor}
                onChange={(e) => setPrimaryLineColor(e.target.value)}
                className="bg-card border-border focus:ring-primary font-mono text-sm uppercase"
                placeholder="#1565C0"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentLineColor" className="text-xs text-muted-foreground">
              Accent Lines
            </Label>
            <div className="flex items-center gap-2">
              <input
                id="accentLineColor"
                type="color"
                value={accentLineColor}
                onChange={(e) => setAccentLineColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-border"
              />
              <Input
                value={accentLineColor}
                onChange={(e) => setAccentLineColor(e.target.value)}
                className="bg-card border-border focus:ring-primary font-mono text-sm uppercase"
                placeholder="#D4A853"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverPageForm;
