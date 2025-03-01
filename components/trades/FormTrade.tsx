'use client'

import { tradeValidator } from "@/src/app/api/trades/Trade"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { useTradeStore } from "./store/tradeStore"
import { PlusCircle } from "lucide-react"
import { v4 as uuidv4 } from 'uuid';
import { useParams } from "next/navigation"
import { Textarea } from "../ui/textarea"

type FormSchema = z.infer<typeof tradeValidator> 

export function FormTrade() {
     const { accountId } = useParams<{ accountId: string }>()
    const open = useTradeStore((state) => state.create.open)
    const setOpen = useTradeStore((state) => state.create.setOpen)

    const form = useForm<FormSchema>({
        resolver: zodResolver(tradeValidator),
        defaultValues: {
            id: uuidv4(),
            accountId: accountId,
            price: '',
            stopLoss: '',
            takeProfit: '',
            profit: '',
            swap: '0',
            pipsStopLoss: '',
            pipsTakeProfit: '',
            comment: '',
            symbolId: ''
        }
    })

    console.log(form.formState.defaultValues)
    function onSubmit(values: FormSchema) {
        console.log(values)
      }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button>Crear trade <PlusCircle className="h-8 w-8 cursor-pointer" /></Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-2 gap-3">
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
                                        <FormControl>
                                            <Input placeholder="30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                                />
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
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
                        <Button type="submit">Crear</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}