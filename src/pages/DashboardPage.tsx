import { useState } from "react";
import { motion } from "framer-motion";
import { Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "sonner";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { generateDashboardDocument } from "@/utils/generateDashboardDocument";

const DEFAULT_BAR_DATA = [
  { name: "Q1", value: 4000 },
  { name: "Q2", value: 3000 },
  { name: "Q3", value: 5000 },
  { name: "Q4", value: 4500 },
];

const DEFAULT_LINE_DATA = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
];

const DEFAULT_PIE_DATA = [
  { name: "Category A", value: 400, color: "#1565C0" },
  { name: "Category B", value: 300, color: "#D4A853" },
  { name: "Category C", value: 200, color: "#2E7D32" },
  { name: "Category D", value: 100, color: "#C62828" },
];

const DEFAULT_TABLE_DATA = [
  { id: 1, item: "Item A", quantity: 150, revenue: "$12,500", status: "Complete" },
  { id: 2, item: "Item B", quantity: 230, revenue: "$18,400", status: "In Progress" },
  { id: 3, item: "Item C", quantity: 89, revenue: "$7,120", status: "Complete" },
  { id: 4, item: "Item D", quantity: 312, revenue: "$24,960", status: "Pending" },
];

const DashboardPage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [dashboardTitle, setDashboardTitle] = useState("Performance Dashboard");
  const [barChartTitle, setBarChartTitle] = useState("Quarterly Results");
  const [lineChartTitle, setLineChartTitle] = useState("Monthly Trend");
  const [pieChartTitle, setPieChartTitle] = useState("Distribution");
  const [tableTitle, setTableTitle] = useState("Summary Data");
  const [metricValue, setMetricValue] = useState("$125,000");
  const [metricLabel, setMetricLabel] = useState("Total Revenue");

  const handleReset = () => {
    setDashboardTitle("Performance Dashboard");
    setBarChartTitle("Quarterly Results");
    setLineChartTitle("Monthly Trend");
    setPieChartTitle("Distribution");
    setTableTitle("Summary Data");
    setMetricValue("$125,000");
    setMetricLabel("Total Revenue");
    toast.success("Reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateDashboardDocument({
        dashboardTitle,
        barChartTitle,
        lineChartTitle,
        pieChartTitle,
        tableTitle,
        metricValue,
        metricLabel,
        barData: DEFAULT_BAR_DATA,
        lineData: DEFAULT_LINE_DATA,
        pieData: DEFAULT_PIE_DATA,
        tableData: DEFAULT_TABLE_DATA,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Dashboard document downloaded!");
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
            <h1 className="text-3xl font-bold text-foreground">Combined Dashboard</h1>
            <p className="text-muted-foreground mt-1">Create multi-chart dashboard pages</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-card rounded-lg border p-6 space-y-4">
              <h2 className="font-semibold text-lg">Dashboard Settings</h2>
              
              <div className="space-y-2">
                <Label>Dashboard Title</Label>
                <Input value={dashboardTitle} onChange={(e) => setDashboardTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Bar Chart Title</Label>
                <Input value={barChartTitle} onChange={(e) => setBarChartTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Line Chart Title</Label>
                <Input value={lineChartTitle} onChange={(e) => setLineChartTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Pie Chart Title</Label>
                <Input value={pieChartTitle} onChange={(e) => setPieChartTitle(e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Table Title</Label>
                <Input value={tableTitle} onChange={(e) => setTableTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Metric Value</Label>
                  <Input value={metricValue} onChange={(e) => setMetricValue(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Metric Label</Label>
                  <Input value={metricLabel} onChange={(e) => setMetricLabel(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 bg-card rounded-lg border p-6">
            <div 
              className="bg-white rounded-lg p-6 shadow-sm"
              style={{ 
                borderTop: `4px solid ${primaryLineColor}`,
                borderBottom: `4px solid ${accentLineColor}` 
              }}
            >
              <h2 className="text-2xl font-bold text-center mb-6" style={{ color: primaryLineColor }}>
                {dashboardTitle}
              </h2>

              {/* Key Metric */}
              <div className="text-center mb-6 p-4 rounded-lg" style={{ backgroundColor: `${primaryLineColor}10` }}>
                <div className="text-3xl font-bold" style={{ color: primaryLineColor }}>{metricValue}</div>
                <div className="text-sm text-gray-600">{metricLabel}</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: primaryLineColor }}>{barChartTitle}</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={DEFAULT_BAR_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill={primaryLineColor} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: primaryLineColor }}>{lineChartTitle}</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <LineChart data={DEFAULT_LINE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke={accentLineColor} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="font-semibold mb-3 text-sm text-center" style={{ color: primaryLineColor }}>{pieChartTitle}</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={DEFAULT_PIE_DATA}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      >
                        {DEFAULT_PIE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Data Table */}
                <div className="border rounded-lg p-4 md:col-span-2">
                  <h3 className="font-semibold mb-3 text-sm" style={{ color: primaryLineColor }}>{tableTitle}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs" style={{ color: primaryLineColor }}>Item</TableHead>
                        <TableHead className="text-xs text-right" style={{ color: primaryLineColor }}>Quantity</TableHead>
                        <TableHead className="text-xs text-right" style={{ color: primaryLineColor }}>Revenue</TableHead>
                        <TableHead className="text-xs text-right" style={{ color: primaryLineColor }}>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DEFAULT_TABLE_DATA.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-xs font-medium">{row.item}</TableCell>
                          <TableCell className="text-xs text-right">{row.quantity}</TableCell>
                          <TableCell className="text-xs text-right">{row.revenue}</TableCell>
                          <TableCell className="text-xs text-right">
                            <span 
                              className="px-2 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: row.status === "Complete" ? "#2E7D3220" : 
                                                 row.status === "In Progress" ? `${primaryLineColor}20` : 
                                                 `${accentLineColor}20`,
                                color: row.status === "Complete" ? "#2E7D32" : 
                                       row.status === "In Progress" ? primaryLineColor : 
                                       accentLineColor
                              }}
                            >
                              {row.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
