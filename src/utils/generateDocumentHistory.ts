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
  VerticalAlign,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface RevisionEntry {
  revision: string;
  date: string;
  author: string;
  description: string;
}

interface DocumentHistoryData {
  title: string;
  revisions: RevisionEntry[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateDocumentHistory = async (data: DocumentHistoryData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  // Create header row
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      new TableCell({
        width: { size: 10, type: WidthType.PERCENTAGE },
        shading: { fill: primaryColor, type: ShadingType.SOLID },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "REV",
                bold: true,
                size: 20,
                color: "FFFFFF",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 20, type: WidthType.PERCENTAGE },
        shading: { fill: primaryColor, type: ShadingType.SOLID },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "DATE",
                bold: true,
                size: 20,
                color: "FFFFFF",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 25, type: WidthType.PERCENTAGE },
        shading: { fill: primaryColor, type: ShadingType.SOLID },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "AUTHOR",
                bold: true,
                size: 20,
                color: "FFFFFF",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: { fill: primaryColor, type: ShadingType.SOLID },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "DESCRIPTION",
                bold: true,
                size: 20,
                color: "FFFFFF",
                font: "Arial",
              }),
            ],
          }),
        ],
      }),
    ],
  });

  // Create data rows
  const dataRows = data.revisions.map(
    (rev, index) =>
      new TableRow({
        children: [
          new TableCell({
            shading:
              index % 2 === 1
                ? { fill: `${accentColor}20`, type: ShadingType.SOLID }
                : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: rev.revision,
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
            shading:
              index % 2 === 1
                ? { fill: `${accentColor}20`, type: ShadingType.SOLID }
                : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: rev.date,
                    size: 22,
                    color: "666666",
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            shading:
              index % 2 === 1
                ? { fill: `${accentColor}20`, type: ShadingType.SOLID }
                : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: rev.author,
                    size: 22,
                    font: "Arial",
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            shading:
              index % 2 === 1
                ? { fill: `${accentColor}20`, type: ShadingType.SOLID }
                : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 80, after: 80 },
                children: [
                  new TextRun({
                    text: rev.description,
                    size: 22,
                    color: "666666",
                    font: "Arial",
                  }),
                ],
              }),
            ],
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
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Top decorative line
          new Paragraph({
            border: {
              bottom: {
                color: primaryColor,
                size: 18,
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
                text: data.title.toUpperCase(),
                bold: true,
                size: 44,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Separator line
          new Paragraph({
            border: {
              bottom: {
                color: primaryColor,
                size: 8,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 400 },
            children: [],
          }),

          // Revision table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),

          // Bottom accent line
          new Paragraph({
            border: {
              top: {
                color: accentColor,
                size: 12,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 600 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Document_Revision_History.docx");
};
