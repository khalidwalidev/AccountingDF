import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return NextResponse.json(await prisma.account.findMany({ orderBy: [{ type: "asc" }, { code: "asc" }] }));
}
