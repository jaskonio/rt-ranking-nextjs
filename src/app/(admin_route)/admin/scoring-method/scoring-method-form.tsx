"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ScoringMethodDetail, ScoringMethodFormForm, ScoringMethodFormPOST } from "@/type/scoring-method";

export const AttributeNameToOrder = ['realPosition', 'realTime', 'realPace', 'officialPosition', 'officialTime', 'officialPace',
    'realCategoryPosition', 'realGenderPosition', 'officialCategoryPosition', 'officialGenderPosition']

export const OrderValue = ['ASC', 'DESC']

const FormSchema = z.object({
    name: z.string().min(1, "Debe añadir un nombre"),
    description: z.string().min(1, "Debe añadir una descripción"),
    formula: z.string(),
    primaryAttribute: z.string(),
    primaryOrder: z.string(),
    secondaryAttribute: z.string(),
    secondaryOrder: z.string(),
    tertiaryAttribute: z.string(),
    tertiaryOrder: z.string(),
    pointsDistribution: z.string(),

})
type ScoringMethodAddType = {
    defaultValues: ScoringMethodFormForm;
    onSubmitRequest: (payload: ScoringMethodFormPOST) => Promise<ScoringMethodDetail>;
}

export default function ScoringMethodAdd({ defaultValues, onSubmitRequest }: ScoringMethodAddType) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: defaultValues
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsLoading(true);
        setErrorMessage("");

        const pointsDistributionArray = data.pointsDistribution
            .split(",")
            .map((item) => Number(item.trim()));

        const payload = {
            ...data,
            pointsDistribution: pointsDistributionArray,
        };

        try {
            await onSubmitRequest(payload)

            router.push('/admin/scoring-method')
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido'
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

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
                        name="primaryAttribute"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Regla primaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Seleccion un atributo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {AttributeNameToOrder.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="primaryOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Orden regla primaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un orden" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {OrderValue.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="secondaryAttribute"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Regla Secundaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un atributo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {AttributeNameToOrder.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="secondaryOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Orden regla secundaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona el orden" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {OrderValue.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tertiaryAttribute"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Regla terciaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un atributo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {AttributeNameToOrder.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tertiaryOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Orden regla terciaria</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                            <SelectValue placeholder="Selecciona un orden" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {OrderValue.map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                        ))}

                                    </SelectContent>
                                </Select>
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
                </div>
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
