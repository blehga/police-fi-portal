// app/api/tenants/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/platform-client";

const prisma = new PrismaClient();

export async function GET() {
  try {
   const tenants = await prisma.organization.findMany({
  select: {
    name: true,
    slug: true,
  },
  orderBy: {
    name: "asc",
  },
});

    return NextResponse.json(tenants);
  } catch (error) {
    console.error("Failed to fetch tenants:", error);

    return NextResponse.json(
      { error: "Failed to fetch tenants" },
      { status: 500 }
    );
  }
}