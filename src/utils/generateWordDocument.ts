import {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  BorderStyle,
  PageOrientation,
  Header,
  Footer,
  convertInchesToTwip,
  WidthType,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface CoverPageData {
  projectName: string;
  projectLocation: string;
  clientName: string;
  documentNumber: string;
  revision: string;
  preparedBy: string;
  date: string;
}

export const generateWordDocument = async (
  data: CoverPageData,
  logoBase64: string
) => {
  // Strip the data URL prefix if present
  const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");

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
          // Logo section
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new ImageRun({
                data: Buffer.from(base64Data, "base64"),
                transformation: {
                  width: 180,
                  height: 80,
                },
                type: "jpg",
              }),
            ],
          }),

          // Top decorative line
          new Paragraph({
            border: {
              bottom: {
                color: "1565C0",
                size: 24,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 600 },
            children: [],
          }),

          // Main Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 200 },
            children: [
              new TextRun({
                text: "ELECTRICAL LOAD",
                bold: true,
                size: 72,
                color: "1565C0",
                font: "Arial",
              }),
            ],
          }),

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: "ESTIMATE REPORT",
                bold: true,
                size: 72,
                color: "1565C0",
                font: "Arial",
              }),
            ],
          }),

          // Gold accent line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 600 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: "D4A853",
                size: 28,
              }),
            ],
          }),

          // Project Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400, after: 100 },
            children: [
              new TextRun({
                text: data.projectName.toUpperCase(),
                bold: true,
                size: 48,
                color: "333333",
                font: "Arial",
              }),
            ],
          }),

          // Project Type
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: "RETAIL DEVELOPMENT",
                size: 32,
                color: "1976D2",
                font: "Arial",
                italics: true,
              }),
            ],
          }),

          // Location
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: data.projectLocation,
                size: 28,
                color: "666666",
                font: "Arial",
              }),
            ],
          }),

          // Bottom decorative line
          new Paragraph({
            border: {
              top: {
                color: "1565C0",
                size: 12,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 800, after: 400 },
            children: [],
          }),

          // Project Details Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "CLIENT:",
                            bold: true,
                            size: 22,
                            color: "1565C0",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: data.clientName,
                            size: 22,
                            color: "333333",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: "DOCUMENT NO:",
                            bold: true,
                            size: 22,
                            color: "1565C0",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: data.documentNumber,
                            size: 22,
                            color: "333333",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: "REVISION:",
                            bold: true,
                            size: 22,
                            color: "1565C0",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: data.revision,
                            size: 22,
                            color: "333333",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: "PREPARED BY:",
                            bold: true,
                            size: 22,
                            color: "1565C0",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: data.preparedBy,
                            size: 22,
                            color: "333333",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: "DATE:",
                            bold: true,
                            size: 22,
                            color: "1565C0",
                            font: "Arial",
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: {
                      top: { style: BorderStyle.NONE },
                      bottom: { style: BorderStyle.NONE },
                      left: { style: BorderStyle.NONE },
                      right: { style: BorderStyle.NONE },
                    },
                    children: [
                      new Paragraph({
                        spacing: { before: 100 },
                        children: [
                          new TextRun({
                            text: data.date,
                            size: 22,
                            color: "333333",
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

          // Footer line
          new Paragraph({
            border: {
              bottom: {
                color: "D4A853",
                size: 18,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 800, after: 200 },
            children: [],
          }),

          // Confidential notice
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: "CONFIDENTIAL",
                bold: true,
                size: 18,
                color: "999999",
                font: "Arial",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${data.projectName.replace(/\s+/g, "_")}_Electrical_Load_Estimate_Cover.docx`);
};
