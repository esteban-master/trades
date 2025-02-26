'use client'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCompanyStore } from "@/components/company/store/companyState";
// import { useGetAllBrokers } from '../company/hooks/useGetAllBrokers';

export function SelectBrokers() {
    const router = useRouter()
    const open = useCompanyStore((state) => state.select.open)
    const setOpen = useCompanyStore((state) => state.select.setOpen)
    const value = useCompanyStore((state) => state.select.value)
    const setValue = useCompanyStore((state) => state.select.setValue)
    
    // const { isPending, isError, data } = useGetAllBrokers()

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            // disabled={isPending || isError}
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {/* {value && data
              ? data.find((framework) => framework.id === value)?.name
              : "Seleccionar Broker"} */}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Buscar broker..." className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontro el broker.</CommandEmpty>
              <CommandGroup>
                {/* {
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
                } */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
}