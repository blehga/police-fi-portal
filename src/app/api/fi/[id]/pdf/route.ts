import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { promises as fs } from "fs";
import path from "path";
import { requireTenantAccess } from "@/lib/tenant-session";

export const dynamic = "force-dynamic";

function fmt(dt: Date | string | null | undefined) {
  if (!dt) return "";
  return new Date(dt).toLocaleString();
}

function safeFilePart(value: string | null | undefined) {
  return (value || "")
    .trim()
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
}

async function readLocalUpload(url: string): Promise<Buffer | null> {
  if (!url.startsWith("/uploads/")) return null;

  const relativePath = url.replace(/^\/+/, "");
  const fp = path.join(process.cwd(), "public", relativePath);

  try {
    return await fs.readFile(fp);
  } catch {
    return null;
  }
}

function isPng(url: string) {
  return /\.png$/i.test(url);
}

function canViewFi(fi: any, currentUserId: string) {
  return fi.createdById === currentUserId || !!fi.isShared;
}

type FiPdfRow = {
  id: string;
  caseNumber: string;
  firstName: string;
  lastName: string;
  subjectType: string;
  incidentType: string;
  yearYY: number;
  seq: number;
  createdById: string;
  isShared: number | boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  photoId: string | null;
  photoUrl: string | null;
  photoCreatedAt: string | Date | null;
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const access = await requireTenantAccess({
      permissionCode: "REPORT_READ",
      req,
      route: `/api/fi/${params.id}/pdf`,
      method: "GET",
    });

    if (!access.ok) {
      return NextResponse.json(
        { error: access.error },
        { status: access.status }
      );
    }

    const { db, session } = access;
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [rows] = await db.query(
      `
      SELECT
        f.id,
        f.caseNumber,
        f.firstName,
        f.lastName,
        f.subjectType,
        f.incidentType,
        f.yearYY,
        f.seq,
        f.createdById,
        f.isShared,
        f.createdAt,
        f.updatedAt,
        p.id AS photoId,
        p.url AS photoUrl,
        p.createdAt AS photoCreatedAt
      FROM ficard f
      LEFT JOIN fiphoto p
        ON p.fiCardId = f.id
      WHERE f.id = ?
      ORDER BY p.createdAt ASC
      `,
      [params.id]
    );

    const resultRows = (rows as FiPdfRow[]) ?? [];

    if (!resultRows.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const base = resultRows[0];

    if (!canViewFi(base, currentUserId)) {
      return NextResponse.json(
        { error: "You do not have permission to view this PDF" },
        { status: 403 }
      );
    }

    const photos = resultRows
      .filter((row) => !!row.photoId && !!row.photoUrl)
      .map((row) => ({
        id: row.photoId as string,
        url: row.photoUrl as string,
        createdAt: row.photoCreatedAt,
      }));

    const fi = {
      id: base.id,
      caseNumber: base.caseNumber,
      firstName: base.firstName,
      lastName: base.lastName,
      subjectType: base.subjectType,
      incidentType: base.incidentType,
      yearYY: Number(base.yearYY),
      seq: Number(base.seq),
      createdById: base.createdById,
      isShared: !!base.isShared,
      createdAt: base.createdAt,
      updatedAt: base.updatedAt,
      photos,
    };

    const pdfDoc = await PDFDocument.create();
    const firstPage = pdfDoc.addPage([595.28, 841.89]);
    const { width } = firstPage.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = firstPage;
    let y = 800;
    const lh = 20;

    const title = "Field Interview Card";
    const caseLine = `Case #: ${fi.caseNumber}`;

    const titleWidth = fontBold.widthOfTextAtSize(title, 18);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y,
      size: 18,
      font: fontBold,
    });

    y -= lh;

    const caseWidth = font.widthOfTextAtSize(caseLine, 12);
    page.drawText(caseLine, {
      x: (width - caseWidth) / 2,
      y,
      size: 12,
      font,
    });

    y -= lh * 1.5;

    page.drawLine({
      start: { x: 50, y },
      end: { x: width - 50, y },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    y -= lh;

    const drawRow = (label: string, value: string) => {
      page.drawText(label, { x: 50, y, size: 12, font: fontBold });
      page.drawText(value || "", { x: 200, y, size: 12, font });
      y -= lh;
    };

    drawRow("First Name", fi.firstName);
    drawRow("Last Name", fi.lastName);
    drawRow("Subject Type", fi.subjectType);
    drawRow("Incident Type", fi.incidentType);
    drawRow("Created", fmt(fi.createdAt));
    drawRow("Updated", fmt(fi.updatedAt));
    drawRow("Sequence (YY-SEQ)", `${fi.yearYY}-${String(fi.seq).padStart(4, "0")}`);

    y -= lh / 2;

    if (fi.photos.length > 0) {
      page.drawLine({
        start: { x: 50, y },
        end: { x: width - 50, y },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });

      y -= lh;

      page.drawText("Photos", { x: 50, y, size: 14, font: fontBold });

      y -= lh;

      const boxW = 160;
      const boxH = 120;
      const gapX = 20;
      const marginX = 50;
      const minNeeded = boxH + lh * 2;

      let currentPage = page;
      let currentY = y;

      const ensureSpace = () => {
        if (currentY - minNeeded < 50) {
          currentPage = pdfDoc.addPage([595.28, 841.89]);
          currentY = 800;
          currentPage.drawText("Photos (cont.)", {
            x: 50,
            y: currentY,
            size: 14,
            font: fontBold,
          });
          currentY -= lh * 1.5;
        }
      };

      let col = 0;
      let x = marginX;

      for (const p of fi.photos.slice(0, 3)) {
        ensureSpace();

        const bytes = await readLocalUpload(p.url);

        if (!bytes) {
          currentPage.drawRectangle({
            x,
            y: currentY - boxH,
            width: boxW,
            height: boxH,
            borderColor: rgb(0.8, 0.2, 0.2),
            borderWidth: 1,
          });

          currentPage.drawText("Missing image", {
            x: x + 10,
            y: currentY - boxH + 10,
            size: 10,
            font,
          });
        } else {
          try {
            const img = isPng(p.url)
              ? await pdfDoc.embedPng(bytes)
              : await pdfDoc.embedJpg(bytes);

            const imgSize = img.scale(1);
            const scale = Math.min(boxW / imgSize.width, boxH / imgSize.height);
            const drawW = imgSize.width * scale;
            const drawH = imgSize.height * scale;
            const imgX = x + (boxW - drawW) / 2;
            const imgY = currentY - boxH + (boxH - drawH) / 2;

            currentPage.drawRectangle({
              x,
              y: currentY - boxH,
              width: boxW,
              height: boxH,
              borderColor: rgb(0.85, 0.85, 0.85),
              borderWidth: 1,
            });

            currentPage.drawImage(img, {
              x: imgX,
              y: imgY,
              width: drawW,
              height: drawH,
            });
          } catch {
            currentPage.drawRectangle({
              x,
              y: currentY - boxH,
              width: boxW,
              height: boxH,
              borderColor: rgb(0.8, 0.2, 0.2),
              borderWidth: 1,
            });

            currentPage.drawText("Unsupported image", {
              x: x + 10,
              y: currentY - boxH + 10,
              size: 10,
              font,
            });
          }
        }

        col += 1;

        if (col < 3) {
          x += boxW + gapX;
        } else {
          col = 0;
          x = marginX;
          currentY -= boxH + lh * 1.5;
        }
      }

      y = currentY - lh;
    }

    const lastPage = pdfDoc.getPages()[pdfDoc.getPageCount() - 1];

    lastPage.drawLine({
      start: { x: 50, y: 60 },
      end: { x: width - 50, y: 60 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    lastPage.drawText(`Generated: ${fmt(new Date())}`, {
      x: 50,
      y: 40,
      size: 10,
      font,
    });

    const bytes = await pdfDoc.save();
    const buffer = Buffer.from(bytes);

    const subjectName = `${fi.firstName || ""} ${fi.lastName || ""}`.trim();
    const incident = safeFilePart(fi.incidentType);
    const fileName = `${safeFilePart(fi.caseNumber)} - ${safeFilePart(
      subjectName
    )} - ${incident}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("PDF error", e);
    return NextResponse.json(
      { error: e?.message || "Failed to generate PDF" },
      { status: 500 }
    );
  }
}