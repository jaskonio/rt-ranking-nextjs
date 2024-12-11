"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { RunnerDetail } from "@/type/runner";


export default function RunnerList({ data }: { data: RunnerDetail[] }) {
    const [runners, setRunners] = useState<RunnerDetail[]>(data);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/runners/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Error eliminando",
                    description: errorData.message || "No se pudo eliminar el runner.",
                    variant: "destructive",
                });
                return;
            }

            setRunners((prevMethods) => prevMethods.filter((method) => method.id !== id));

            toast({
                title: "Runner eliminado",
                description: "El Runner se eliminó correctamente.",
            });
        } catch (error) {
            console.error("Error eliminando al Runner:", error);
            toast({
                title: "Error eliminando",
                description: "Hubo un error al intentar eliminar el Runner.",
                variant: "destructive",
            });
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Runner</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {runners.map((runner) => (
                    <TableRow
                        key={runner.id}
                        className="border-gray-700 hover:bg-gray-700/30 transition-colors animate-fade-in"
                    >
                        <TableCell className="font-medium text-white">
                            <div className="flex items-center gap-3">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                    <Image
                                        src={runner.photoUrl}
                                        alt={`${runner.name} ${runner.surname}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-medium text-white">
                                        {runner.name} {runner.surname}
                                    </div>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/runners/edit/${runner.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(runner.id)}
                                    variant="ghost" size="sm" className="text-red-400 hover:text-white">
                                    Elimnar
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {runners.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={2} className="text-center text-gray-500 py-8">
                            No hay Runners creados.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}