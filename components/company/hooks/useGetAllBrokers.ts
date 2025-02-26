import { axiosInstance } from "@/lib/axiosInstance"
import { constants } from "@/common/contants"
import { Broker } from "@/src/app/api/brokers/Broker"
import { useQuery } from "@tanstack/react-query"

export const useGetAllCompanies = () => {
    return useQuery<Broker[]>({
      queryKey: [constants.api.companies],
      queryFn: async () => {
        const { data } = await axiosInstance.get(constants.api.companies)
        return data
      },
    })
}