import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server';

export async function GET() {
    const accounts = await prisma.account.findMany({
        include: {trades: {
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