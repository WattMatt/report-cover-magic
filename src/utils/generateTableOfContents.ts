import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  TabStopPosition,
  TabStopType,
  LeaderType,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface TOCEntry {
  title: string;
  page: string;
}

interface TOCData {
  documentTitle: string;
  entries: TOCEntry[];
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateTableOfContents = async (data: TOCData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const tocEntries = data.entries.map((entry) =>
    new Paragraph({
      spacing: { before: 120, after: 120 },
      tabStops: [
        {
          type: TabStopType.RIGHT,
          position: TabStopPosition.MAX,
          leader: LeaderType.DOT,
        },
      ],
      children: [
        new TextRun({
          text: entry.title,
          size: 24,
          font: "Arial",
        }),
        new TextRun({
          text: "\t",
        }),
        new TextRun({
          text: entry.page,
          size: 24,
          font: "Arial",
          bold: true,
          color: primaryColor,
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
                text: data.documentTitle.toUpperCase(),
                bold: true,
                size: 48,
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
                size: 12,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 400 },
            children: [],
          }),

          // TOC Entries
          ...tocEntries,

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
  saveAs(blob, "Table_of_Contents.docx");
};
