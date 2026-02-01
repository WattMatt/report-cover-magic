import {
  Document,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  WidthType,
  Table,
  TableRow,
  TableCell,
  VerticalAlign,
  ShadingType,
  TabStopPosition,
  TabStopType,
  LeaderType,
  ISectionOptions,
  PageBreak,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

// Page type definitions
export type PageType = "cover" | "toc" | "executive" | "section" | "history";

export interface CoverPageConfig {
  type: "cover";
  reportTitle: string;
  projectName: string;
  projectSubtitle: string;
  projectLocation: string;
  clientName: string;
  documentNumber: string;
  revision: string;
  preparedBy: string;
  date: string;
}

export interface TOCPageConfig {
  type: "toc";
  documentTitle: string;
  entries: { title: string; page: string }[];
}

export interface ExecutivePageConfig {
  type: "executive";
  title: string;
  projectName: string;
  summaryText: string;
  highlights: { label: string; value: string }[];
}

export interface SectionPageConfig {
  type: "section";
  sectionNumber: string;
  sectionTitle: string;
  sectionSubtitle: string;
}

export interface HistoryPageConfig {
  type: "history";
  title: string;
  revisions: { revision: string; date: string; author: string; description: string }[];
}

export type PageConfig = CoverPageConfig | TOCPageConfig | ExecutivePageConfig | SectionPageConfig | HistoryPageConfig;

interface GenerateOptions {
  pages: PageConfig[];
  primaryLineColor: string;
  accentLineColor: string;
  logoBase64?: string;
}

// Generate cover page section
function generateCoverSection(
  config: CoverPageConfig,
  primaryColor: string,
  accentColor: string,
  logoBase64?: string
): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  // Logo
  if (logoBase64) {
    const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, "");
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new ImageRun({
            data: Buffer.from(base64Data, "base64"),
            transformation: { width: 180, height: 80 },
            type: "jpg",
          }),
        ],
      })
    );
  }

  // Top line
  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 24, style: BorderStyle.SINGLE } },
      spacing: { after: 600 },
      children: [],
    })
  );

  // Title
  const titleLines = config.reportTitle.split("\n").filter((line) => line.trim());
  titleLines.forEach((line, index) => {
    children.push(
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
  });

  // Accent line
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 600 },
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━━━━━━━", color: accentColor, size: 28 })],
    })
  );

  // Project name
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: config.projectName.toUpperCase(),
          bold: true,
          size: 48,
          color: "333333",
          font: "Arial",
        }),
      ],
    })
  );

  // Project subtitle
  if (config.projectSubtitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: config.projectSubtitle.toUpperCase(),
            size: 32,
            color: primaryColor,
            font: "Arial",
            italics: true,
          }),
        ],
      })
    );
  }

  // Location
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: config.projectLocation, size: 28, color: "666666", font: "Arial" })],
    })
  );

  // Details table
  const detailRows = [
    { label: "CLIENT:", value: config.clientName },
    { label: "DOCUMENT NO:", value: config.documentNumber },
    { label: "REVISION:", value: config.revision },
    { label: "PREPARED BY:", value: config.preparedBy },
    { label: "DATE:", value: config.date },
  ];

  children.push(
    new Paragraph({
      border: { top: { color: primaryColor, size: 12, style: BorderStyle.SINGLE } },
      spacing: { before: 800, after: 400 },
      children: [],
    })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: detailRows.map(
        (row) =>
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
                    spacing: { before: 100 },
                    children: [new TextRun({ text: row.label, bold: true, size: 22, color: primaryColor, font: "Arial" })],
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
                    spacing: { before: 100 },
                    children: [new TextRun({ text: row.value, size: 22, color: "333333", font: "Arial" })],
                  }),
                ],
              }),
            ],
          })
      ),
    })
  );

  // Footer
  children.push(
    new Paragraph({
      border: { bottom: { color: accentColor, size: 18, style: BorderStyle.SINGLE } },
      spacing: { before: 800, after: 200 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200 },
      children: [new TextRun({ text: "CONFIDENTIAL", bold: true, size: 18, color: "999999", font: "Arial" })],
    })
  );

  return children;
}

// Generate TOC section
function generateTOCSection(config: TOCPageConfig, primaryColor: string, accentColor: string): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 18, style: BorderStyle.SINGLE } },
      spacing: { after: 400 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
      children: [
        new TextRun({
          text: config.documentTitle.toUpperCase(),
          bold: true,
          size: 48,
          color: primaryColor,
          font: "Arial",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 12, style: BorderStyle.SINGLE } },
      spacing: { after: 400 },
      children: [],
    })
  );

  config.entries.forEach((entry) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX, leader: LeaderType.DOT }],
        children: [
          new TextRun({ text: entry.title, size: 24, font: "Arial" }),
          new TextRun({ text: "\t" }),
          new TextRun({ text: entry.page, size: 24, font: "Arial", bold: true, color: primaryColor }),
        ],
      })
    );
  });

  children.push(
    new Paragraph({
      border: { top: { color: accentColor, size: 12, style: BorderStyle.SINGLE } },
      spacing: { before: 600 },
      children: [],
    })
  );

  return children;
}

// Generate Executive Summary section
function generateExecutiveSection(config: ExecutivePageConfig, primaryColor: string, accentColor: string): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 18, style: BorderStyle.SINGLE } },
      spacing: { after: 300 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({ text: config.title.toUpperCase(), bold: true, size: 48, color: primaryColor, font: "Arial" }),
      ],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: config.projectName, size: 24, color: "666666", font: "Arial" })],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
      children: [new TextRun({ text: "━━━━━━━━━━━━━━━━━━━━", color: accentColor, size: 24 })],
    })
  );

  // Highlights table
  const highlightCells = config.highlights.map(
    (h) =>
      new TableCell({
        width: { size: Math.floor(100 / config.highlights.length), type: WidthType.PERCENTAGE },
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
            children: [new TextRun({ text: h.label, size: 18, color: "666666", font: "Arial" })],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 80 },
            children: [new TextRun({ text: h.value, bold: true, size: 24, color: primaryColor, font: "Arial" })],
          }),
        ],
      })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [new TableRow({ children: highlightCells })],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 300, after: 300 },
      border: { bottom: { color: primaryColor, size: 4, style: BorderStyle.SINGLE } },
      children: [],
    })
  );

  config.summaryText.split("\n").forEach((line) => {
    children.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: line, size: 22, font: "Arial" })],
      })
    );
  });

  children.push(
    new Paragraph({
      border: { top: { color: accentColor, size: 12, style: BorderStyle.SINGLE } },
      spacing: { before: 400 },
      children: [],
    })
  );

  return children;
}

// Generate Section Divider
function generateSectionSection(config: SectionPageConfig, primaryColor: string, accentColor: string): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 24, style: BorderStyle.SINGLE } },
      spacing: { after: 0 },
      children: [],
    })
  );

  children.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));

  children.push(
    new Paragraph({
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: config.sectionNumber.toUpperCase(),
          size: 28,
          color: accentColor,
          font: "Arial",
          allCaps: true,
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [
        new TextRun({
          text: config.sectionTitle.toUpperCase(),
          bold: true,
          size: 72,
          color: primaryColor,
          font: "Arial",
        }),
      ],
    })
  );

  children.push(
    new Paragraph({
      spacing: { before: 100, after: 200 },
      children: [new TextRun({ text: "━━━━━━━━━━━━━━", color: accentColor, size: 28 })],
    })
  );

  if (config.sectionSubtitle) {
    children.push(
      new Paragraph({
        spacing: { before: 100, after: 200 },
        children: [new TextRun({ text: config.sectionSubtitle, size: 28, color: "666666", font: "Arial", italics: true })],
      })
    );
  }

  children.push(new Paragraph({ spacing: { before: 3000 }, children: [] }));

  children.push(
    new Paragraph({
      border: { top: { color: primaryColor, size: 18, style: BorderStyle.SINGLE } },
      children: [],
    })
  );

  return children;
}

// Generate Document History section
function generateHistorySection(config: HistoryPageConfig, primaryColor: string, accentColor: string): (Paragraph | Table)[] {
  const children: (Paragraph | Table)[] = [];

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 18, style: BorderStyle.SINGLE } },
      spacing: { after: 400 },
      children: [],
    })
  );

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 400 },
      children: [
        new TextRun({ text: config.title.toUpperCase(), bold: true, size: 44, color: primaryColor, font: "Arial" }),
      ],
    })
  );

  children.push(
    new Paragraph({
      border: { bottom: { color: primaryColor, size: 8, style: BorderStyle.SINGLE } },
      spacing: { after: 400 },
      children: [],
    })
  );

  // Header row
  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      { text: "REV", width: 10 },
      { text: "DATE", width: 20 },
      { text: "AUTHOR", width: 25 },
      { text: "DESCRIPTION", width: 45 },
    ].map(
      (col) =>
        new TableCell({
          width: { size: col.width, type: WidthType.PERCENTAGE },
          shading: { fill: primaryColor, type: ShadingType.SOLID },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ text: col.text, bold: true, size: 20, color: "FFFFFF", font: "Arial" })],
            }),
          ],
        })
    ),
  });

  // Data rows
  const dataRows = config.revisions.map(
    (rev, index) =>
      new TableRow({
        children: [
          new TableCell({
            shading: index % 2 === 1 ? { fill: `${accentColor}20`, type: ShadingType.SOLID } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: rev.revision, bold: true, size: 22, color: primaryColor, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            shading: index % 2 === 1 ? { fill: `${accentColor}20`, type: ShadingType.SOLID } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: rev.date, size: 22, color: "666666", font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            shading: index % 2 === 1 ? { fill: `${accentColor}20`, type: ShadingType.SOLID } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: rev.author, size: 22, font: "Arial" })],
              }),
            ],
          }),
          new TableCell({
            shading: index % 2 === 1 ? { fill: `${accentColor}20`, type: ShadingType.SOLID } : undefined,
            verticalAlign: VerticalAlign.CENTER,
            children: [
              new Paragraph({
                spacing: { before: 80, after: 80 },
                children: [new TextRun({ text: rev.description, size: 22, color: "666666", font: "Arial" })],
              }),
            ],
          }),
        ],
      })
  );

  children.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [headerRow, ...dataRows],
    })
  );

  children.push(
    new Paragraph({
      border: { top: { color: accentColor, size: 12, style: BorderStyle.SINGLE } },
      spacing: { before: 600 },
      children: [],
    })
  );

  return children;
}

export const generateMultiPageDocument = async (options: GenerateOptions) => {
  const { pages, primaryLineColor, accentLineColor, logoBase64 } = options;
  const primaryColor = primaryLineColor.replace("#", "");
  const accentColor = accentLineColor.replace("#", "");

  const sections: ISectionOptions[] = pages.map((page, index) => {
    let children: (Paragraph | Table)[] = [];

    switch (page.type) {
      case "cover":
        children = generateCoverSection(page, primaryColor, accentColor, logoBase64);
        break;
      case "toc":
        children = generateTOCSection(page, primaryColor, accentColor);
        break;
      case "executive":
        children = generateExecutiveSection(page, primaryColor, accentColor);
        break;
      case "section":
        children = generateSectionSection(page, primaryColor, accentColor);
        break;
      case "history":
        children = generateHistorySection(page, primaryColor, accentColor);
        break;
    }

    return {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(page.type === "section" ? 0.5 : 1),
            bottom: convertInchesToTwip(page.type === "section" ? 0.5 : 1),
            left: convertInchesToTwip(page.type === "section" ? 1.5 : 1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children,
    };
  });

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Complete_Report.docx");
};
