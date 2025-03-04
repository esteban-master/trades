'use client'

import { AccountAreaChart } from "@/components/accounts/AreaChart"
import { useGetAccount } from "@/components/accounts/hooks/useGetAccount"
import { FormTrade } from "@/components/trades/FormTrade"
import { TableTrades } from "@/components/trades/TableTrades"
import { cn } from "@/lib/utils"
import { Trade } from "@/src/app/api/trades/Trade"
import { Prisma } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { differenceInSeconds } from "date-fns"
import { useParams } from "next/navigation"

const formatTimeDifference = (open: Date, close: Date) => {
  let totalSeconds = differenceInSeconds(close, open);
  const negative = totalSeconds < 0 ? "-" : "";
  totalSeconds = Math.abs(totalSeconds);

  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  totalSeconds %= 60 * 60 * 24;

  const hours = Math.floor(totalSeconds / (60 * 60));
  totalSeconds %= 60 * 60;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedTime = [];
  if (days > 0) formattedTime.push(`${days}d`);
  if (hours > 0) formattedTime.push(`${hours}h`);
  if (minutes > 0) formattedTime.push(`${minutes}m`);
  if (seconds > 0 || formattedTime.length === 0) formattedTime.push(`${seconds}s`);

  return negative + formattedTime.join(" ");
};

const columHelper = createColumnHelper<Trade>();
const columns = [
  columHelper.accessor('id', {
    id: 'id',
    header: () => '',
    cell: ({ row }) => {
      console.log(row)
      return <div>
      { row.index + 1 }
    </div>
    }
  }),
  {
    accessorKey: 'price',
    header: 'Precio',
  },
  {
    accessorKey: 'stopLoss',
    header: 'SL',
  },
  {
    accessorKey: 'takeProfit',
    header: 'TP',
  },
  {
    accessorKey: 'pipsStopLoss',
    header: 'Pips SL',
  },
  {
    accessorKey: 'pipsTakeProfit',
    header: 'Pips TP',
  },
  columHelper.accessor('symbol.name', {
    id: 'symbolA',
    header: () => <div>Símbolo </div>,
    cell: (cell) => (
      <div>
        { cell.getValue() }
      </div>
    )
  }),
  columHelper.accessor('profit', {
    id: 'profit',
    header: 'Profit',
    cell: ({ row }) => {
      const isZero = new Prisma.Decimal(row.getValue('profit')).isZero()
      const isPositive = new Prisma.Decimal(row.getValue('profit')).isPositive()
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.getValue('profit'))

      return <div className={cn(isZero ? 'text-current' : isPositive ? 'text-green-500' : 'text-red-500')}>{formatted}</div>
    } 
  }),
  {
    accessorKey: 'comment',
    header: 'Comentario',
  },
  columHelper.accessor('pipsStopLoss',{
    id: 'ratio',
    header: 'Ratio',
    cell: ({ row }) => {
      return <div>{new Prisma.Decimal(row.original.pipsTakeProfit).div(row.original.pipsStopLoss).toDecimalPlaces(2).toString()}</div>
    } 
  }),
  columHelper.accessor('pipsTakeProfit',{
    id: 'duration',
    header: 'Duración',
    cell: ({ row }) => {
      return <div>{formatTimeDifference(row.original.open, row.original.close)}</div>
    } 
  })

]

export default function AccountPage() {
   const { accountId, companyId } = useParams<{companyId: string, accountId: string}>()
   const { data, isLoading } = useGetAccount({ companyId, accountId });
   
     if (isLoading) return null
     if (data) {
       return (
           <div className="space-y-2">
               <h1 className="text-2xl">
                  {data.name} - {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(new Prisma.Decimal(data.value).toNumber())}
                </h1>

               <AccountAreaChart />
               <FormTrade />
               <TableTrades data={data.trades} columns={columns} />
           </div>
         )
     }
}


