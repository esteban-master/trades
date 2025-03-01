'use client'

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
  const { data } = useQuery<Company>({
      queryKey: [constants.api.companies, { companyId }],
      queryFn: async () => {
        const { data } = await axiosInstance.get<Company>(`${constants.api.companies}${companyId}`)
        data.accounts.forEach(item => queryClient.setQueryData<Account>([constants.api.accounts, { companyId, accountId: item.id }], item))
        return data
      },

      enabled: !!companyId
    })

    if (data) {
      return (
          <div>
              <h1>{data.accounts.length} cuentas</h1>
              <ListAccounts />
          </div>
        )
    }

}