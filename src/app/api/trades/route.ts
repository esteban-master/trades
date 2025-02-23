import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { tradeValidator } from "./Trade";
import { Prisma } from ".prisma/client";


export async function GET() {
    const trades = await prisma.trade.findMany();

    return NextResponse.json(trades); 
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { 
            id, 
            price, 
            stopLoss, 
            takeProfit, 
            profit, 
            swap, 
            pipsStopLoss, 
            pipsTakeProfit, 
            comment, 
            close, 
            accountId, 
            symbolId, 
            type, 
            open 
        } = tradeValidator.parse(body);

        await prisma.trade.create({ 
            data: { 
                id, 
                price: new Prisma.Decimal(price), 
                stopLoss: new Prisma.Decimal(stopLoss), 
                takeProfit: new Prisma.Decimal(takeProfit), 
                profit: new Prisma.Decimal(profit), 
                swap: new Prisma.Decimal(swap), 
                pipsStopLoss: new Prisma.Decimal(pipsStopLoss), 
                pipsTakeProfit: new Prisma.Decimal(pipsTakeProfit), 
                comment: comment || '', 
                close, 
                accountId, 
                symbolId, 
                type, 
                open
            }
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