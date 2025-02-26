'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { axiosInstance } from "@/lib/axiosInstance"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Account } from "@/src/app/api/accounts/Account"
import { useParams } from 'next/navigation'
import { ListAccounts } from "@/components/accounts/ListAccounts"
import { constants } from "@/common/contants"
import { Company } from "../../api/company/Company"

export default function CompanyPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery<Company>({
      queryKey: [constants.api.companies, companyId],
      queryFn: async () => {
        console.log(`${constants.api.companies}${companyId}`)
        const { data } = await axiosInstance.get<Company>(`${constants.api.companies}${companyId}`)
        data.accounts.forEach(item => queryClient.setQueryData<Account>([`${constants.api.companies}${companyId}/account/`, item.id], item))
        return data
      },

      enabled: !!companyId
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
              <h1>{data.accounts.length} cuentas</h1>
              <ListAccounts data={data.accounts} />
          </div>
        )
    }

}