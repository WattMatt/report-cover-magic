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
  reportTitle: string;
  projectName: string;
  projectSubtitle: string;
  projectLocation: string;
  clientName: string;
  documentNumber: string;
  revision: string;
  preparedBy: string;
  date: string;
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateWordDocument = async (
  data: CoverPageData,
  logoBase64: string
) => {
  // Strip the data URL prefix if present
  const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
  
  // Convert hex colors to docx format (remove # prefix)
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");
  
  // Split title into lines
  const titleLines = data.reportTitle.split('\n').filter(line => line.trim());
  
  // Create title paragraphs
  const titleParagraphs = titleLines.map((line, index) => 
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: index === 0 ? 400 : 0, after: index === titleLines.length - 1 ? 400 : 200 },
      children: [
        new TextRun({
          text: line.toUpperCase(),
          bold: true,
          size: 72,
          color: primaryColor,
          font: "Arial",
        }),
      ],
    })
  );

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
                color: primaryColor,
                size: 24,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 600 },
            children: [],
          }),

          // Main Title
          ...titleParagraphs,

          // Accent line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 600 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━━━━━━━",
                color: accentColor,
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

          // Project Type (Subtitle)
          ...(data.projectSubtitle ? [new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: data.projectSubtitle.toUpperCase(),
                size: 32,
                color: primaryColor,
                font: "Arial",
                italics: true,
              }),
            ],
          })] : []),

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
                color: primaryColor,
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
                            color: primaryColor,
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
                            color: primaryColor,
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
                            color: primaryColor,
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
                            color: primaryColor,
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
                            color: primaryColor,
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
                color: accentColor,
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
