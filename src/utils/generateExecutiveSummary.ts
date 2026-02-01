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
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface Highlight {
  label: string;
  value: string;
}

interface ExecutiveSummaryData {
  title: string;
  projectName: string;
  summaryText: string;
  highlights: Highlight[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateExecutiveSummary = async (data: ExecutiveSummaryData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  // Create highlight cells
  const highlightCells = data.highlights.map(
    (h) =>
      new TableCell({
        width: { size: Math.floor(100 / data.highlights.length), type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
          bottom: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
          left: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
          right: { style: BorderStyle.SINGLE, size: 8, color: primaryColor },
        },
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 80, after: 40 },
            children: [
              new TextRun({
                text: h.label,
                size: 18,
                color: "666666",
                font: "Arial",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({
                text: h.value,
                bold: true,
                size: 24,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),
        ],
      })
  );

  // Parse summary text into paragraphs
  const summaryParagraphs = data.summaryText.split("\n").map(
    (line) =>
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({
            text: line,
            size: 22,
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
            spacing: { after: 300 },
            children: [],
          }),

          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: data.title.toUpperCase(),
                bold: true,
                size: 48,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Project Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: data.projectName,
                size: 24,
                color: "666666",
                font: "Arial",
              }),
            ],
          }),

          // Accent line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━━━━━━━",
                color: accentColor,
                size: 24,
              }),
            ],
          }),

          // Highlights table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: highlightCells,
              }),
            ],
          }),

          // Separator
          new Paragraph({
            spacing: { before: 300, after: 300 },
            border: {
              bottom: {
                color: primaryColor,
                size: 4,
                style: BorderStyle.SINGLE,
              },
            },
            children: [],
          }),

          // Summary content
          ...summaryParagraphs,

          // Bottom accent line
          new Paragraph({
            border: {
              top: {
                color: accentColor,
                size: 12,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { before: 400 },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Executive_Summary.docx");
};
