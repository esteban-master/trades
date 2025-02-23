'use client'

import { FormBroker } from "@/components/brokers/FormBroker"
import { SelectBrokers } from "@/components/brokers/SelectBrokers"
import { useBrokerStore } from "@/lib/store/brokerState"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export default function BrokerLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const { brokerId } = useParams<{brokerId: string }>()
    const setValueBrokerId = useBrokerStore((state) => state.select.setValue)

    useEffect(() => {
      setValueBrokerId(brokerId)
    }, [brokerId, setValueBrokerId])
    return (
      <html lang="en">
        <body>
          <main>
            <SelectBrokers />
            <FormBroker />
            {children}
            </main>
        </body>
      </html>
    )
  }