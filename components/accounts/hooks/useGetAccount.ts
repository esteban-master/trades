import { constants } from "@/common/contants"
import { axiosInstance } from "@/lib/axiosInstance"
import { Account } from "@/src/app/api/accounts/Account"
import { useQuery } from "@tanstack/react-query"

export const useGetAccount = ({companyId ,accountId}: {companyId: string ,accountId: string}) => {
    return useQuery<Account>({
        queryKey: [constants.api.accounts, {companyId ,accountId}],
        queryFn: async () => {
          const { data } = await axiosInstance.get<Account>(`${constants.api.accounts}${accountId}`)
          return data
        },
        enabled: !!accountId
      })
} 