import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
  convertInchesToTwip,
  VerticalAlign,
} from "docx";
import { saveAs } from "file-saver";
import { Packer } from "docx";

interface SectionDividerData {
  sectionNumber: string;
  sectionTitle: string;
  sectionSubtitle: string;
  primaryLineColor: string;
  accentLineColor: string;
}

export const generateSectionDivider = async (data: SectionDividerData) => {
  const primaryColor = data.primaryLineColor.replace("#", "");
  const accentColor = data.accentLineColor.replace("#", "");

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.5),
              right: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Top accent bar
          new Paragraph({
            border: {
              bottom: {
                color: primaryColor,
                size: 24,
                style: BorderStyle.SINGLE,
              },
            },
            spacing: { after: 0 },
            children: [],
          }),

          // Spacer to push content to center
          new Paragraph({
            spacing: { before: 3000 },
            children: [],
          }),

          // Section number/label
          new Paragraph({
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: data.sectionNumber.toUpperCase(),
                size: 28,
                color: accentColor,
                font: "Arial",
                allCaps: true,
              }),
            ],
          }),

          // Main section title
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: data.sectionTitle.toUpperCase(),
                bold: true,
                size: 72,
                color: primaryColor,
                font: "Arial",
              }),
            ],
          }),

          // Decorative line
          new Paragraph({
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({
                text: "━━━━━━━━━━━━━━",
                color: accentColor,
                size: 28,
              }),
            ],
          }),

          // Subtitle
          ...(data.sectionSubtitle
            ? [
                new Paragraph({
                  spacing: { before: 100, after: 200 },
                  children: [
                    new TextRun({
                      text: data.sectionSubtitle,
                      size: 28,
                      color: "666666",
                      font: "Arial",
                      italics: true,
                    }),
                  ],
                }),
              ]
            : []),

          // Bottom spacer
          new Paragraph({
            spacing: { before: 3000 },
            children: [],
          }),

          // Bottom accent bar
          new Paragraph({
            border: {
              top: {
                color: primaryColor,
                size: 18,
                style: BorderStyle.SINGLE,
              },
            },
            children: [],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `Section_${data.sectionNumber.replace(/\s+/g, "_")}_${data.sectionTitle.replace(/\s+/g, "_")}.docx`;
  saveAs(blob, filename);
};
