import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { saveAs } from "file-saver";

export async function downloadWhitepaper() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Provenance OS™: Stratigraphic Navigation",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "A Foundation for Truth in Digital Interaction",
            heading: HeadingLevel.HEADING_2,
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 },
          }),
          new Paragraph({
            text: "1. The Invention",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "An interaction system where users ",
              }),
              new TextRun({
                text: "excavate digital objects",
                bold: true,
              }),
              new TextRun({
                text: " in order to ",
              }),
              new TextRun({
                text: "reveal their intrinsic layers of truth and origin.",
                bold: true,
              }),
            ],
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "2. The Atomic Unit of Interaction",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "The user performs a continuous z-axis excavation on a singular artifact causing successive historical, physical, and emotional realities to replace the surface representation.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "3. The Thesis",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "We currently live in a world where digital objects are silent. Metadata is stored externally, separated from the object itself by hyperlinks or databases. Provenance OS™ introduces Stratigraphic Navigation: a paradigm where truth, history, and context are embedded within the object. By moving \"through\" the object rather than clicking \"away\" from it, the user builds a relationship of trust and emotional resonance with the artifact.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "4. The Prototype: Andamooka Matrix",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "The artifact is a single Andamooka Matrix opal. The interaction requires no clicks, only a continuous scroll (excavation).",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Layer 1 - Surface: The physical object. What the buyer sees.",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "Layer 2 - Discovery: The human story. The miner (Cozza), the tool, the depth.",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "Layer 3 - Structure: The anatomy. Microscopic spheres of silica bending light.",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "Layer 4 - Origin: The genesis. 110 million years ago, the Eromanga Sea.",
            bullet: { level: 0 },
          }),
          new Paragraph({
            text: "Layer 5 - Truth: The existential realization. You are not buying a gemstone; you are acquiring a chapter of time.",
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: "5. Critical Analysis",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: "Strongest Argument Against: The interaction could be seen as an elegant metaphor overlaying existing scrolling behaviors (like scrollytelling), rather than a fundamentally new computing primitive. It may introduce friction for users seeking rapid, utilitarian information retrieval.",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "Strongest Argument For: It solves the 'trust deficit' in digital spaces by structurally linking an object to its verifiable history in an emotionally resonant way. It bridges the gap between raw data (metadata) and human meaning (storytelling).",
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: "The Ultimate Test: Present two identical luxury objects to a buyer. One uses standard e-commerce galleries and specifications. The other uses Stratigraphic Navigation. Measure not just conversion, but the willingness to pay a premium, and the long-term retention of the object's story by the owner.",
            spacing: { after: 400 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Compiled by the AI Studio Agent for Mooka Boys.",
                italics: true,
              }),
            ],
            alignment: AlignmentType.CENTER,
          })
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Provenance_OS_Whitepaper.docx");
}
