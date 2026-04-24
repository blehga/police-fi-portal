import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PDFDocument, PDFPage, PDFFont, StandardFonts, rgb } from "pdf-lib";
import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string; fiId: string }>;
};

type PersonView = {
  fullName: string;
  firstName: string | null | undefined;
  middleName: string | null | undefined;
  lastName: string | null | undefined;
  nickname: string | null | undefined;
  dob: Date | string | null | undefined;
  age: number | string | null | undefined;
  sex: string | null | undefined;
  race: string | null | undefined;

  role: string | null | undefined;
  movementType: string | null | undefined;
  isPrimary: boolean | null | undefined;

  address: string | null | undefined;
  city: string | null | undefined;
  state: string | null | undefined;
  zip: string | null | undefined;
  phone: string | null | undefined;
  email: string | null | undefined;

  primaryLanguage: string | null | undefined;
  description: string | null | undefined;

  height: string | null | undefined;
  weight: string | null | undefined;
  build: string | null | undefined;
  hairColor: string | null | undefined;
  hairLength: string | null | undefined;
  hairStyle: string | null | undefined;
  eyeColor: string | null | undefined;
  complexion: string | null | undefined;
  teeth: string | null | undefined;
  handPreference: string | null | undefined;

  tattoos: string | null | undefined;
  scars: string | null | undefined;
  needleMarks: string | null | undefined;
  tracks: string | null | undefined;
  glasses: string | null | undefined;
  mustache: string | null | undefined;
  beard: string | null | undefined;

  socialSecurity: string | null | undefined;
  driverLicense: string | null | undefined;
  driverLicenseState: string | null | undefined;
  otherId: string | null | undefined;
  otherIdType: string | null | undefined;
  otherIdState: string | null | undefined;

  school: string | null | undefined;
  schoolAddress: string | null | undefined;
  schoolCity: string | null | undefined;
  schoolState: string | null | undefined;
  schoolZip: string | null | undefined;
  schoolPhone: string | null | undefined;

  parentName: string | null | undefined;
  parentAddress: string | null | undefined;
  parentCity: string | null | undefined;
  parentState: string | null | undefined;
  parentZip: string | null | undefined;
  parentPhone: string | null | undefined;

  occupation: string | null | undefined;
  employerName: string | null | undefined;
  employerAddress: string | null | undefined;
  employerCity: string | null | undefined;
  employerState: string | null | undefined;
  employerZip: string | null | undefined;
  employerPhone: string | null | undefined;

  gangName: string | null | undefined;
  gangMembershipLength: string | null | undefined;

  onParole: boolean | null | undefined;
  paroleOfficer: string | null | undefined;
  parolePhone: string | null | undefined;
  onProbation: boolean | null | undefined;
  probationOfficer: string | null | undefined;
  probationPhone: string | null | undefined;

  vehicleLicense: string | null | undefined;
  vehicleMake: string | null | undefined;
  vehicleModel: string | null | undefined;
  vehicleStyle: string | null | undefined;
  vehicleYear: string | number | null | undefined;
  vehicleColor: string | null | undefined;
  vehicleState: string | null | undefined;
  vehicleOddities: string | null | undefined;

  comments: string | null | undefined;
};

type Fonts = {
  regular: PDFFont;
  bold: PDFFont;
};

type Cursor = {
  page: PDFPage;
  y: number;
  pageNumber: number;
};

type Summary = {
  caseNumber: string;
  subjectName: string;
  incidentDate: string;
  incidentTime: string;
  incidentType: string;
  incidentLocation: string;

  officerName: string;
  officerId: string;
  fiDate: string;
  fiDay: string;
  fiTime: string;
  beat: string;
  
};

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN_X = 34;
const TOP_MARGIN = 28;
const BOTTOM_MARGIN = 70;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const INNER_PAD_X = 10;

const COLORS = {
  text: rgb(0.12, 0.12, 0.12),
  muted: rgb(0.42, 0.42, 0.42),
  border: rgb(0.84, 0.84, 0.84),
  strongBorder: rgb(0.2, 0.2, 0.2),
  sectionFill: rgb(0.95, 0.95, 0.95),
  panelFill: rgb(1, 1, 1),
  badgeFill: rgb(0.94, 0.94, 0.94),
};

function fmtDate(value: Date | string | null | undefined) {
  if (!value) return "";

  // If DB value comes as plain YYYY-MM-DD string, preserve it exactly
  if (typeof value === "string") {
    const text = value.trim();

    const plainDate = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (plainDate) {
      const [, yyyy, mm, dd] = plainDate;
      return `${Number(mm)}/${Number(dd)}/${yyyy}`;
    }

    const parsed = new Date(text);
    if (Number.isNaN(parsed.getTime())) return "";

    return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}/${parsed.getUTCFullYear()}`;
  }

  // If Prisma/DB gives a real Date object, format in UTC to avoid previous-day shift
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    return `${value.getUTCMonth() + 1}/${value.getUTCDate()}/${value.getUTCFullYear()}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}/${parsed.getUTCFullYear()}`;
}

function safeFilePart(value: string | null | undefined) {
  return (value || "").trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
}

function textValue(value: unknown) {
  const text = String(value ?? "").trim();
  return text || "—";
}

function numberValue(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function nonEmpty(value: unknown) {
  return String(value ?? "").trim().length > 0;
}

function yesNo(value: boolean | null | undefined) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}

function joinAddress(parts: Array<string | null | undefined>) {
  return parts.map((x) => String(x ?? "").trim()).filter(Boolean).join(", ");
}

async function readLocalUpload(url: string): Promise<Buffer | null> {
  if (!url.startsWith("/uploads/")) return null;

  const relativePath = url.replace(/^\/+/, "");
  const filePath = path.join(process.cwd(), "public", relativePath);

  try {
    return await fs.readFile(filePath);
  } catch {
    return null;
  }
}

function isPng(url: string) {
  return /\.png$/i.test(url);
}

function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(candidate, fontSize);

    if (width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);

      if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        let part = "";
        for (const ch of word) {
          const next = part + ch;
          if (font.widthOfTextAtSize(next, fontSize) <= maxWidth) {
            part = next;
          } else {
            if (part) lines.push(part);
            part = ch;
          }
        }
        current = part;
      } else {
        current = word;
      }
    }
  }

  if (current) lines.push(current);
  return lines;
}

function measureLines(
  text: string,
  width: number,
  font: PDFFont,
  fontSize: number,
  maxLines?: number
) {
  const lines = wrapText(text, width, font, fontSize);
  return maxLines ? lines.slice(0, maxLines) : lines;
}

function colX(index: number, cols: number, gutter = 8) {
  const usable = CONTENT_WIDTH - INNER_PAD_X * 2 - gutter * (cols - 1);
  const colWidth = usable / cols;
  return MARGIN_X + INNER_PAD_X + index * (colWidth + gutter);
}

function colW(span: number, cols: number, gutter = 8) {
  const usable = CONTENT_WIDTH - INNER_PAD_X * 2 - gutter * (cols - 1);
  const one = usable / cols;
  return one * span + gutter * (span - 1);
}

function createPage(
  pdfDoc: PDFDocument,
  fonts: Fonts,
  pageNumber: number,
  summary: Summary
): Cursor {
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);

  const title = "FIELD INTERVIEW / CONTACT REPORT";
  const titleSize = 15;
  const titleWidth = fonts.bold.widthOfTextAtSize(title, titleSize);

  page.drawText(title, {
    x: (PAGE_WIDTH - titleWidth) / 2,
    y: PAGE_HEIGHT - TOP_MARGIN - 2,
    size: titleSize,
    font: fonts.bold,
    color: COLORS.text,
  });

  const pageText = `Page ${pageNumber}`;
  page.drawText(pageText, {
    x: PAGE_WIDTH - MARGIN_X - fonts.regular.widthOfTextAtSize(pageText, 8),
    y: PAGE_HEIGHT - TOP_MARGIN + 1,
    size: 8,
    font: fonts.regular,
    color: COLORS.muted,
  });

  const metaTop = PAGE_HEIGHT - 52;

 page.drawRectangle({
  x: MARGIN_X,
  y: metaTop - 42,
  width: CONTENT_WIDTH,
  height: 42,
  borderColor: COLORS.strongBorder,
  borderWidth: 1.2,
});

  const labelSize = 8.5;
  const valueSize = 8.5;

  function drawMetaField(
    x: number,
    y: number,
    width: number,
    label: string,
    value: string,
    maxLines = 1
  ) {
    const safeValue = textValue(value);
    const labelText = `${label} `;
    const labelWidth = fonts.regular.widthOfTextAtSize(labelText, labelSize);
    const valueX = x + labelWidth;
    const valueWidth = Math.max(10, width - labelWidth);

    page.drawText(labelText, {
      x,
      y,
      size: labelSize,
      font: fonts.regular,
      color: COLORS.text,
    });

    const valueLines = measureLines(
      safeValue,
      valueWidth,
      fonts.bold,
      valueSize,
      maxLines
    );

    let yy = y;
    for (const line of valueLines) {
      page.drawText(line, {
        x: valueX,
        y: yy,
        size: valueSize,
        font: fonts.bold,
        color: COLORS.text,
      });
      yy -= 10;
    }
  }

  const row1Y = metaTop - 14;
  const row2Y = metaTop - 32;

  // Row 1
  drawMetaField(MARGIN_X + 10, row1Y, 100, "Case #:", summary.caseNumber, 1);
  drawMetaField(MARGIN_X + 120, row1Y, 150, "Subject:", summary.subjectName, 1);
  drawMetaField(MARGIN_X + 280, row1Y, 130, "Incident Date:", summary.incidentDate, 1);
  drawMetaField(MARGIN_X + 420, row1Y, 120, "Incident Time:", summary.incidentTime, 1);

  // Row 2
  drawMetaField(MARGIN_X + 10, row2Y, 190, "Incident Type:", summary.incidentType, 1);
  drawMetaField(MARGIN_X + 280, row2Y, 260, "Incident Location:", summary.incidentLocation, 2);

 
  drawReportDetailsFooter(page, fonts, summary);

  return {
    page,
    y: PAGE_HEIGHT - 108,
    pageNumber,
  };
}

function ensureSpace(
  pdfDoc: PDFDocument,
  cursor: Cursor,
  neededHeight: number,
  fonts: Fonts,
  summary: Summary
): Cursor {
  if (cursor.y - neededHeight < BOTTOM_MARGIN) {
    return createPage(pdfDoc, fonts, cursor.pageNumber + 1, summary);
  }
  return cursor;
}

function drawSectionHeader(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  yTop: number,
  w: number,
  title: string
) {
  page.drawRectangle({
    x,
    y: yTop - 18,
    width: w,
    height: 18,
    color: COLORS.sectionFill,
    borderColor: COLORS.border,
    borderWidth: 0.55,
  });

  page.drawText(title.toUpperCase(), {
    x: x + 8,
    y: yTop - 12,
    size: 8.6,
    font: fonts.bold,
    color: COLORS.text,
  });
}



function drawPanel(
  page: PDFPage,
  x: number,
  yTop: number,
  w: number,
  h: number
) {
  page.drawRectangle({
    x,
    y: yTop - h,
    width: w,
    height: h,
    color: COLORS.panelFill,
    borderColor: COLORS.border,
    borderWidth: 0.55,
  });
}



function drawField(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  yTop: number,
  w: number,
  label: string,
  value: string,
  opts?: {
    valueSize?: number;
    lines?: number;
    boldValue?: boolean;
  }
) {
  const valueSize = opts?.valueSize ?? 8.8;
  const maxLines = opts?.lines ?? 2;
  const valueFont = opts?.boldValue ? fonts.bold : fonts.regular;

  page.drawText(label, {
    x,
    y: yTop,
    size: 6.9,
    font: fonts.regular,
    color: COLORS.muted,
  });

  const wrapped = measureLines(
    value || "—",
    Math.max(10, w - 2),
    valueFont,
    valueSize,
    maxLines
  );

  let yy = yTop - 12;
  for (const line of wrapped) {
    page.drawText(line, {
      x,
      y: yy,
      size: valueSize,
      font: valueFont,
      color: COLORS.text,
    });
    yy -= valueSize + 2;
  }
}

function drawParagraph(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  yTop: number,
  w: number,
  text: string,
  fontSize = 9,
  bold = false
) {
  const useFont = bold ? fonts.bold : fonts.regular;
  const lines = wrapText(text || "—", w, useFont, fontSize);

  let yy = yTop;
  for (const line of lines) {
    page.drawText(line, {
      x,
      y: yy,
      size: fontSize,
      font: useFont,
      color: COLORS.text,
    });
    yy -= fontSize + 4;
  }

  return lines.length;
}

function estimateParagraphPanelHeight(
  fonts: Fonts,
  text: string,
  width: number,
  fontSize = 9
) {
  const lines = wrapText(text || "—", width, fonts.regular, fontSize);
  return 18 + Math.max(34, lines.length * (fontSize + 4) + 10);
}

function drawReportDetailsFooter(
  page: PDFPage,
  fonts: Fonts,
  summary: Summary
) {
  const footerTop = 52;
  const panelHeight = 32;
  const rowTop = footerTop - 12;

  page.drawRectangle({
    x: MARGIN_X,
    y: footerTop - panelHeight,
    width: CONTENT_WIDTH,
    height: panelHeight,
    borderColor: COLORS.strongBorder,
    borderWidth: 1.2,
    color: rgb(1, 1, 1),
  });

  drawField(
    page,
    fonts,
    MARGIN_X + 10,
    rowTop,
    165,
    "Officer Name",
    summary.officerName,
    { boldValue: true, lines: 1, valueSize: 8.2 }
  );

  drawField(
    page,
    fonts,
    MARGIN_X + 183,
    rowTop,
    72,
    "Officer ID",
    summary.officerId,
    { boldValue: true, lines: 1, valueSize: 8.2 }
  );

  drawField(
    page,
    fonts,
    MARGIN_X + 263,
    rowTop,
    68,
    "Date",
    summary.fiDate,
    { boldValue: true,lines: 1, valueSize: 8.2 }
  );

  drawField(
    page,
    fonts,
    MARGIN_X + 339,
    rowTop,
    74,
    "Day",
    summary.fiDay,
    { boldValue: true,lines: 1, valueSize: 8.2 }
  );

  drawField(
    page,
    fonts,
    MARGIN_X + 421,
    rowTop,
    56,
    "Time",
    summary.fiTime,
    { boldValue: true,lines: 1, valueSize: 8.2 }
  );

  drawField(
    page,
    fonts,
    MARGIN_X + 485,
    rowTop,
    36,
    "Beat",
    summary.beat,
    { boldValue: true,lines: 1, valueSize: 8.2 }
  );
}

function drawBadge(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  y: number,
  text: string
) {
  const value = textValue(text);
  const fontSize = 8.5;
  const padX = 6;
  const badgeHeight = 16;
  const width = fonts.bold.widthOfTextAtSize(value, fontSize) + padX * 2;

  page.drawRectangle({
    x,
    y: y - 14,
    width,
    height: badgeHeight,
    color: COLORS.badgeFill,
    borderColor: COLORS.border,
    borderWidth: 0.55,
  });

  page.drawText(value, {
    x: x + padX,
    y: y - 9.2,
    size: fontSize,
    font: fonts.bold,
    color: COLORS.text,
  });
}

async function drawImageBox(
  pdfDoc: PDFDocument,
  page: PDFPage,
  fonts: Fonts,
  x: number,
  yTop: number,
  w: number,
  h: number,
  imageUrl?: string | null,
  label?: string
) {
  if (label) {
    page.drawText(label, {
      x,
      y: yTop + 4,
      size: 7.2,
      font: fonts.regular,
      color: COLORS.muted,
    });
  }
function drawPhotoCaption(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  y: number,
  w: number,
  caption?: string | null
) {
  const text = String(caption ?? "").trim();
  if (!text) return;

  const lines = measureLines(text, w, fonts.bold, 7.2, 2);

  let yy = y;
  for (const line of lines) {
    const textWidth = fonts.bold.widthOfTextAtSize(line, 7.2);

    page.drawText(line, {
      x: x + (w - textWidth) / 2,
      y: yy,
      size: 7.2,
      font: fonts.bold,
      color: COLORS.text,
    });

    yy -= 8;
  }
}
  
  if (!imageUrl) {
    const msg = "No Photo";
    page.drawText(msg, {
      x: x + (w - fonts.regular.widthOfTextAtSize(msg, 8)) / 2,
      y: yTop - h / 2,
      size: 8,
      font: fonts.regular,
      color: COLORS.muted,
    });
    return;
  }


  const bytes = await readLocalUpload(imageUrl);
  if (!bytes) {
    const msg = "Missing Image";
    page.drawText(msg, {
      x: x + (w - fonts.regular.widthOfTextAtSize(msg, 8)) / 2,
      y: yTop - h / 2,
      size: 8,
      font: fonts.regular,
      color: COLORS.muted,
    });
    return;
  }

  try {
    const img = isPng(imageUrl)
      ? await pdfDoc.embedPng(bytes)
      : await pdfDoc.embedJpg(bytes);

    const imgSize = img.scale(1);
    const scale = Math.min(w / imgSize.width, h / imgSize.height);
    const drawW = imgSize.width * scale;
    const drawH = imgSize.height * scale;

    page.drawImage(img, {
      x: x + (w - drawW) / 2,
      y: yTop - h + (h - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  } catch {
    const msg = "Unsupported";
    page.drawText(msg, {
      x: x + (w - fonts.regular.widthOfTextAtSize(msg, 8)) / 2,
      y: yTop - h / 2,
      size: 8,
      font: fonts.regular,
      color: COLORS.muted,
    });
  }
}
function drawPhotoCaption(
  page: PDFPage,
  fonts: Fonts,
  x: number,
  y: number,
  w: number,
  caption?: string | null
) {
  const text = String(caption ?? "").trim();
  if (!text) return;

  const lines = measureLines(text, w, fonts.bold, 7.2, 2);

  let yy = y;
  for (const line of lines) {
    const textWidth = fonts.bold.widthOfTextAtSize(line, 7.2);

    page.drawText(line, {
      x: x + (w - textWidth) / 2,
      y: yy,
      size: 7.2,
      font: fonts.bold,
      color: COLORS.text,
    });

    yy -= 8;
  }
}


export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { id, fiId } = await context.params;

    const existingCase = await prisma.case.findFirst({
      where: {
        OR: [{ id }, { caseNumber: id }],
      },
      select: {
        id: true,
        caseNumber: true,
        incidentType: true,
        incidentDate: true,
        incidentTime: true,
        incidentLocation: true,
      },
    });

    if (!existingCase) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    const form = await prisma.caseForm.findFirst({
      where: {
        id: fiId,
        caseId: existingCase.id,
        formType: "FI",
      },
      include: {
        fiCard: {
          include: {
            photos: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
        formPersons: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            person: true,
          },
        },
      },
    });

    if (!form || !form.fiCard) {
      return NextResponse.json({ error: "FI form not found" }, { status: 404 });
    }

    const isCreator = form.createdById === currentUserId;
    const canRead = isCreator || form.isShared === true;

    if (!canRead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const fi = form.fiCard;
    const photos = fi.photos ?? [];

    const people: PersonView[] = form.formPersons.map((fp) => {
      const p = fp.person as any;

      return {
        fullName:
          p.fullName ||
          `${p.firstName ?? ""} ${p.middleName ?? ""} ${p.lastName ?? ""}`
            .replace(/\s+/g, " ")
            .trim() ||
          "Unknown",

        firstName: p.firstName,
        middleName: p.middleName,
        lastName: p.lastName,
        nickname: p.nickname,
        dob: p.dob,
        age: p.age,
        sex: p.sex,
        race: p.race,

        role: fp.role || "Subject",
        movementType: fp.movementType,
        isPrimary: fp.isPrimary,

        address: p.address,
        city: p.city,
        state: p.state,
        zip: p.zip,
        phone: p.phone,
        email: p.email,

        primaryLanguage: p.primaryLanguage ?? null,
        description: p.description ?? null,

        height: p.height,
        weight: p.weight,
        build: p.build,
        hairColor: p.hairColor,
        hairLength: p.hairLength,
        hairStyle: p.hairStyle,
        eyeColor: p.eyeColor,
        complexion: p.complexion ?? null,
        teeth: p.teeth ?? null,
        handPreference: p.handPreference ?? null,

        tattoos: p.tattoos,
        scars: p.scars,
        needleMarks: p.needleMarks,
        tracks: p.tracks,
        glasses: p.glasses,
        mustache: p.mustache,
        beard: p.beard,

        socialSecurity: p.socialSecurity,
        driverLicense: p.driverLicense,
        driverLicenseState: p.driverLicenseState,
        otherId: p.otherId,
        otherIdType: p.otherIdType,
        otherIdState: p.otherIdState,

        school: p.school,
        schoolAddress: p.schoolAddress,
        schoolCity: p.schoolCity,
        schoolState: p.schoolState,
        schoolZip: p.schoolZip,
        schoolPhone: p.schoolPhone,

        parentName: p.parentName,
        parentAddress: p.parentAddress,
        parentCity: p.parentCity,
        parentState: p.parentState,
        parentZip: p.parentZip,
        parentPhone: p.parentPhone,

        occupation: p.occupation,
        employerName: p.employerName,
        employerAddress: p.employerAddress,
        employerCity: p.employerCity,
        employerState: p.employerState,
        employerZip: p.employerZip,
        employerPhone: p.employerPhone,

        gangName: p.gangName ?? null,
        gangMembershipLength: p.gangMembershipLength ?? null,

        onParole: p.onParole ?? null,
        paroleOfficer: p.paroleOfficer ?? null,
        parolePhone: p.parolePhone ?? null,
        onProbation: p.onProbation ?? null,
        probationOfficer: p.probationOfficer ?? null,
        probationPhone: p.probationPhone ?? null,

        vehicleLicense: p.vehicleLicense ?? null,
        vehicleMake: p.vehicleMake ?? null,
        vehicleModel: p.vehicleModel ?? null,
        vehicleStyle: p.vehicleStyle ?? null,
        vehicleYear: p.vehicleYear ?? null,
        vehicleColor: p.vehicleColor ?? null,
        vehicleState: p.vehicleState ?? null,
        vehicleOddities: p.vehicleOddities ?? null,

        comments: p.comments ?? null,
      };
    });

    const primaryPerson = people.find((p) => p.isPrimary) || people[0] || null;

    const pdfDoc = await PDFDocument.create();
    const fonts: Fonts = {
      regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
      bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    };

    const summary: Summary = {
      caseNumber: textValue(existingCase.caseNumber),
      subjectName: textValue(primaryPerson?.fullName),
      incidentDate: textValue(fmtDate((fi as any).incidentDate || existingCase.incidentDate)),
      incidentTime: textValue((fi as any).incidentTime || existingCase.incidentTime),
      incidentType: textValue((fi as any).incidentType || existingCase.incidentType),
      incidentLocation: textValue((fi as any).incidentLocation || existingCase.incidentLocation),

      officerName: textValue((fi as any).officerName),
      officerId: textValue((fi as any).officerId),
      fiDate: textValue(fmtDate((fi as any).fiDate)),
      fiDay: textValue((fi as any).fiDay),
      fiTime: textValue((fi as any).fiTime),
      beat: textValue((fi as any).beat),
    };

    let cursor = createPage(pdfDoc, fonts, 1, summary);

    // 1) PHOTOS
    {
      const sectionHeight = 18 + 118 + 12;
      cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

      drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Photos");
      cursor.y -= 18;
      drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, 118);

      const photoGap = 10;
      const innerX = MARGIN_X + INNER_PAD_X;
      const photoW = (CONTENT_WIDTH - INNER_PAD_X * 2 - photoGap * 2) / 3;
      const photoH = 88;
      const photoY = cursor.y - 16;

      await drawImageBox(
        pdfDoc,
        cursor.page,
        fonts,
        innerX,
        photoY,
        photoW,
        photoH,
        photos[0]?.url ?? null,
      );
drawPhotoCaption(
  cursor.page,
  fonts,
  innerX,
  photoY - photoH - 10,
  photoW,
  (photos[0] as any)?.caption
);

      await drawImageBox(
        pdfDoc,
        cursor.page,
        fonts,
        innerX + photoW + photoGap,
        photoY,
        photoW,
        photoH,
        photos[1]?.url ?? null,
      );

      drawPhotoCaption(
  cursor.page,
  fonts,
  innerX + photoW + photoGap,
  photoY - photoH - 10,
  photoW,
  (photos[1] as any)?.caption
);


      await drawImageBox(
        pdfDoc,
        cursor.page,
        fonts,
        innerX + (photoW + photoGap) * 2,
        photoY,
        photoW,
        photoH,
        photos[2]?.url ?? null,
      );

   drawPhotoCaption(
  cursor.page,
  fonts,
  innerX + (photoW + photoGap) * 2,
  photoY - photoH - 10,
  photoW,
  (photos[2] as any)?.caption
);

      cursor.y -= 126;
    }

    // 2) SUBJECT INFORMATION
// 2) SUBJECT INFORMATION
{
  const panelHeight = 118;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Subject Information");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 5;
  const gutter = 8;
  let rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Subject Type", textValue((fi as any).subjectType), { boldValue: true });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "First Name", textValue(primaryPerson?.firstName), { boldValue: true });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Middle Name", textValue(primaryPerson?.middleName), { boldValue: true });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Last Name", textValue(primaryPerson?.lastName), { boldValue: true });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "NickName", textValue(primaryPerson?.nickname), { boldValue: true });

  rowTop -= 29;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Sex", textValue(primaryPerson?.sex), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "DOB", textValue(fmtDate(primaryPerson?.dob)), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Age", numberValue(primaryPerson?.age), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Race", textValue(primaryPerson?.race), { boldValue: true ,lines: 2 });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "Primary Language", textValue(primaryPerson?.primaryLanguage), { boldValue: true ,lines: 1 });

  rowTop -= 29;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(2, cols, gutter), "Address", textValue(primaryPerson?.address), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "City", textValue(primaryPerson?.city), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "State", textValue(primaryPerson?.state), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "Zip", textValue(primaryPerson?.zip), { boldValue: true ,lines: 1 });

  rowTop -= 29;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(2, cols, gutter), "Email", textValue(primaryPerson?.email), { valueSize: 8.0, boldValue: true , lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(2, cols, gutter), "Telephone", textValue(primaryPerson?.phone), { valueSize: 8.0, boldValue: true , lines: 1 });

  cursor.y -= panelHeight + 6;
}

    // 3) PHYSICAL DESCRIPTIONS
   // 3) PHYSICAL DESCRIPTIONS
{
  const panelHeight = 66;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Physical Descriptors");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 4;
  const gutter = 8;
  let rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Height", textValue(primaryPerson?.height), { boldValue: true , lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Weight", textValue(primaryPerson?.weight), {boldValue: true , lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Build", textValue(primaryPerson?.build), { boldValue: true , lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Eyes", textValue(primaryPerson?.eyeColor), { boldValue: true , lines: 1 });

  rowTop -= 28;

  drawField(
    cursor.page,
    fonts,
    colX(0, cols, gutter),
    rowTop,
    colW(1, cols, gutter),
    "Hair",
    textValue([primaryPerson?.hairColor, primaryPerson?.hairLength, primaryPerson?.hairStyle].filter(Boolean).join(", ")),
    { boldValue: true , lines: 1 }
  );
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Complexion", textValue(primaryPerson?.complexion), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Teeth", textValue(primaryPerson?.teeth), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Hand Preference", textValue(primaryPerson?.handPreference), { boldValue: true ,lines: 1 });

  cursor.y -= panelHeight + 6;
}

    // 4) IDENTIFIERS
  // 4) IDENTIFIERS
{
  const panelHeight = 66;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Identifiers");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 3;
  const gutter = 8;
  let rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Tattoos", textValue(primaryPerson?.tattoos), { boldValue: true ,lines: 1 });
  drawField(
    cursor.page,
    fonts,
    colX(1, cols, gutter),
    rowTop,
    colW(2, cols, gutter),
    "Scars / Marks / Tracks",
    textValue([primaryPerson?.scars, primaryPerson?.needleMarks, primaryPerson?.tracks].filter(Boolean).join(" • ")),
    { boldValue: true ,lines: 1 }
  );

  rowTop -= 28;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Glasses", textValue(primaryPerson?.glasses), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Mustache", textValue(primaryPerson?.mustache), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Beard", textValue(primaryPerson?.beard), { boldValue: true ,lines: 1 });

  cursor.y -= panelHeight + 6;
}

// 5) ID INFORMATION
{
  const panelHeight = 52;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "ID Information");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 5;
  const gutter = 8;
  const rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Social Security", textValue(primaryPerson?.socialSecurity), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Driver License", textValue(primaryPerson?.driverLicense), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "DL State", textValue(primaryPerson?.driverLicenseState), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Other ID", textValue(primaryPerson?.otherId), { boldValue: true ,lines: 1 });
  drawField(
    cursor.page,
    fonts,
    colX(4, cols, gutter),
    rowTop,
    colW(1, cols, gutter),
    "ID Type / Country / State",
    `${textValue(primaryPerson?.otherIdType)} / ${textValue((primaryPerson as any)?.otherIdCountry)} / ${textValue(primaryPerson?.otherIdState)}`,
    { boldValue: true , lines: 2, valueSize: 7.7 }
  );

  cursor.y -= panelHeight + 6;
}

   // 6) GANG INFORMATION
{
  const panelHeight = 38;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Gang Information");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 2;
  const gutter = 10;
  const rowTop = cursor.y - 12;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Gang Name", textValue(primaryPerson?.gangName), { valueSize: 8.2, boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Gang Membership Length", textValue(primaryPerson?.gangMembershipLength), { valueSize: 8.2, boldValue: true ,lines: 1 });

  cursor.y -= panelHeight + 6;
}

   // 7) SCHOOL / PARENT / EMPLOYER
{
  const panelHeight = 108;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "School / Parent / Employer");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 6;
  const gutter = 8;
  let rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "School", textValue(primaryPerson?.school), { boldValue: true, valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(2, cols, gutter), "Address", textValue(primaryPerson?.schoolAddress), { valueSize: 8.2, boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "City", textValue(primaryPerson?.schoolCity), { valueSize: 8.2, boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "State", textValue(primaryPerson?.schoolState), { valueSize: 8.2, boldValue: true ,lines: 1 });
  drawField(
    cursor.page,
    fonts,
    colX(5, cols, gutter),
    rowTop,
    colW(1, cols, gutter),
    "ZIP / Phone",
    textValue([primaryPerson?.schoolZip, primaryPerson?.schoolPhone].filter(Boolean).join("  |  ")),
    { valueSize: 7.7, boldValue: true ,lines: 2 }
  );

  rowTop -= 32;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Parent / Guardian", textValue(primaryPerson?.parentName), { boldValue: true, valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(2, cols, gutter), "Address", textValue(primaryPerson?.parentAddress), { boldValue: true ,valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "City", textValue(primaryPerson?.parentCity), { boldValue: true ,valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "State", textValue(primaryPerson?.parentState), { boldValue: true ,valueSize: 8.2, lines: 1 });
  drawField(
    cursor.page,
    fonts,
    colX(5, cols, gutter),
    rowTop,
    colW(1, cols, gutter),
    "ZIP / Phone",
    textValue([primaryPerson?.parentZip, primaryPerson?.parentPhone].filter(Boolean).join("  |  ")),
    { valueSize: 7.7, lines: 2 }
  );

  rowTop -= 32;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Employer", textValue(primaryPerson?.employerName), { boldValue: true, valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(2, cols, gutter), "Address", textValue(primaryPerson?.employerAddress), { boldValue: true ,valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "City", textValue(primaryPerson?.employerCity), {boldValue: true , valueSize: 8.2, lines: 1 });
  drawField(cursor.page, fonts, colX(4, cols, gutter), rowTop, colW(1, cols, gutter), "State", textValue(primaryPerson?.employerState), { boldValue: true ,valueSize: 8.2, lines: 1 });
  drawField(
    cursor.page,
    fonts,
    colX(5, cols, gutter),
    rowTop,
    colW(1, cols, gutter),
    "ZIP / Phone",
    textValue([primaryPerson?.employerZip, primaryPerson?.employerPhone].filter(Boolean).join("  |  ")),
    { valueSize: 7.7, boldValue: true ,lines: 2 }
  );

  cursor.y -= panelHeight + 6;
}



   // 8) PAROLE / PROBATION STATUS
{
  const panelHeight = 66;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Parole / Probation Status");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const cols = 3;
  const gutter = 8;
  let rowTop = cursor.y - 13;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "On Parole", textValue(primaryPerson?.onParole === true ? "Yes" : primaryPerson?.onParole === false ? "No" : "—"), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Parole Officer", textValue(primaryPerson?.paroleOfficer), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Parole Phone", textValue(primaryPerson?.parolePhone), { boldValue: true ,lines: 1 });

  rowTop -= 30;

  drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "On Probation", textValue(primaryPerson?.onProbation === true ? "Yes" : primaryPerson?.onProbation === false ? "No" : "—"), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Probation Officer", textValue(primaryPerson?.probationOfficer), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Probation Phone", textValue(primaryPerson?.probationPhone), { boldValue: true ,lines: 1 });

  cursor.y -= panelHeight + 6;
}

    // 9) VEHICLE
{
  const hasVehicle =
    nonEmpty(primaryPerson?.vehicleLicense) ||
    nonEmpty(primaryPerson?.vehicleMake) ||
    nonEmpty(primaryPerson?.vehicleModel) ||
    nonEmpty(primaryPerson?.vehicleStyle) ||
    nonEmpty(primaryPerson?.vehicleYear) ||
    nonEmpty(primaryPerson?.vehicleColor) ||
    nonEmpty(primaryPerson?.vehicleState) ||
    nonEmpty(primaryPerson?.vehicleOddities);

  if (!hasVehicle) {
    const panelHeight = 28;
    const sectionHeight = 18 + panelHeight + 8;
    cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

    drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Vehicle");
    cursor.y -= 18;
    drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

    cursor.page.drawText("No vehicle associated with this contact.", {
      x: MARGIN_X + 10,
      y: cursor.y - 18,
      size: 8.6,
      font: fonts.regular,
      color: COLORS.muted,
    });

    cursor.y -= panelHeight + 6;
  } else {
    const panelHeight = 66;
    const sectionHeight = 18 + panelHeight + 8;
    cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

    drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Vehicle");
    cursor.y -= 18;
    drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

    const cols = 4;
    const gutter = 8;
    let rowTop = cursor.y - 13;

    drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "License", textValue(primaryPerson?.vehicleLicense), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Make", textValue(primaryPerson?.vehicleMake), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "Model", textValue(primaryPerson?.vehicleModel), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Body Style", textValue(primaryPerson?.vehicleStyle), { boldValue: true ,lines: 1 });

    rowTop -= 30;

    drawField(cursor.page, fonts, colX(0, cols, gutter), rowTop, colW(1, cols, gutter), "Year", textValue(primaryPerson?.vehicleYear), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(1, cols, gutter), rowTop, colW(1, cols, gutter), "Color", textValue(primaryPerson?.vehicleColor), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(2, cols, gutter), rowTop, colW(1, cols, gutter), "State", textValue(primaryPerson?.vehicleState), { boldValue: true ,lines: 1 });
    drawField(cursor.page, fonts, colX(3, cols, gutter), rowTop, colW(1, cols, gutter), "Oddities", textValue(primaryPerson?.vehicleOddities), { boldValue: true ,lines: 1 });

    cursor.y -= panelHeight + 6;
  }
}

    // 10) COMMENTS
    // 10) COMMENTS
{
  const commentsText = textValue(primaryPerson?.comments);
  const panelHeight = estimateParagraphPanelHeight(fonts, commentsText, CONTENT_WIDTH - 20, 9);
  cursor = ensureSpace(pdfDoc, cursor, 18 + panelHeight + 10, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Comments");
  cursor.y -= 18;

  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  drawParagraph(
    cursor.page,
    fonts,
    MARGIN_X + 10,
    cursor.y - 16,
    CONTENT_WIDTH - 20,
    commentsText,
    9,
    false
  );

  cursor.y -= panelHeight + 8;
}
    // 11) STOP DISPOSITION
{
  const panelHeight = 46;
  const sectionHeight = 18 + panelHeight + 8;
  cursor = ensureSpace(pdfDoc, cursor, sectionHeight, fonts, summary);

  drawSectionHeader(cursor.page, fonts, MARGIN_X, cursor.y, CONTENT_WIDTH, "Stop Disposition");
  cursor.y -= 18;
  drawPanel(cursor.page, MARGIN_X, cursor.y, CONTENT_WIDTH, panelHeight);

  const rowTop = cursor.y - 13;
  drawField(cursor.page, fonts, MARGIN_X + 10, rowTop, 190, "Reason for Stop", textValue((fi as any).reasonForStop), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, MARGIN_X + 208, rowTop, 220, "Location of Stop", textValue((fi as any).locationOfStop || existingCase.incidentLocation), { boldValue: true ,lines: 1 });
  drawField(cursor.page, fonts, MARGIN_X + 436, rowTop, 250, "Disposition", textValue((fi as any).disposition), { boldValue: true ,lines: 1 });
 
  cursor.y -= panelHeight + 6;
}


    const bytes = await pdfDoc.save();
    const buffer = Buffer.from(bytes);
    const fileName = `${safeFilePart(existingCase.caseNumber)} - FI Report.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("GET /api/cases/[id]/forms/fi/[fiId]/pdf failed:", error);

    return NextResponse.json(
      { error: error?.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}