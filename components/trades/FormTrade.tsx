'use client'

import { tradeValidator } from "@/src/app/api/trades/Trade"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { setHours, setMinutes } from 'date-fns'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useTradeStore } from "./store/tradeStore"
import { CalendarIcon, Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "next/navigation"
import { Textarea } from "../ui/textarea"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { constants } from "@/common/contants"
import { axiosInstance } from "@/lib/axiosInstance"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command"
import { cn } from "@/lib/utils"
import { Symbol } from "@/src/app/api/symbols/Symbol"
import { Calendar } from "../ui/calendar"
import { ChangeEvent } from "react"
import { formatDate } from "@/lib/formatDate"
import { Switch } from "../ui/switch"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "../ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"
import { Label } from "../ui/label"
import { AxiosError } from "axios"
import { Account } from "@/src/app/api/accounts/Account"

type FormSchema = z.infer<typeof tradeValidator> 

export function FormTrade() {
    const { accountId, companyId } = useParams<{ accountId: string, companyId: string }>()
    const open = useTradeStore((state) => state.create.open)
    const setOpen = useTradeStore((state) => state.create.setOpen)
    
    const openTimeValue = useTradeStore((state) => state.create.openTimeValue);
    const closeTimeValue = useTradeStore((state) => state.create.closeTimeValue);

    const setOpenTimeValue = useTradeStore((state) => state.create.setOpenTimeValue);
    const setCloseTimeValue = useTradeStore((state) => state.create.setCloseTimeValue);

    const { data: symbols, isLoading, isError } = useQuery<Symbol[]>({ 
        queryKey: [constants.api.symbols],
        queryFn: async () => {
            const { data } = await axiosInstance.get(constants.api.symbols)
            return data
        } 
    })

    const form = useForm<FormSchema>({
        resolver: zodResolver(tradeValidator),
        defaultValues: {
            accountId: accountId,
            price: '',
            stopLoss: '',
            takeProfit: '',
            profit: '',
            swap: '0',
            pipsStopLoss: '',
            pipsTakeProfit: '',
            comment: '',
            symbolId: '',
            type: 'BUY',
            open: new Date(),
            close: new Date(),
        }
    })

    const queryClient = useQueryClient()
    const { mutate, isPending } = useMutation<null, AxiosError, FormSchema, { previousAccount: Account | undefined }>({
        mutationFn: async (values) => {
            const { data } = await axiosInstance.post(
                constants.api.trades,
                values
            )
            return data;
        },
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: [constants.api.accounts, { accountId, companyId }] });
            const previousAccount = queryClient.getQueryData<Account>([constants.api.accounts, { accountId, companyId }])
            const symbols = queryClient.getQueryData<Symbol[]>([constants.api.symbols]) || []
            queryClient.setQueryData<Account>([constants.api.accounts, { accountId, companyId }], (old) => {
                const symbol = symbols.find(item => item.id === values.symbolId);
                if (old && symbol) {
                    return { ...old, trades: [...old.trades, {...values, symbol}] }
                }
            })
            
            setOpen(false)
            form.reset()
            return { previousAccount }
        },
        onError: (_, __, context) => {
            if (context) {
                queryClient.setQueryData(
                    [constants.api.accounts, { accountId, companyId }], 
                    context.previousAccount
                )
            }
        }
    })

    const handleTimeChange = (e: ChangeEvent<HTMLInputElement>, setTimeValue: (timeValue: string) => void, formValue: 'open' | 'close' , selected: Date) => {
        const time = e.target.value;
        if (!selected) {
          setTimeValue(time);
          return;
        }
        const [hours, minutes] = time.split(":").map((str) => parseInt(str, 10));
        const newSelectedDate = setHours(setMinutes(selected, minutes), hours);
        console.log({time, hours, minutes, newSelectedDate})
        form.setValue(formValue, newSelectedDate);
        setTimeValue(time);
    };

    const handleDaySelect = (date: Date | undefined, timeValue: string, formValue: 'open' | 'close') => {
        if (!timeValue || !date) {
          form.setValue(formValue, date || new Date());
          return;
        }
        const [hours, minutes] = timeValue
          .split(":")
          .map((str) => parseInt(str, 10));
        const newDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          hours,
          minutes
        );
        form.setValue(formValue, newDate);
    };

    function onSubmit(values: FormSchema) {
        console.log(values)
        mutate(values)
      }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Crear trade <PlusCircle className="h-8 w-8 cursor-pointer" /></Button>
            </DialogTrigger>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle>Añadir trade</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid gap-1 md:grid-cols-2 md:gap-3">
                        <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <div className="flex space-x-2 items-center">
                                            <Label htmlFor="type-trade">BUY</Label>
                                            <FormControl>
                                                <Switch
                                                    id="type-trade"
                                                    checked={field.value !== "BUY"}
                                                    onCheckedChange={(v) => {
                                                        form.setValue('type', v ? 'SELL' : 'BUY')
                                                    }}
                                                    className="data-[state=unchecked]:bg-green-500 data-[state=checked]:bg-red-500"
                                                />
                                            </FormControl>
                                            <Label htmlFor="type-trade">SELL</Label>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Precio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1.43023" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stopLoss"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1.43023" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="takeProfit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>TP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="1.43023" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="profit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Profit</FormLabel>
                                        <FormControl>
                                            <Input placeholder="699" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="swap"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Swap</FormLabel>
                                        <FormControl>
                                            <Input placeholder="0" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="pipsStopLoss"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pips SL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="pipsTakeProfit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Pips TK</FormLabel>
                                        <FormControl>
                                            <Input placeholder="30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="symbolId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Simbolo</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        disabled={isLoading || isError}
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                        >
                                                        {field.value && symbols
                                                            ? symbols.find(
                                                                (symbol) => symbol.id === field.value
                                                            )?.name
                                                            : "Símbolo"}
                                                        <ChevronsUpDown className="opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0">
                                            <Command>
                                                <CommandInput
                                                placeholder="Buscar símbolo..."
                                                className="h-9"
                                                />
                                                <CommandList>
                                                <CommandEmpty>Símbolo no encontrado.</CommandEmpty>
                                                <CommandGroup>
                                                    { symbols ? symbols.map((symbol) => (
                                                        <CommandItem
                                                            value={symbol.id}
                                                            key={symbol.id}
                                                            onSelect={() => {
                                                                form.setValue("symbolId", symbol.id)
                                                            }}
                                                        >
                                                            {symbol.name}
                                                            <Check
                                                            className={cn(
                                                                "ml-auto",
                                                                symbol.id === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                            )}
                                                            />
                                                        </CommandItem>
                                                    )) : null }
                                                </CommandGroup>
                                                </CommandList>
                                            </Command>
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="open"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Apertura</FormLabel>
                                        <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                            >
                                                {field.value ? (
                                                   formatDate({
                                                    size: 'xxsminute',
                                                    date: new Date(field.value),
                                                  })
                                                ) : (
                                                    <span>Elegir fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Input type="time" value={openTimeValue} onChange={(e) => handleTimeChange(e, setOpenTimeValue, 'open',field.value)} />
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(e) => handleDaySelect(e, openTimeValue, 'open')}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="close"
                                render={({ field }) => (
                                    <FormItem className="">
                                        <FormLabel>Cierre</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                    >
                                                        {field.value ? (
                                                        formatDate({
                                                            size: 'xxsminute',
                                                            date: new Date(field.value),
                                                        })
                                                        ) : (
                                                            <span>Elegir fecha</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Input type="time" value={closeTimeValue} onChange={(e) => handleTimeChange(e, setCloseTimeValue, 'close', field.value)} />
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={(e) => handleDaySelect(e, closeTimeValue, 'close')}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Comentario</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder=""
                                                className="resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </div>
                        <DialogFooter className="sm:justify-start">
                            <Button 
                                type="submit" 
                                disabled={isPending}
                                onClick={() => {
                                    form.setValue('id', uuidv4());
                                }}
                            >Crear</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}