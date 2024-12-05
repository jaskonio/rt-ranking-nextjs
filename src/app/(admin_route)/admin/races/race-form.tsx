"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Flag, Calendar, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Platform, RunnerBasketClassification } from "@/type/race";
import { useEffect, useState } from "react";
import RunnerParticipationTable from "@/components/races/runner-participantion-table";
import { RunnerDetail } from "@/type/runner";


export const RaceFormSchema = z.object({
    name: z.string().min(1, "Race name is required"),
    date: z.string().min(1, "Date is required"),
    platform: z.string().min(1, "Platform is required"),
    url: z.string().url("Must be a valid URL"),
    participations: z.array(z.object({
        id: z.number(),
        runnerId: z.number(),
        generalPosition: z.number(),
        categoryPosition: z.number(),
        localPosition: z.number(),
        time: z.string(),
        pace: z.string(),
        bibNumber: z.number(),
    })),
});

type RaceFormType = {
    defaultValues: z.infer<typeof RaceFormSchema>;
    onSubmitRequest: (payload: z.infer<typeof RaceFormSchema>) => Promise<void>;
}
export default function RaceForm({ defaultValues, onSubmitRequest }: RaceFormType) {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [runners, setRunners] = useState<RunnerDetail[] | null>(null)
    const [platform, setPlatform] = useState<string>(defaultValues.platform)

    const form = useForm<z.infer<typeof RaceFormSchema>>({
        resolver: zodResolver(RaceFormSchema),
        defaultValues: defaultValues,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [runnersResponse] = await Promise.all([
                    fetch(`/api/runners`).then((res) => res.json()),
                ]);

                setRunners(runnersResponse.runners || []);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setErrorMessage("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData()
    }, [])

    if (isLoading) return (<p>Cargando...</p>);
    if (!runners) return (<p>Error al recuperar los datos</p>);

    async function onSubmit(values: z.infer<typeof RaceFormSchema>) {
        setIsLoading(true);
        console.log(values);
        try {
            const payload = { ...values }
            await onSubmitRequest(payload);

            router.push("/admin/races");
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error desconocido'
            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    const handleParticipationsChange = (participations: RunnerBasketClassification[]) => {
        console.log(participations)
        form.setValue('participations', participations);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Nombre de Carrera</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Ejemplo: Valencia maraton 2024"
                                        className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Fecha</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="date"
                                        className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Plataforma</FormLabel>
                            <Select
                                onValueChange={(value) => {
                                    field.onChange(value)
                                    setPlatform(value)
                                }}
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                                        <SelectValue placeholder="Seleccion una plataforma" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-gray-800 border-gray-700">
                                    {Object.values(Platform).map((a, index) => (
                                        <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">URL</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="https://"
                                        className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {platform == Platform.CUSTOM &&
                    <FormField
                        control={form.control}
                        name="participations"
                        render={() => (
                            <RunnerParticipationTable
                                runners={runners}
                                values={defaultValues.participations}
                                onChange={handleParticipationsChange} />
                        )}
                    />}

                <div className="flex justify-end space-x-4">
                    <Link href="/admin/races">
                        <Button variant="outline" className="text-black border-gray-600">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
            </form>
        </Form>
    );
}