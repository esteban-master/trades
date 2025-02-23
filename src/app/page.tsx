'use client'
import { useState } from "react";
import { FormBroker } from "./components/brokers/FormBroker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";

export default function Home() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const { isPending, isError, data } = useQuery<{name:string, id: string}[]>({
    queryKey: ['/api/brokers'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/api/brokers`)
      return data
    },
  })

  return (
    <div className="flex items-center space-x-2">
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
      <FormBroker onCreate={(values) => {
        console.log(values)
      }}/>
    </div>
  );
}
