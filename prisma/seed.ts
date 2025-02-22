import { PrismaClient, Prisma, OperationType } from '@prisma/client'

const prisma = new PrismaClient()

export async function main() {

    const broker = await prisma.broker.create({ data: { name: 'FundedNext', id: '86971037-f925-430f-9dfe-138614ed45e9' } })
    const symbol = await prisma.symbol.create({ data: { 
            id: 'b2880ce1-5bab-4c99-933c-4bf21eac854e', 
            name: 'EURUSD', 
            commissions: { 
                create: {
                    value: new Prisma.Decimal("-6"),
                    volume: new Prisma.Decimal("2"),
                    brokerId: broker.id,
                }
            }
        }}
    )

    await prisma.account.create({ data: {
        name: 'Stellar 2-Step Challenge P1',
        value: new Prisma.Decimal("50.000"),
        createAt: new Date('2024-09-30T06:22:33.444Z'),
        brokerId: broker.id,
        trades: {
            create: [{
                pipsStopLoss: new Prisma.Decimal("5"),
                pipsTakeProfit: new Prisma.Decimal("30"),
                price: new Prisma.Decimal("1.04914"),
                stopLoss: new Prisma.Decimal("1.04964"),
                takeProfit: new Prisma.Decimal("1.04614"),
                profit: new Prisma.Decimal("600"),
                comment: "Trade de prueba",
                symbolId: symbol.id,
                type: OperationType.SELL,
                swap: new Prisma.Decimal("0"),
                open: new Date('2024-10-21T06:22:33.444Z'),
                close: new Date('2024-10-21T07:22:33.444Z'),
            }]
        }
    } })

    
}

main()