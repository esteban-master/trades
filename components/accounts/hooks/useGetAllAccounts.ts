import { constants } from "@/common/contants"
import { axiosInstance } from "@/lib/axiosInstance"
import { Account } from "@/src/app/api/accounts/Account"
import { useQuery } from "@tanstack/react-query"


const queryFnGetAllAccounts = async ({ companyId }: { companyId: string }) =>  {
  const { data } = await axiosInstance.get<Account[]>(`${constants.api.accounts}?companyId=${companyId}`)
  return data
}

export const useGetAllAccounts = ({companyId}: {companyId: string}) => {
    return useQuery<Account[]>({
      queryKey: [constants.api.accounts, {companyId}],
      queryFn: () => queryFnGetAllAccounts({ companyId }),
      enabled: !!companyId
    })
}