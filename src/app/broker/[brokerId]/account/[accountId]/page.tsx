'use client'

import { TableTrades } from "@/components/trades/TableTrades"
import { axiosInstance } from "@/lib/axiosInstance"
import { cn } from "@/lib/utils"
import { Account } from "@/src/app/api/accounts/Account"
import { Trade } from "@/src/app/api/trades/Trade"
import { Prisma } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { createColumnHelper } from "@tanstack/react-table"
import { useParams } from "next/navigation"

const columHelper = createColumnHelper<Trade>();
const columns = [
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
  }
]

export default function AccountPage() {
   const { accountId, brokerId } = useParams<{brokerId: string, accountId: string}>()
   const { data, isLoading } = useQuery<Account>({
       queryKey: [`/api/brokers/${brokerId}/account/`, accountId],
       queryFn: async () => {
         
         const { data } = await axiosInstance.get<Account>(`/api/accounts/${accountId}`)
         return data
       },
       enabled: !!accountId
     })
   
     if (isLoading) return null
     if (data) {
       return (
           <div>
               <h1 className="text-2xl">{data.name}</h1>
               <TableTrades data={data.trades} columns={columns} />
           </div>
         )
     }
}


