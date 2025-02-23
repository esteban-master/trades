import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Account } from "@/src/app/api/accounts/Account"
import Link from 'next/link'
import { usePathname } from "next/navigation";
  
export function ListAccounts({ data }: { data: Account[] }) {
  const pathName = usePathname();

  return (
      <div>
        {data.map(account => (
            <Card key={account.id}>
              <CardHeader>
                  <CardTitle><Link href={`${pathName}/account/${account.id}`}>{account.name}</Link></CardTitle>
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