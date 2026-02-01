import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Plus, Trash2, RotateCcw } from "lucide-react";
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
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { generateDataTableDocument } from "@/utils/generateTableDocument";

interface TableRowData {
  id: string;
  values: string[];
}

const DEFAULT_HEADERS = ["Item", "Description", "Quantity", "Unit", "Notes"];
const DEFAULT_ROWS: TableRowData[] = [
  { id: "1", values: ["Panel A", "Main Distribution Panel", "1", "EA", "480V/277V"] },
  { id: "2", values: ["Panel B", "Lighting Panel", "2", "EA", "208V/120V"] },
  { id: "3", values: ["Transformer", "75 kVA Dry Type", "1", "EA", "480V to 208V"] },
  { id: "4", values: ["Conduit", "EMT 3/4\"", "500", "LF", "For branch circuits"] },
  { id: "5", values: ["Wire", "12 AWG THHN", "2000", "LF", "Branch circuit wiring"] },
];

const DataTablePage = () => {
  const { primaryLineColor, accentLineColor } = useTheme();
  const [tableTitle, setTableTitle] = useState("Equipment Schedule");
  const [headers, setHeaders] = useState<string[]>([...DEFAULT_HEADERS]);
  const [rows, setRows] = useState<TableRowData[]>([...DEFAULT_ROWS]);

  const handleHeaderChange = (index: number, value: string) => {
    const updated = [...headers];
    updated[index] = value;
    setHeaders(updated);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const updated = [...rows];
    updated[rowIndex].values[colIndex] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { id: crypto.randomUUID(), values: headers.map(() => "") }]);
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const addColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setRows(rows.map(row => ({ ...row, values: [...row.values, ""] })));
  };

  const removeColumn = (index: number) => {
    if (headers.length > 1) {
      setHeaders(headers.filter((_, i) => i !== index));
      setRows(rows.map(row => ({ ...row, values: row.values.filter((_, i) => i !== index) })));
    }
  };

  const handleReset = () => {
    setTableTitle("Equipment Schedule");
    setHeaders([...DEFAULT_HEADERS]);
    setRows([...DEFAULT_ROWS]);
    toast.success("Reset to defaults");
  };

  const handleDownload = async () => {
    try {
      await generateDataTableDocument({
        title: tableTitle,
        headers,
        rows,
        primaryLineColor,
        accentLineColor,
      });
      toast.success("Table document downloaded!");
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
            <h1 className="text-3xl font-bold text-foreground">Data Table Page</h1>
            <p className="text-muted-foreground mt-1">Create customizable data tables for your reports</p>
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
                <Button variant="outline" size="sm" onClick={addColumn}>
                  <Plus className="h-4 w-4 mr-1" />
                  Column
                </Button>
                <Button variant="outline" size="sm" onClick={addRow}>
                  <Plus className="h-4 w-4 mr-1" />
                  Row
                </Button>
              </div>
            </div>

            {/* Headers Editor */}
            <div className="mb-4">
              <Label className="mb-2 block">Column Headers</Label>
              <div className="flex gap-2 flex-wrap">
                {headers.map((header, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      value={header}
                      onChange={(e) => handleHeaderChange(index, e.target.value)}
                      className="w-32"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeColumn(index)}
                      disabled={headers.length <= 1}
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
                    {headers.map((header, index) => (
                      <TableHead key={index} className="font-bold" style={{ color: primaryLineColor }}>
                        {header}
                      </TableHead>
                    ))}
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row, rowIndex) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.values.map((value, colIndex) => (
                        <TableCell key={colIndex}>
                          <Input
                            value={value}
                            onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                            className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0"
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeRow(rowIndex)}
                          disabled={rows.length <= 1}
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

export default DataTablePage;
