'use client'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";
import { Broker } from "../../src/app/api/brokers/Broker";
import { useBrokerStore } from "@/lib/store/brokerState";

export function SelectBrokers() {
    const router = useRouter()
    const open = useBrokerStore((state) => state.select.open)
    const setOpen = useBrokerStore((state) => state.select.setOpen)
    const value = useBrokerStore((state) => state.select.value)
    const setValue = useBrokerStore((state) => state.select.setValue)
    
    const { isPending, isError, data } = useQuery<Broker[]>({
      queryKey: ['/api/brokers'],
      queryFn: async () => {
        const { data } = await axiosInstance.get(`/api/brokers`)
        return data
      },
    })

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={isPending || isError}
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {value && data
              ? data.find((framework) => framework.id === value)?.name
              : "Seleccionar Broker"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar broker..." className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontro el broker.</CommandEmpty>
              <CommandGroup>
                {
                  data ? data.map((broker) => (
                    <CommandItem
                      key={broker.id}
                      value={broker.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setOpen(false)
                        router.push(`/broker/${broker.id}`)
                      }}
                    >
                      {broker.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          value === broker.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  )) : null
                }
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
}