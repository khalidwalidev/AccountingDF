import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return NextResponse.json(await prisma.customer.findMany({ orderBy: { name: "asc" } }));
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json(await prisma.customer.create({ data: body }), { status: 201 });
}
