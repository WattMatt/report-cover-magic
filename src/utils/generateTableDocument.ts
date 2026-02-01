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

interface DataTableData {
  title: string;
  headers: string[];
  rows: { id: string; values: string[] }[];
  primaryLineColor: string;
  accentLineColor: string;
}

interface ComparisonTableData {
  title: string;
  options: string[];
  features: { id: string; feature: string; values: string[] }[];
  primaryLineColor: string;
  accentLineColor: string;
}

interface SummaryTableData {
  title: string;
  subtitle: string;
  metrics: { id: string; label: string; value: string; unit?: string }[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateDataTableDocument = async (data: DataTableData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

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
            spacing: { before: 200, after: 600 },
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

          // Data Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                children: data.headers.map(
                  (header) =>
                    new TableCell({
                      shading: { fill: primaryColor },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          children: [
                            new TextRun({
                              text: header,
                              bold: true,
                              size: 22,
                              color: "FFFFFF",
                              font: "Arial",
                            }),
                          ],
                        }),
                      ],
                    })
                ),
              }),
              // Data rows
              ...data.rows.map(
                (row, index) =>
                  new TableRow({
                    children: row.values.map(
                      (value) =>
                        new TableCell({
                          shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: value,
                                  size: 22,
                                  font: "Arial",
                                }),
                              ],
                            }),
                          ],
                        })
                    ),
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
  saveAs(blob, `${data.title.replace(/\s+/g, "_")}_Table.docx`);
};

export const generateComparisonTableDocument = async (data: ComparisonTableData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const getValueSymbol = (value: string) => {
    if (value === "yes") return "✓";
    if (value === "no") return "✗";
    if (value === "partial") return "◐";
    return value;
  };

  const getValueColor = (value: string) => {
    if (value === "yes") return "2E7D32";
    if (value === "no") return "C62828";
    if (value === "partial") return "F57C00";
    return "333333";
  };

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
            spacing: { before: 200, after: 600 },
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

          // Comparison Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              // Header row
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: primaryColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: "Feature",
                            bold: true,
                            size: 22,
                            color: "FFFFFF",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  ...data.options.map(
                    (option) =>
                      new TableCell({
                        shading: { fill: primaryColor },
                        children: [
                          new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [
                              new TextRun({
                                text: option,
                                bold: true,
                                size: 22,
                                color: "FFFFFF",
                                font: "Arial",
                              }),
                            ],
                          }),
                        ],
                      })
                  ),
                ],
              }),
              // Feature rows
              ...data.features.map(
                (feature, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: feature.feature,
                                size: 22,
                                font: "Arial",
                                bold: true,
                              }),
                            ],
                          }),
                        ],
                      }),
                      ...feature.values.map(
                        (value) =>
                          new TableCell({
                            shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                            children: [
                              new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                  new TextRun({
                                    text: getValueSymbol(value),
                                    size: 28,
                                    font: "Arial",
                                    bold: true,
                                    color: getValueColor(value),
                                  }),
                                ],
                              }),
                            ],
                          })
                      ),
                    ],
                  })
              ),
            ],
          }),

          // Legend
          new Paragraph({
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "Legend: ",
                size: 20,
                font: "Arial",
                bold: true,
              }),
              new TextRun({
                text: "✓ = Yes   ",
                size: 20,
                font: "Arial",
                color: "2E7D32",
              }),
              new TextRun({
                text: "✗ = No   ",
                size: 20,
                font: "Arial",
                color: "C62828",
              }),
              new TextRun({
                text: "◐ = Partial",
                size: 20,
                font: "Arial",
                color: "F57C00",
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
            spacing: { before: 400, after: 200 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.title.replace(/\s+/g, "_")}_Comparison.docx`);
};

export const generateSummaryTableDocument = async (data: SummaryTableData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

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
            spacing: { before: 200, after: 100 },
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

          // Subtitle
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: data.subtitle,
                size: 24,
                color: "666666",
                font: "Arial",
                italics: true,
              }),
            ],
          }),

          // Metrics Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: data.metrics.map(
              (metric, index) =>
                new TableRow({
                  children: [
                    new TableCell({
                      width: { size: 60, type: WidthType.PERCENTAGE },
                      shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                      children: [
                        new Paragraph({
                          spacing: { before: 100, after: 100 },
                          children: [
                            new TextRun({
                              text: metric.label,
                              size: 24,
                              font: "Arial",
                              bold: true,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      width: { size: 40, type: WidthType.PERCENTAGE },
                      shading: { fill: index % 2 === 0 ? "F5F5F5" : "FFFFFF" },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
                        left: { style: BorderStyle.NONE },
                        right: { style: BorderStyle.NONE },
                      },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.RIGHT,
                          spacing: { before: 100, after: 100 },
                          children: [
                            new TextRun({
                              text: metric.value,
                              size: 28,
                              font: "Arial",
                              bold: true,
                              color: primaryColor,
                            }),
                            ...(metric.unit
                              ? [
                                  new TextRun({
                                    text: ` ${metric.unit}`,
                                    size: 20,
                                    font: "Arial",
                                    color: "666666",
                                  }),
                                ]
                              : []),
                          ],
                        }),
                      ],
                    }),
                  ],
                })
            ),
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
  saveAs(blob, `${data.title.replace(/\s+/g, "_")}_Summary.docx`);
};
