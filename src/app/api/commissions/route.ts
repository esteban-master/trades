import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

import { ZodError } from "zod";
import { commissionValidator } from "./Commision";
import { Prisma } from ".prisma/client";


export async function GET() {
    const commissions = await prisma.symbol.findMany();

    return NextResponse.json(commissions); 
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, brokerId, symbolId, volume, value} = commissionValidator.parse(body);

        await prisma.commission.create({ data: { 
            id, 
            volume: new Prisma.Decimal(volume), 
            brokerId, 
            symbolId, 
            value: new Prisma.Decimal(value) } 
        })

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