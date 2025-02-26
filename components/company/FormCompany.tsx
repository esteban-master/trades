'use client'

import { PlusCircle } from 'lucide-react';
import { axiosInstance } from "@/lib/axiosInstance";
import { v4 as uuidv4 } from 'uuid';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { constants } from "@/common/contants";
import { companyValidator } from '@/src/app/api/company/Company';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { useCompanyStore } from '@/lib/store/companyState';

type CompanySchema = z.infer<typeof companyValidator>;

export function FormCompany({ onCreate }: { onCreate?: (values: CompanySchema) => void }) {
    const open = useCompanyStore((store) => store.create.open);
    const setOpen = useCompanyStore((store) => store.create.setOpen);

    // console.log({ open })
    const companyForm = useForm<CompanySchema>({
        resolver: zodResolver(companyValidator),
        defaultValues: {
            id: uuidv4(),
            name: ''
        }
    })
    
    const queryClient = useQueryClient()
    const { mutate } = useMutation<null, AxiosError, CompanySchema, { previousCompanies: CompanySchema[] }>({
        mutationFn: async (values) => {
            const { data } = await axiosInstance.post(
                constants.api.companies,
                values
            );
            return data;
        },
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: [constants.api.companies] })
            const previousCompanies = queryClient.getQueryData<CompanySchema[]>([constants.api.companies]) || []
            queryClient.setQueryData<CompanySchema[]>([constants.api.companies],  (old) => {
                if (old) {
                    return [...old, values]
                }
                return [values]
            })
            if(onCreate) {
                onCreate(values)
            }
            setOpen(false)
            return { previousCompanies }
        },
        onError: (_, __, context) => {
            if(context) {
                queryClient.setQueryData(
                    [constants.api.companies],
                    context.previousCompanies,
                );
            }
        }
    })

    const onSubmit = (values: CompanySchema) =>  {
        mutate(values);
    }
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button>Crear <PlusCircle className="h-8 w-8 cursor-pointer" /></Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...companyForm}>
                    <form onSubmit={companyForm.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={companyForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Crear</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}