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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Account, accountValidator } from '@/src/app/api/accounts/Account';
import { useAccountStore } from './store/accountStore';
import { Company } from '@/src/app/api/company/Company';
import { useParams } from 'next/navigation';

type AccountSchema = z.infer<typeof accountValidator>;

export function FormAccount() {
    const { companyId } = useParams<{ companyId: string }>()
    const open = useAccountStore((store) => store.create.open);
    const setOpen = useAccountStore((store) => store.create.setOpen);

    const accountForm = useForm<AccountSchema>({
        resolver: zodResolver(accountValidator),
        defaultValues: {
            value: '',
            name: '',
            createAt: new Date().toISOString()
        }
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation<null, AxiosError, AccountSchema, { previousAccounts: Account[], previousCompany: Company | undefined }>({
        mutationFn: async (values) => {
            const { data } = await axiosInstance.post(
                constants.api.accounts,
                values
            );
            return data;
        },
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: [constants.api.accounts, { companyId: values.companyId }] })
            const previousAccounts = queryClient.getQueryData<Account[]>([constants.api.accounts, { companyId: values.companyId }]) || []
            const previousCompany = queryClient.getQueryData<Company>([constants.api.companies, { companyId: values.companyId }])

            queryClient.setQueryData<Account[]>([constants.api.accounts, { companyId: values.companyId }],  (old) => {
                if (old) {
                    return [...old, {...values, trades: []}]
                }
            })
     
            queryClient.setQueryData<Company>([constants.api.companies, { companyId: values.companyId }], (old) => {
                if (old) {
                    return {
                        ...old, 
                        accounts: [...old.accounts, {...values, trades: []}]
                    }
                }
            })
            setOpen(false)
            return { previousAccounts, previousCompany }
        },
        onError: (_, values, context) => {
            if(context) {
                queryClient.setQueryData(
                    [constants.api.accounts, { companyId: values.companyId }],
                    context.previousAccounts,
                );
                queryClient.setQueryData(
                    [constants.api.companies, { companyId: values.companyId }],
                    context.previousCompany,
                );
            }
        }
    })

    const onSubmit = (values: AccountSchema) =>  {
        mutate(values);
        accountForm.reset();
    }
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                <Button>Crear cuenta <PlusCircle className="h-8 w-8 cursor-pointer" /></Button>
            </PopoverTrigger>
            <PopoverContent>
                <Form {...accountForm}>
                    <form onSubmit={accountForm.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={accountForm.control}
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
                        <FormField
                            control={accountForm.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Balance</FormLabel>
                                    <FormControl>
                                        <Input placeholder='50000'  {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button onClick={() => {
                            accountForm.setValue('id', uuidv4())
                            accountForm.setValue('companyId', companyId)
                        }} type="submit">Crear</Button>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    )
}