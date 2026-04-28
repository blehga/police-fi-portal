import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getTenantPrisma } from "@/lib/tenant-prisma";
import { requirePermission } from "@/lib/require-permission";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string; narrativeId: string }>;
};

function fmtDate(value: Date | string | null | undefined) {
  if (!value) return "";

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

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return "";
    return `${value.getUTCMonth() + 1}/${value.getUTCDate()}/${value.getUTCFullYear()}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getUTCMonth() + 1}/${parsed.getUTCDate()}/${parsed.getUTCFullYear()}`;
}

function textValue(value: unknown) {
  const text = String(value ?? "").trim();
  return text || "—";
}

function safeFilePart(value: string | null | undefined) {
  return (value || "").trim().replace(/[<>:"/\\|?*\x00-\x1F]/g, "");
}

function escapeHtml(value: string) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const auth = await requirePermission("REPORT_READ");
    if (!auth.ok) return auth.response;

    const session: any = auth.session;
    const currentUserId = session?.user?.id;
    const tenantDbName = session?.tenantDbName;

    if (!currentUserId || !tenantDbName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getTenantPrisma(tenantDbName);

    const { id, narrativeId } = await context.params;

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
        id: narrativeId,
        caseId: existingCase.id,
        formType: "NARRATIVE",
      },
      include: {
        narrative: true,
      },
    });

    if (!form || !form.narrative) {
      return NextResponse.json(
        { error: "Narrative form not found" },
        { status: 404 }
      );
    }

    const isCreator = form.createdById === currentUserId;
    const canRead = isCreator || form.isShared === true;

    if (!canRead) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const narrative = form.narrative;

    const summary = {
      caseNumber: textValue(existingCase.caseNumber),
      incidentDate: textValue(fmtDate(existingCase.incidentDate)),
      incidentTime: textValue(existingCase.incidentTime),
      incidentType: textValue(existingCase.incidentType),
      incidentLocation: textValue(existingCase.incidentLocation),
      officerName: textValue(narrative.officerName),
      officerId: textValue(narrative.officerId),
      narrativeDate: textValue(fmtDate(narrative.narrativeDate)),
      narrativeDay: textValue(narrative.narrativeDay),
      narrativeTime: textValue(narrative.narrativeTime),
      beat: textValue(narrative.beat),
    };

    const bodyHtml = `
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            html, body {
              margin: 0;
              padding: 0;
              font-family: Arial, Helvetica, sans-serif;
              color: #1f2937;
              font-size: 12px;
            }

            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }

            .section-header {
              background: #f1f1f1;
              border: 1px solid #d6d6d6;
              font-weight: 700;
              font-size: 13px;
              padding: 6px 10px;
              margin: 0 0 12px;
            }

            .narrative-body {
              word-break: break-word;
              overflow-wrap: break-word;
            }

            .narrative-body h1 {
              font-size: 24px;
              line-height: 1.25;
              margin: 0 0 12px;
              font-weight: 700;
            }

            .narrative-body h2 {
              font-size: 18px;
              line-height: 1.3;
              margin: 14px 0 10px;
              font-weight: 700;
            }

            .narrative-body h3 {
              font-size: 15px;
              line-height: 1.3;
              margin: 12px 0 8px;
              font-weight: 700;
            }

            .narrative-body p {
              margin: 0 0 10px;
              line-height: 1.55;
            }

            .narrative-body ul {
              margin: 8px 0 12px;
              padding-left: 24px;
              list-style-type: disc;
            }

            .narrative-body ol {
              margin: 8px 0 12px;
              padding-left: 24px;
              list-style-type: decimal;
            }

            .narrative-body li {
              margin: 4px 0;
              line-height: 1.5;
            }

            .narrative-body a {
              color: #1155cc;
              text-decoration: underline;
            }

            .narrative-body blockquote {
              margin: 10px 0;
              padding-left: 12px;
              border-left: 3px solid #cbd5e1;
              color: #475569;
            }

            .narrative-body * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          </style>
        </head>
        <body>
          <div class="section-header">NARRATIVE</div>
          <div class="narrative-body">
            ${narrative.narrativeText || "<p>—</p>"}
          </div>
        </body>
      </html>
    `;

    const headerTemplate = `
      <div style="
        width: 100%;
        box-sizing: border-box;
        padding: 0 34px;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
        font-size: 12px;
      ">
        <div style="
          position: relative;
          width: 100%;
          padding-top: 8px;
        ">
          <div style="
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            line-height: 1.2;
            margin-bottom: 16px;
          ">
            NARRATIVE REPORT
          </div>

          <div style="
            position: absolute;
            top: 12px;
            right: 0;
            font-size: 11px;
            color: #6b7280;
          ">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>

          <div style="
            border: 1.5px solid #333;
            background: #fff;
            padding: 10px 12px;
            width: 100%;
            box-sizing: border-box;
          ">
            <table style="
              width: 100%;
              border-collapse: collapse;
              table-layout: fixed;
              font-size: 12px;
            ">
              <tr>
                <td style="width: 33.33%; padding: 0 14px 8px 0; vertical-align: top;">
                  <span>Case #: </span>
                  <span style="font-weight: 700;">${escapeHtml(summary.caseNumber)}</span>
                </td>
                <td style="width: 33.33%; padding: 0 14px 8px 0; vertical-align: top;">
                  <span>Incident Date: </span>
                  <span style="font-weight: 700;">${escapeHtml(summary.incidentDate)}</span>
                </td>
                <td style="width: 33.33%; padding: 0; vertical-align: top;">
                  <span>Incident Time: </span>
                  <span style="font-weight: 700;">${escapeHtml(summary.incidentTime)}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 0 14px 0 0; vertical-align: top;">
                  <span>Incident Type: </span>
                  <span style="font-weight: 700;">${escapeHtml(summary.incidentType)}</span>
                </td>
                <td colspan="2" style="padding: 0; vertical-align: top;">
                  <span>Incident Location: </span>
                  <span style="font-weight: 700;">${escapeHtml(summary.incidentLocation)}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    `;

    const footerTemplate = `
      <div style="
        width: 100%;
        box-sizing: border-box;
        padding: 0 34px 12px;
        font-family: Arial, Helvetica, sans-serif;
        color: #1f2937;
        font-size: 10px;
      ">
        <div style="
          border: 1.5px solid #333;
          background: #fff;
          padding: 10px 12px;
          width: 100%;
          box-sizing: border-box;
        ">
          <table style="
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            font-size: 10px;
          ">
            <tr>
              <td style="padding-right: 12px; vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Officer Name</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.officerName)}</div>
              </td>
              <td style="padding-right: 12px; vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Officer ID</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.officerId)}</div>
              </td>
              <td style="padding-right: 12px; vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Date</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.narrativeDate)}</div>
              </td>
              <td style="padding-right: 12px; vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Day</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.narrativeDay)}</div>
              </td>
              <td style="padding-right: 12px; vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Time</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.narrativeTime)}</div>
              </td>
              <td style="vertical-align: top;">
                <div style="color: #666; margin-bottom: 4px;">Beat</div>
                <div style="font-size: 12px; font-weight: 700;">${escapeHtml(summary.beat)}</div>
              </td>
            </tr>
          </table>
        </div>
      </div>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      await page.setContent(bodyHtml, {
        waitUntil: "networkidle0",
      });

      const pdf = await page.pdf({
        format: "letter",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate,
        footerTemplate,
        margin: {
          top: "150px",
          right: "34px",
          bottom: "95px",
          left: "34px",
        },
      });

      const buffer = Buffer.from(pdf);
      const fileName = `${safeFilePart(existingCase.caseNumber)} - Narrative Report.pdf`;

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${fileName}"`,
          "Cache-Control": "no-store",
        },
      });
    } finally {
      await browser.close();
    }
  } catch (error: any) {
    console.error(
      "GET /api/cases/[id]/forms/narrative/[narrativeId]/pdf failed:",
      error
    );

    return NextResponse.json(
      { error: error?.message || "Failed to generate Narrative PDF" },
      { status: 500 }
    );
  }
}