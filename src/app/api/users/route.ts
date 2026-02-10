import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  return NextResponse.json(await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }));
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      role: body.role,
      passwordHash: await bcrypt.hash(body.password, 12)
    }
  });
  return NextResponse.json({ id: user.id }, { status: 201 });
}
