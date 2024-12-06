"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SortingAttributeTable from "@/components/scoring-method/sorting-method-table";
import { RunnerBasketKeys, RunnerCircuitoKeys, SortingAttribute } from "@/type/scoring-method";


const ScoringMethodSchema = z.object({
    name: z.string().min(1, "Debe añadir un nombre"),
    description: z.string().min(1, "Debe añadir una descripción"),
    modelType: z.string().min(1, "Debe añadir un modelo"),
    pointsDistribution: z.string(),
    sortingAttributes: z.array(z.object({
        id: z.number(),
        attribute: z.string(),
        order: z.string(),
        priorityLevel: z.number()
    }))
})

const RunnerDictKeys = {
    'CIRCUITO': RunnerCircuitoKeys,
    'BASKET': RunnerBasketKeys
}

type ModelTypeSupported = 'CIRCUITO' | 'BASKET'
export type ScoringMethodFormSchema = z.infer<typeof ScoringMethodSchema>

type ScoringMethodAddType = {
    defaultValues: ScoringMethodFormSchema;
    onSubmitRequest: (payload: ScoringMethodFormSchema) => Promise<void>;
}

export default function ScoringMethodAdd({ defaultValues, onSubmitRequest }: ScoringMethodAddType) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [modelType, setModelType] = useState<ModelTypeSupported>(defaultValues.modelType as ModelTypeSupported);


    const form = useForm<ScoringMethodFormSchema>({
        resolver: zodResolver(ScoringMethodSchema),
        defaultValues: defaultValues
    })

    async function onSubmit(values: ScoringMethodFormSchema) {
        setIsLoading(true);
        setErrorMessage("");

        try {
            await onSubmitRequest(values)

            router.push('/admin/scoring-method')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido'
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSortingAttributeChange = (sortingAttribute: SortingAttribute[]) => {
        form.setValue('sortingAttributes', sortingAttribute);
        console.log(form.getValues())
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Name"
                                        className="bg-gray-700/50 border-gray-600 text-white"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Description</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Description"
                                        className="bg-gray-700/50 border-gray-600 text-white"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="pointsDistribution"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Distribucion de puntos</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Separa con ',' los puntos"
                                        className="bg-gray-700/50 border-gray-600 text-white"
                                        {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Tipo de Regla</FormLabel>
                                <Select
                                    onValueChange={(value: ModelTypeSupported) => {
                                        console.log(value)
                                        field.onChange(value)
                                        if (modelType != value) {
                                            defaultValues.sortingAttributes = []
                                        }
                                        setModelType(value)
                                    }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Seleccion tipo de regla" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {['CIRCUITO', 'BASKET'].map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="sortingAttributes"
                    render={() => (
                        <SortingAttributeTable
                            sortingKeys={RunnerDictKeys[modelType]}
                            values={defaultValues.sortingAttributes}
                            onChange={handleSortingAttributeChange}
                        />
                    )}
                />

                <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    {isLoading ? "Submitting..." : "Submit"}
                </Button>
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
            </form>
        </Form>
    );
}
