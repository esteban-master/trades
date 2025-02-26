'use client'

import { tradeValidator } from "@/src/app/api/trades/Trade"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

type FormSchema = z.infer<typeof tradeValidator> 

export function FormTrade() {
    const form = useForm<FormSchema>({
        resolver: zodResolver(tradeValidator),
        defaultValues: {
            price: '21'
        }
    })

    function onSubmit(values: FormSchema) {
        console.log(values)
      }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                <Button type="submit">Crear</Button>
            </form>
        </Form>
    )
}