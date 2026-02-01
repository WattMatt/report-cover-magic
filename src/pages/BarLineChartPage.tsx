import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DataPoint {
  label: string;
  value: number;
}

const DEFAULT_DATA: DataPoint[] = [
  { label: "Jan", value: 4000 },
  { label: "Feb", value: 3000 },
  { label: "Mar", value: 5000 },
  { label: "Apr", value: 4500 },
  { label: "May", value: 6000 },
  { label: "Jun", value: 5500 },
];

const BarLineChartPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [chartTitle, setChartTitle] = useState("Monthly Performance");
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [xAxisLabel, setXAxisLabel] = useState("Month");
  const [yAxisLabel, setYAxisLabel] = useState("Value");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([...DEFAULT_DATA]);

  const handleDataChange = (index: number, field: keyof DataPoint, value: string | number) => {
    const updated = [...dataPoints];
    updated[index] = { ...updated[index], [field]: field === "value" ? Number(value) : value };
    setDataPoints(updated);
  };

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { label: `Point ${dataPoints.length + 1}`, value: 0 }]);
  };

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 1) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    setChartTitle("Monthly Performance");
    setChartType("bar");
    setXAxisLabel("Month");
    setYAxisLabel("Value");
    setDataPoints([...DEFAULT_DATA]);
    toast.success("Reset to defaults");
  };

  const handleDownload = () => {
    toast.success("Chart page downloaded!");
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
            <h1 className="text-3xl font-bold text-foreground">Bar/Line Chart Page</h1>
            <p className="text-muted-foreground mt-1">Create data visualizations for your reports</p>
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
                <Select value={chartType} onValueChange={(v: "bar" | "line") => setChartType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="xAxisLabel">X-Axis Label</Label>
                  <Input
                    id="xAxisLabel"
                    value={xAxisLabel}
                    onChange={(e) => setXAxisLabel(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yAxisLabel">Y-Axis Label</Label>
                  <Input
                    id="yAxisLabel"
                    value={yAxisLabel}
                    onChange={(e) => setYAxisLabel(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Data Points</h2>
                <Button variant="outline" size="sm" onClick={addDataPoint}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Point
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-auto">
                {dataPoints.map((point, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={point.label}
                      onChange={(e) => handleDataChange(index, "label", e.target.value)}
                      placeholder="Label"
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={point.value}
                      onChange={(e) => handleDataChange(index, "value", e.target.value)}
                      placeholder="Value"
                      className="w-24"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDataPoint(index)}
                      disabled={dataPoints.length <= 1}
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
              
              <ResponsiveContainer width="100%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" label={{ value: xAxisLabel, position: "bottom", offset: -5 }} />
                    <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill={primaryLineColor} />
                  </BarChart>
                ) : (
                  <LineChart data={dataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" label={{ value: xAxisLabel, position: "bottom", offset: -5 }} />
                    <YAxis label={{ value: yAxisLabel, angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke={primaryLineColor} strokeWidth={2} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BarLineChartPage;
