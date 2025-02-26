import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { companyValidator } from './Company';

export async function GET() {
    const companies = await prisma.company.findMany();

    return NextResponse.json(companies); 
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name } = companyValidator.parse(body);

        await prisma.company.create({ data: { id, name } })

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