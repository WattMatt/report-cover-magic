import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { generateSummaryTableDocument } from "@/utils/generateTableDocument";

interface MetricItem {
  id: string;
  label: string;
  value: string;
  unit?: string;
}

const DEFAULT_METRICS: MetricItem[] = [
  { id: "1", label: "Total Connected Load", value: "1,250", unit: "kVA" },
  { id: "2", label: "Demand Factor", value: "0.75", unit: "" },
  { id: "3", label: "Calculated Demand", value: "937.5", unit: "kVA" },
  { id: "4", label: "Power Factor", value: "0.9", unit: "" },
  { id: "5", label: "Total Current", value: "1,302", unit: "A" },
  { id: "6", label: "Service Size", value: "1,600", unit: "A" },
  { id: "7", label: "Spare Capacity", value: "22.9", unit: "%" },
];

const SummaryTablePage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [tableTitle, setTableTitle] = useState("Project Summary");
  const [subtitle, setSubtitle] = useState("Key Metrics & Calculations");
  const [metrics, setMetrics] = useState<MetricItem[]>([...DEFAULT_METRICS]);

  const handleMetricChange = (index: number, field: keyof MetricItem, value: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: value };
    setMetrics(updated);
  };

  const addMetric = () => {
    setMetrics([...metrics, { id: crypto.randomUUID(), label: "New Metric", value: "0", unit: "" }]);
  };

  const removeMetric = (index: number) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setTableTitle("Project Summary");
    setSubtitle("Key Metrics & Calculations");
    setMetrics([...DEFAULT_METRICS]);
    toast.success("Reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateSummaryTableDocument({
        title: tableTitle,
        subtitle,
        metrics,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Summary table downloaded!");
    } catch (error) {
      console.error("Error generating document:", error);
      toast.error("Failed to generate document");
    }
  };

  useKeyboardShortcuts({
    onReset: handleReset,
    onDownload: handleDownload,
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Summary Table</h1>
            <p className="text-muted-foreground mt-1">Display key metrics and values</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Table Settings</h2>
              
              <div className="space-y-2">
                <Label>Table Title</Label>
                <Input value={tableTitle} onChange={(e) => setTableTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Metrics</h2>
                <Button variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Metric
                </Button>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-auto">
                {metrics.map((metric, index) => (
                  <div key={metric.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input
                        value={metric.label}
                        onChange={(e) => handleMetricChange(index, "label", e.target.value)}
                        placeholder="Label"
                        className="col-span-2"
                      />
                      <div className="flex gap-1">
                        <Input
                          value={metric.value}
                          onChange={(e) => handleMetricChange(index, "value", e.target.value)}
                          placeholder="Value"
                        />
                        <Input
                          value={metric.unit || ""}
                          onChange={(e) => handleMetricChange(index, "unit", e.target.value)}
                          placeholder="Unit"
                          className="w-16"
                        />
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMetric(index)}
                      disabled={metrics.length <= 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-card rounded-lg border p-6">
            <div 
              className="bg-white rounded-lg p-6 shadow-sm"
              style={{ 
                borderTop: `4px solid ${primaryLineColor}`,
                borderBottom: `4px solid ${accentLineColor}` 
              }}
            >
              <h2 className="text-xl font-bold text-center mb-1" style={{ color: primaryLineColor }}>
                {tableTitle}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-6">{subtitle}</p>

              <div className="space-y-0">
                {metrics.map((metric, index) => (
                  <div
                    key={metric.id}
                    className="flex items-center justify-between py-3 px-4"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? `${primaryLineColor}08` : "transparent",
                      borderBottom: `1px solid ${primaryLineColor}20`
                    }}
                  >
                    <span className="font-medium text-gray-700">{metric.label}</span>
                    <span className="font-bold text-lg" style={{ color: primaryLineColor }}>
                      {metric.value}
                      {metric.unit && <span className="text-sm font-normal ml-1 text-gray-500">{metric.unit}</span>}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer decoration */}
              <div 
                className="mt-6 h-2 rounded-full"
                style={{ 
                  background: `linear-gradient(90deg, ${primaryLineColor}, ${accentLineColor})`
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SummaryTablePage;
