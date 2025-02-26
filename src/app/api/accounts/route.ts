import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';
import { accountValidator } from './Account';
import { ZodError } from 'zod';
import { type NextRequest } from 'next/server'
 
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  
  const accounts = await prisma.account.findMany({
      where: companyId ? { companyId } : undefined,
      include: {
        trades: {
          include: {
              symbol: {
                  include: {
                      commissions: true
                  }
              }
          }
        }}
  });

    return NextResponse.json(accounts); 
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name, companyId, createAt, value } = accountValidator.parse(body);

        await prisma.account.create({ data: { id, name, companyId, value, createAt } })

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