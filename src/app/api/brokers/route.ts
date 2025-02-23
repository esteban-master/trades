import prisma from '@/lib/prisma'
import { brokerValidator } from './Broker';
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export async function GET() {
    const brokers = await prisma.broker.findMany();

    return NextResponse.json(brokers); 
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name } = brokerValidator.parse(body);

        await prisma.broker.create({ data: { id, name } })

        return NextResponse.json(null, { status: 201 })
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
              {
                name: 'Invalid request',
                message: error.issues,
              },
              { status: 400 },
            );
          }
      
          if (error instanceof Error) {
            return NextResponse.json(
              { name: 'Bad request', message: error.message },
              { status: 500 },
            );
          }
          return NextResponse.json(
            { name: 'Internal server', message: error },
            { status: 400 },
          );
    }
}