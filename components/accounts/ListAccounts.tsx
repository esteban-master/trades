import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import { useParams, usePathname } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { useGetAllAccounts } from "./hooks/useGetAllAccounts";
  
export function ListAccounts() {
  const pathName = usePathname();
  const { companyId } = useParams<{ companyId: string }>()

  const { data, isLoading } = useGetAllAccounts({ companyId })

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
      <div className="grid gap-1 md:grid-cols-2 md:gap-3">
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