'use client'

import { useCompanyStore } from "@/components/company/store/companyState"
import { constants } from "@/common/contants"
import { useQueryClient } from "@tanstack/react-query"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { Company } from "../api/company/Company"
import { useGetAllCompanies } from "@/components/company/hooks/useGetAllBrokers"
import { SelectCompanies } from "@/components/company/SelectCompany"
import { FormCompany } from "@/components/company/FormCompany"
import { FormAccount } from "@/components/accounts/FormAccount"

export default function CmpanyLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { companyId } = useParams<{companyId: string }>()
    const setValueCompanyId = useCompanyStore((state) => state.select.setValue)
    const queryClient = useQueryClient();
    const { data, isFetching } = useGetAllCompanies()
    const router = useRouter();
    const pathname = usePathname()
    
    useEffect(() => {
      if (data) {
        const companies = queryClient.getQueryData<Company[]>([constants.api.companies])
        const broker = companies ? companies.findIndex((item) => item.id === companyId) : -1
        
        if (pathname.split('/').length > 2) {
          if (broker != -1) {
            setValueCompanyId(companyId)
          } else {
            router.push('/broker')
            console.log("usar roter: ", pathname)
          }
        }
        
      }
    }, [companyId, setValueCompanyId, isFetching, data, queryClient, pathname, router])
    if (pathname.split('/').length > 2 && !companyId) return null
    return (
      <div>
        <SelectCompanies />
        <FormCompany />

        <FormAccount />
        {children}

      </div>
    )
  }