'use client'

import { axiosInstance } from "@/lib/axiosInstance";
import { v4 as uuidv4 } from 'uuid';
import {
	Box,
	Text,
	TextField,
    Button
} from "@radix-ui/themes";
import { Label } from "radix-ui";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { brokerValidator } from "../../api/brokers/Broker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

type BrokerSchema = z.infer<typeof brokerValidator>;

export function FormBroker() {

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
        <Label.Root>
            <Text size="2" weight="bold" mb="2" asChild>
            	<Box display="inline-block">Title</Box>
            </Text>

            <TextField.Root
            	variant="soft"
                radius="large"
            	placeholder="Enter product title"
                {...brokerForm.register('name')}
            />

            <Button onClick={() => {
                brokerForm.setValue('id', uuidv4());
                brokerForm.handleSubmit(async (values) => {
                    mutate(values);
                })();
            }}>Crear</Button>
        </Label.Root>
    )
}