"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { User, ImageIcon, X } from "lucide-react";
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
import { useState } from "react";
import Image from "next/image";
import { RunnerFormProps } from "@/type/runner";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    surname: z.string().min(1, "Surname is required"),
    photoUrl: z.any().optional(),
});

type RunnerFormType = {
    defaultValues: RunnerFormProps;
    onSubmitRequest: (payload: RunnerFormProps) => Promise<void>;
}
export default function RunnerForm({ defaultValues, onSubmitRequest }: RunnerFormType) {
    const router = useRouter();
    const [photoPreview, setPhotoPreview] = useState<string | null>(defaultValues.photoContent || defaultValues.photoUrl || null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = () => {
        setPhotoPreview(null);
        const input = document.getElementById('photoUrl') as HTMLInputElement;
        if (input) input.value = '';
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        console.log(values);
        try {
            const payload: RunnerFormProps = {
                ...values,
            }

            if (photoPreview && !photoPreview.startsWith('htt')) {
                payload.photoContent = photoPreview
            }

            await onSubmitRequest(payload)

            router.push("/admin/runners");
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
                {/* Photo Upload */}
                <div className="space-y-4">
                    <FormLabel className="text-white">Foto Perfil</FormLabel>
                    <div className="flex justify-center">
                        {photoPreview ? (
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <Image
                                        src={photoPreview}
                                        alt="Profile preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2"
                                    onClick={removePhoto}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-600 cursor-pointer hover:border-gray-500 hover:bg-gray-700/30 transition-all">
                                <div className="flex flex-col items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-xs text-gray-400 text-center">
                                        Subir Foto
                                    </p>
                                </div>
                                <input
                                    id="photoUrl"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                />
                            </label>
                        )}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Nombre</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Enter name"
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
                    name="surname"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-white">Apellido</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <Input
                                        placeholder="Enter surname"
                                        className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Link href="/admin/runners">
                        <Button variant="outline" className="border-gray-600">
                            Cancelar
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