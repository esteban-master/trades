import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: {params: Promise<{ id:string }> },
) {
  const { id } = await params;
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: { accounts: true }
    });

    if (!company) {
      return NextResponse.json(
        { name: 'Not found', message: 'Empresa no existe.' },
        { status: 404 },
      );
    }

    return NextResponse.json(company);
  } catch (error) {
    return NextResponse.json(
      { name: 'Internal server', message: error },
      { status: 500 },
    );
  }
}

