import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: {params: Promise<{ id:string }> },
) {
  const { id } = await params
  try {
    const account = await prisma.account.findUnique({
      where: { id },
      include: { trades: { include: { symbol: { include: { commissions: true } } } } }
    });

    if (!account) {
      return NextResponse.json(
        { name: 'Not found', message: 'Cuenta no existe.' },
        { status: 404 },
      );
    }

    return NextResponse.json(account);
  } catch (error) {
    return NextResponse.json(
      { name: 'Internal server', message: error },
      { status: 500 },
    );
  }
}

