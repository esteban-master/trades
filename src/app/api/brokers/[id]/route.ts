import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: {params: Promise<{ id:string }> },
) {
  const { id } = await params;
  try {
    const broker = await prisma.broker.findUnique({
      where: { id },
      include: {accounts: { include: { trades: true } }, commissions: { include: { symbol: true } }}
    });

    if (!broker) {
      return NextResponse.json(
        { name: 'Not found', message: 'Broker no existe.' },
        { status: 404 },
      );
    }

    return NextResponse.json(broker);
  } catch (error) {
    return NextResponse.json(
      { name: 'Internal server', message: error },
      { status: 500 },
    );
  }
}

