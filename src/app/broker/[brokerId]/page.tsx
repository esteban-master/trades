'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { axiosInstance } from "@/lib/axiosInstance"
import { Broker } from "@/src/app/api/brokers/Broker"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Account } from "@/src/app/api/accounts/Account"
import { useParams } from 'next/navigation'
import { ListAccounts } from "@/components/accounts/ListAccounts"

export default function BrokerPage() {
  const { brokerId } = useParams<{ brokerId: string }>();
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery<Broker>({
      queryKey: ['/api/brokers/', brokerId],
      queryFn: async () => {
        const { data } = await axiosInstance.get<Broker>(`/api/brokers/${brokerId}`)
        data.accounts.forEach(item => queryClient.setQueryData<Account>([`/api/brokers/${brokerId}/account/`, item.id], item))
        return data
      },

      enabled: !!brokerId
    })

    if (isLoading) {
      return (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )
    }
    if (data) {
      return (
          <div>
              <ListAccounts data={data.accounts} />
          </div>
        )
    }

}