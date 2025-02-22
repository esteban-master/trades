import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { symbolValidator } from "./Symbol";
import { ZodError } from "zod";


export async function GET() {
    const symbols = await prisma.symbol.findMany();

    return NextResponse.json(symbols); 
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id, name } = symbolValidator.parse(body);

        await prisma.symbol.create({ data: { id, name } })

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