import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface FeatureRow {
  id: string;
  feature: string;
  values: ("yes" | "no" | "partial" | string)[];
}

const DEFAULT_OPTIONS = ["Option A", "Option B", "Option C"];
const DEFAULT_FEATURES: FeatureRow[] = [
  { id: "1", feature: "Energy Efficient", values: ["yes", "yes", "partial"] },
  { id: "2", feature: "Low Maintenance", values: ["yes", "partial", "yes"] },
  { id: "3", feature: "Quick Installation", values: ["no", "yes", "yes"] },
  { id: "4", feature: "Warranty Included", values: ["yes", "yes", "no"] },
  { id: "5", feature: "Cost Effective", values: ["partial", "yes", "yes"] },
];

const ComparisonTablePage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [tableTitle, setTableTitle] = useState("Feature Comparison");
  const [options, setOptions] = useState<string[]>([...DEFAULT_OPTIONS]);
  const [features, setFeatures] = useState<FeatureRow[]>([...DEFAULT_FEATURES]);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updated = [...features];
    updated[index].feature = value;
    setFeatures(updated);
  };

  const handleValueChange = (rowIndex: number, colIndex: number, value: string) => {
    const updated = [...features];
    updated[rowIndex].values[colIndex] = value;
    setFeatures(updated);
  };

  const addOption = () => {
    setOptions([...options, `Option ${options.length + 1}`]);
    setFeatures(features.map(f => ({ ...f, values: [...f.values, "no"] })));
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
      setFeatures(features.map(f => ({ ...f, values: f.values.filter((_, i) => i !== index) })));
    }
  };

  const addFeature = () => {
    setFeatures([...features, { id: crypto.randomUUID(), feature: "New Feature", values: options.map(() => "no") }]);
  };

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setTableTitle("Feature Comparison");
    setOptions([...DEFAULT_OPTIONS]);
    setFeatures([...DEFAULT_FEATURES]);
    toast.success("Reset to defaults");
  };

  const handleDownload = () => {
    toast.success("Comparison table downloaded!");
  };

  useKeyboardShortcuts({
    onReset: handleReset,
    onDownload: handleDownload,
  });

  const renderCellValue = (value: string) => {
    if (value === "yes") return <Check className="h-5 w-5 text-green-600 mx-auto" />;
    if (value === "no") return <X className="h-5 w-5 text-red-500 mx-auto" />;
    if (value === "partial") return <span className="text-amber-600 font-medium">Partial</span>;
    return <span>{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Comparison Table</h1>
            <p className="text-muted-foreground mt-1">Compare features across multiple options</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Settings */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2 flex-1 mr-4">
                <Label>Table Title</Label>
                <Input value={tableTitle} onChange={(e) => setTableTitle(e.target.value)} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="h-4 w-4 mr-1" />
                  Option
                </Button>
                <Button variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-1" />
                  Feature
                </Button>
              </div>
            </div>

            {/* Options Editor */}
            <div className="mb-4">
              <Label className="mb-2 block">Options to Compare</Label>
              <div className="flex gap-2 flex-wrap">
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                      disabled={options.length <= 2}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-3 w-3 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card rounded-lg border p-6">
            <div 
              className="bg-white rounded-lg p-6 shadow-sm overflow-auto"
              style={{ 
                borderTop: `4px solid ${primaryLineColor}`,
                borderBottom: `4px solid ${accentLineColor}` 
              }}
            >
              <h2 className="text-xl font-bold text-center mb-6" style={{ color: primaryLineColor }}>
                {tableTitle}
              </h2>

              <Table>
                <TableHeader>
                  <TableRow style={{ backgroundColor: `${primaryLineColor}15` }}>
                    <TableHead className="font-bold" style={{ color: primaryLineColor }}>Feature</TableHead>
                    {options.map((option, index) => (
                      <TableHead key={index} className="font-bold text-center" style={{ color: primaryLineColor }}>
                        {option}
                      </TableHead>
                    ))}
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {features.map((row, rowIndex) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Input
                          value={row.feature}
                          onChange={(e) => handleFeatureChange(rowIndex, e.target.value)}
                          className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 font-medium"
                        />
                      </TableCell>
                      {row.values.map((value, colIndex) => (
                        <TableCell key={colIndex} className="text-center">
                          <Select 
                            value={value} 
                            onValueChange={(v) => handleValueChange(rowIndex, colIndex, v)}
                          >
                            <SelectTrigger className="w-24 mx-auto">
                              <SelectValue>{renderCellValue(value)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="yes">
                                <div className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-green-600" /> Yes
                                </div>
                              </SelectItem>
                              <SelectItem value="no">
                                <div className="flex items-center gap-2">
                                  <X className="h-4 w-4 text-red-500" /> No
                                </div>
                              </SelectItem>
                              <SelectItem value="partial">Partial</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(rowIndex)}
                          disabled={features.length <= 1}
                          className="h-6 w-6"
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ComparisonTablePage;
