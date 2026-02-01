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

interface DataPoint {
  label: string;
  value: number;
}

interface BarLineChartData {
  title: string;
  chartType: "bar" | "line";
  xAxisLabel: string;
  yAxisLabel: string;
  dataPoints: DataPoint[];
  primaryLineColor: string;
  accentLineColor: string;
}

interface PieChartSlice {
  name: string;
  value: number;
  color: string;
}

interface PieChartData {
  title: string;
  chartType: "pie" | "donut";
  slices: PieChartSlice[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateBarLineChartDocument = async (data: BarLineChartData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const maxValue = Math.max(...data.dataPoints.map(d => d.value));

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
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
            spacing: { after: 400 },
            children: [],
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 48,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Chart Type indicator
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `${data.chartType === "bar" ? "Bar" : "Line"} Chart`,
                size: 24,
                color: "666666",
                font: "Arial",
                italics: true,
              }),
            ],
          }),

          // Axis labels
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `X-Axis: ${data.xAxisLabel}  |  Y-Axis: ${data.yAxisLabel}`,
                size: 22,
                color: "333333",
                font: "Arial",
              }),
            ],
          }),

          // Accent line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: accentColor,
                size: 28,
              }),
            ],
          }),

          // Data Table
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "DATA VALUES",
                bold: true,
                size: 24,
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
                            text: data.xAxisLabel,
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: data.yAxisLabel,
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Visual",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.dataPoints.map(
                (point, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: point.label,
                                size: 22,
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
                                size: 22,
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
                                text: "█".repeat(Math.round((point.value / maxValue) * 15)),
                                size: 22,
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

          // Footer line
          new Paragraph({
            border: {
              bottom: {
                color: accentColor,
                size: 18,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 600, after: 200 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title.replace(/\s+/g, "_")}_Chart.docx`);
};

export const generatePieChartDocument = async (data: PieChartData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const total = data.slices.reduce((sum, slice) => sum + slice.value, 0);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
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
            spacing: { after: 400 },
            children: [],
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: data.title,
                bold: true,
                size: 48,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Chart Type indicator
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `${data.chartType === "pie" ? "Pie" : "Donut"} Chart`,
                size: 24,
                color: "666666",
                font: "Arial",
                italics: true,
              }),
            ],
          }),

          // Accent line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: accentColor,
                size: 28,
              }),
            ],
          }),

          // Distribution Table
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "DISTRIBUTION BREAKDOWN",
                bold: true,
                size: 24,
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
                            size: 22,
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
                            size: 22,
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
                            text: "Percentage",
                            bold: true,
                            size: 22,
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
                            size: 22,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              ...data.slices.map(
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
                                size: 22,
                                color: slice.color.replace("#", ""),
                                font: "Arial",
                              }),
                              new TextRun({
                                text: slice.name,
                                size: 22,
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
                                size: 22,
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
                                text: `${((slice.value / total) * 100).toFixed(1)}%`,
                                size: 22,
                                font: "Arial",
                                bold: true,
                                color: slice.color.replace("#", ""),
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
                                text: "█".repeat(Math.round((slice.value / total) * 15)),
                                size: 22,
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
              // Total row
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: primaryColor + "20" },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "TOTAL",
                            bold: true,
                            size: 22,
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: primaryColor + "20" },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: total.toLocaleString(),
                            size: 22,
                            font: "Arial",
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: primaryColor + "20" },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: "100%",
                            size: 22,
                            font: "Arial",
                            bold: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    shading: { fill: primaryColor + "20" },
                    children: [new Paragraph({ children: [] })],
                  }),
                ],
              }),
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
            spacing: { before: 600, after: 200 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title.replace(/\s+/g, "_")}_Chart.docx`);
};
