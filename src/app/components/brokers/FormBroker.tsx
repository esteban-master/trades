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
import { brokerValidator } from "../../api/brokers/Broker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Input } from "@/components/ui/input";

type BrokerSchema = z.infer<typeof brokerValidator>;

export function FormBroker({ onCreate }: { onCreate: (values: BrokerSchema) => void }) {

    const brokerForm = useForm<BrokerSchema>({
        resolver: zodResolver(brokerValidator),
    })

    const queryClient = useQueryClient()
    const { mutate } = useMutation<null, AxiosError, BrokerSchema, { previousBrokers: BrokerSchema[] }>({
        mutationFn: async (values) => {
            const { data } = await axiosInstance.post(
                '/api/brokers',
                values
            );
            return data;
        },
        onMutate: async (values) => {
            await queryClient.cancelQueries({ queryKey: ['/api/brokers'] })
            const previousBrokers = queryClient.getQueryData<BrokerSchema[]>(['/api/brokers']) || []
            queryClient.setQueryData<BrokerSchema[]>(['/api/brokers'],  (old) => {
                if (old) {
                    return [...old, values]
                }
                return [values]
            })
            onCreate(values)
            return { previousBrokers }
        },
        onError: (error, _, context) => {
            console.log(error)
            if(context) {
                queryClient.setQueryData(
                    ['/api/brokers'],
                    context.previousBrokers,
                );
            }
        }
    })
    return (
        <Popover>
            <PopoverTrigger asChild>
                <PlusCircle className="h-8 w-8 cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent>
                <Input
                    placeholder="Nuevo broker"
                    {...brokerForm.register('name')}
                />

                <Button 
                    size={'lg'}
                    onClick={() => {
                        brokerForm.setValue('id', uuidv4());
                        brokerForm.handleSubmit(async (values) => {
                            mutate(values);
                        })();
                    }}
                >
                    Crear
                </Button>
            </PopoverContent>
        </Popover>
    )
}