"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { ScoringMethod } from "@/type/scoring-method";
import Link from "next/link";
import { useState } from "react";

export default function ScoringMethodList({ scoringMethods }: { scoringMethods: ScoringMethod[] }) {
    const [methods, setMethods] = useState<ScoringMethod[]>(scoringMethods);

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/scoring-method/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Error eliminando",
                    description: errorData.message || "No se pudo eliminar el método de puntuación.",
                    variant: "destructive",
                });
                return;
            }

            // Eliminar el método de la lista local
            setMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));

            toast({
                title: "Método eliminado",
                description: "El método de puntuación se eliminó correctamente.",
            });
        } catch (error) {
            console.error("Error eliminando el método de puntuación:", error);
            toast({
                title: "Error eliminando",
                description: "Hubo un error al intentar eliminar el método de puntuación.",
                variant: "destructive",
            });
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300">Descripción</TableHead>
                    <TableHead className="text-gray-300">Tipo de Liga</TableHead>
                    <TableHead className="text-gray-300">Distribución de puntos</TableHead>
                    <TableHead className="text-gray-300">Acciones</TableHead>
                </TableRow>

            </TableHeader>
            <TableBody>
                {methods.map((method) => (
                    <TableRow
                        key={method.id}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-100"
                    >
                        <TableCell className="font-medium text-white">{method.name}</TableCell>
                        <TableCell className="text-gray-300">{method.description}</TableCell>
                        <TableCell className="text-gray-300">{method.modelType}</TableCell>
                        <TableCell className="text-gray-300">{method.pointsDistribution.toString()}</TableCell>
                        <TableCell >
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/scoring-method/edit/${method.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-400">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(method.id)}
                                    variant="ghost" size="sm" className="text-red-400">
                                    Elimnar
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {methods.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No hay reglas creadas.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>

        </Table>

    );
}
