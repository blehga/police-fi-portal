import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { PDFDocument } from "pdf-lib";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const caseData = await prisma.case.findUnique({
      where: { id },
      select: {
        id: true,
        forms: {
          where: {
            isShared: true,
          },
          select: {
            id: true,
            formType: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!caseData) {
      return NextResponse.json({ error: "Case not found" }, { status: 404 });
    }

    if (caseData.forms.length === 0) {
      return NextResponse.json(
        { error: "No public reports found" },
        { status: 404 }
      );
    }

    const cookieStore = await cookies();
    const headerStore = await headers();

    const host = headerStore.get("host");
    if (!host) {
      return NextResponse.json({ error: "Missing host" }, { status: 500 });
    }

    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const mergedPdf = await PDFDocument.create();

    for (const form of caseData.forms) {
      const pdfUrl =
        form.formType === "FI"
          ? `${protocol}://${host}/api/cases/${id}/forms/fi/${form.id}/pdf`
          : `${protocol}://${host}/api/cases/${id}/forms/narrative/${form.id}/pdf`;

      const pdfRes = await fetch(pdfUrl, {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      });

      if (!pdfRes.ok) continue;

      const pdfBytes = await pdfRes.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const finalPdf = await mergedPdf.save();

    return new NextResponse(Buffer.from(finalPdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="public-reports-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("GET public reports PDF failed:", error);
    return NextResponse.json(
      { error: "Failed to generate public reports PDF" },
      { status: 500 }
    );
  }
}