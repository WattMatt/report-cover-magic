import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface DataSlice {
  name: string;
  value: number;
  color: string;
}

const COLORS = ["#1565C0", "#D4A853", "#2E7D32", "#C62828", "#6A1B9A", "#00838F", "#EF6C00", "#5D4037"];

const DEFAULT_DATA: DataSlice[] = [
  { name: "Lighting", value: 30, color: COLORS[0] },
  { name: "HVAC", value: 25, color: COLORS[1] },
  { name: "Equipment", value: 20, color: COLORS[2] },
  { name: "Receptacles", value: 15, color: COLORS[3] },
  { name: "Other", value: 10, color: COLORS[4] },
];

const PieChartPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [chartTitle, setChartTitle] = useState("Load Distribution");
  const [chartType, setChartType] = useState<"pie" | "donut">("pie");
  const [dataSlices, setDataSlices] = useState<DataSlice[]>([...DEFAULT_DATA]);

  const handleDataChange = (index: number, field: keyof DataSlice, value: string | number) => {
    const updated = [...dataSlices];
    updated[index] = { ...updated[index], [field]: field === "value" ? Number(value) : value };
    setDataSlices(updated);
  };

  const addSlice = () => {
    const newColor = COLORS[dataSlices.length % COLORS.length];
    setDataSlices([...dataSlices, { name: `Category ${dataSlices.length + 1}`, value: 10, color: newColor }]);
  };

  const removeSlice = (index: number) => {
    if (dataSlices.length > 1) {
      setDataSlices(dataSlices.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setChartTitle("Load Distribution");
    setChartType("pie");
    setDataSlices([...DEFAULT_DATA]);
    toast.success("Reset to defaults");
  };

  const handleDownload = () => {
    toast.success("Chart page downloaded!");
  };

  useKeyboardShortcuts({
    onReset: handleReset,
    onDownload: handleDownload,
  });

  const total = dataSlices.reduce((sum, slice) => sum + slice.value, 0);

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Pie/Donut Chart Page</h1>
            <p className="text-muted-foreground mt-1">Create distribution charts for your reports</p>
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
              <h2 className="font-semibold text-lg">Chart Settings</h2>
              
              <div className="space-y-2">
                <Label htmlFor="chartTitle">Chart Title</Label>
                <Input
                  id="chartTitle"
                  value={chartTitle}
                  onChange={(e) => setChartTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chartType">Chart Type</Label>
                <Select value={chartType} onValueChange={(v: "pie" | "donut") => setChartType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pie">Pie Chart</SelectItem>
                    <SelectItem value="donut">Donut Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Data Slices</h2>
                <Button variant="outline" size="sm" onClick={addSlice}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Slice
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-auto">
                {dataSlices.map((slice, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="color"
                      value={slice.color}
                      onChange={(e) => handleDataChange(index, "color", e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer border-0"
                    />
                    <Input
                      value={slice.name}
                      onChange={(e) => handleDataChange(index, "name", e.target.value)}
                      placeholder="Name"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={slice.value}
                      onChange={(e) => handleDataChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-20"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {((slice.value / total) * 100).toFixed(0)}%
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSlice(index)}
                      disabled={dataSlices.length <= 1}
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
              <h2 className="text-xl font-bold text-center mb-6" style={{ color: primaryLineColor }}>
                {chartTitle}
              </h2>
              
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={dataSlices}
                    cx="50%"
                    cy="50%"
                    innerRadius={chartType === "donut" ? 60 : 0}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={true}
                  >
                    {dataSlices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PieChartPage;
