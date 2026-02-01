import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface BarDataPoint {
  name: string;
  value: number;
}

interface LineDataPoint {
  name: string;
  value: number;
}

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
}

interface TableDataRow {
  id: number;
  item: string;
  quantity: number;
  revenue: string;
  status: string;
}

interface DashboardData {
  dashboardTitle: string;
  barChartTitle: string;
  lineChartTitle: string;
  pieChartTitle: string;
  tableTitle: string;
  metricValue: string;
  metricLabel: string;
  barData: BarDataPoint[];
  lineData: LineDataPoint[];
  pieData: PieDataPoint[];
  tableData: TableDataRow[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateDashboardDocument = async (data: DashboardData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const maxBarValue = Math.max(...data.barData.map((d) => d.value));
  const maxLineValue = Math.max(...data.lineData.map((d) => d.value));
  const pieTotal = data.pieData.reduce((sum, d) => sum + d.value, 0);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.5),
              bottom: convertInchesToTwip(0.5),
              left: convertInchesToTwip(0.5),
              right: convertInchesToTwip(0.5),
            },
          },
        },
        children: [
          // Top decorative line
          new Paragraph({
            border: {
              bottom: {
                color: primaryColor,
                size: 24,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 300 },
            children: [],
          }),

          // Dashboard Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 300 },
            children: [
              new TextRun({
                text: data.dashboardTitle,
                bold: true,
                size: 44,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Key Metric Box
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: `${primaryColor}15` },
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1, color: primaryColor },
                      bottom: { style: BorderStyle.SINGLE, size: 1, color: primaryColor },
                      left: { style: BorderStyle.SINGLE, size: 1, color: primaryColor },
                      right: { style: BorderStyle.SINGLE, size: 1, color: primaryColor },
                    },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 150, after: 50 },
                        children: [
                          new TextRun({
                            text: data.metricValue,
                            bold: true,
                            size: 48,
                            color: primaryColor,
                            font: "Arial",
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 150 },
                        children: [
                          new TextRun({
                            text: data.metricLabel,
                            size: 20,
                            color: "666666",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Spacing
          new Paragraph({ spacing: { after: 300 }, children: [] }),

          // Bar Chart Section
          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: data.barChartTitle,
                bold: true,
                size: 28,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Period",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Value",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Chart",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.barData.map(
                (point, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: point.name,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: point.value.toLocaleString(),
                                size: 18,
                                font: "Arial",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "█".repeat(Math.round((point.value / maxBarValue) * 20)),
                                size: 18,
                                color: primaryColor,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Spacing
          new Paragraph({ spacing: { after: 300 }, children: [] }),

          // Line Chart Section
          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: data.lineChartTitle,
                bold: true,
                size: 28,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: accentColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Month",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: accentColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Value",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    shading: { fill: accentColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Trend",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.lineData.map(
                (point, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: point.name,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: point.value.toLocaleString(),
                                size: 18,
                                font: "Arial",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "─".repeat(Math.round((point.value / maxLineValue) * 20)) + "●",
                                size: 18,
                                color: accentColor,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Spacing
          new Paragraph({ spacing: { after: 300 }, children: [] }),

          // Pie Chart Section
          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: data.pieChartTitle,
                bold: true,
                size: 28,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Category",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Value",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "%",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Visual",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.pieData.map(
                (slice, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "■ ",
                                size: 18,
                                color: slice.color.replace("#", ""),
                                font: "Arial",
                              }),
                              new TextRun({
                                text: slice.name,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: slice.value.toLocaleString(),
                                size: 18,
                                font: "Arial",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: `${((slice.value / pieTotal) * 100).toFixed(1)}%`,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: "█".repeat(Math.round((slice.value / pieTotal) * 10)),
                                size: 18,
                                color: slice.color.replace("#", ""),
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Spacing
          new Paragraph({ spacing: { after: 300 }, children: [] }),

          // Data Table Section
          new Paragraph({
            spacing: { before: 100, after: 150 },
            children: [
              new TextRun({
                text: data.tableTitle,
                bold: true,
                size: 28,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Item",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 20, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Quantity",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Revenue",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 25, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Status",
                            bold: true,
                            size: 18,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.tableData.map(
                (row, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: row.item,
                                size: 18,
                                font: "Arial",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: row.quantity.toString(),
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.RIGHT,
                            children: [
                              new TextRun({
                                text: row.revenue,
                                size: 18,
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: row.status,
                                size: 18,
                                font: "Arial",
                                color:
                                  row.status === "Complete"
                                    ? "2E7D32"
                                    : row.status === "In Progress"
                                    ? primaryColor
                                    : accentColor,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
              ),
            ],
          }),

          // Footer line
          new Paragraph({
            border: {
              bottom: {
                color: accentColor,
                size: 18,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 400, after: 200 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.dashboardTitle.replace(/\s+/g, "_")}_Dashboard.docx`);
};
