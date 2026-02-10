import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return NextResponse.json(await prisma.companySetting.findFirst());
}

export async function POST(request: Request) {
  const data = await request.json();
  const setting = await prisma.companySetting.upsert({
    where: { id: data.id ?? "default-company" },
    update: data,
    create: { ...data, id: data.id ?? "default-company" }
  });
  return NextResponse.json(setting);
}
