import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

interface CoverPageFormProps {
  projectName: string;
  setProjectName: (value: string) => void;
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
}

const CoverPageForm = ({
  projectName,
  setProjectName,
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
    </div>
  );
};

export default CoverPageForm;
