import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Account } from "@/src/app/api/accounts/Account"
import Link from 'next/link'
import { usePathname } from "next/navigation";
import { useCompanyStore } from "../company/store/companyState";
import { useQuery } from "@tanstack/react-query";
import { constants } from "@/common/contants";
import { axiosInstance } from "@/lib/axiosInstance";
import { Skeleton } from "../ui/skeleton";
  
export function ListAccounts() {
  const pathName = usePathname();
  const companyId = useCompanyStore((state) => state.select.value);

  const { data, isLoading } = useQuery<Account[]>({
    queryKey: [constants.api.accounts, {companyId}],
    queryFn: async () => {
      const { data } = await axiosInstance.get<Account[]>(`${constants.api.accounts}?companyId=${companyId}`)
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
        {data.map(account => (
            <Card key={account.id}>
              <CardHeader>
                  <CardTitle>
                    <Link href={`${pathName}/account/${account.id}`}>{account.name}</Link>
                  </CardTitle>
                  <CardDescription>
                    <div>
                      <p>${account.value}</p>
                      <p>{account.trades.length} trades realizados</p>
                    </div>
                  </CardDescription>
              </CardHeader>
            </Card>
        ))}
      </div>
  )
  }
} 