import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
}: CoverPageFormProps) => {
  return (
    <div className="space-y-4">
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
