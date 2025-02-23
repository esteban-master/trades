'use client'

import { axiosInstance } from "@/lib/axiosInstance"
import { Account } from "@/src/app/api/accounts/Account"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"

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
 
     console.log({ isLoading, data })
 
     if (isLoading) return null
     if (data) {
       return (
           <div>
               <h1>Cuenta {accountId}</h1>
           </div>
         )
     }
}


