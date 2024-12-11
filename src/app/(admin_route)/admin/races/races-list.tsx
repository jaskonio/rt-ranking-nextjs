"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Races } from "@/type/race";
import { toast } from "@/hooks/use-toast";


const getStatusBadge = (status: string) => {
    const statusStyles = {
        COMPLETED: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
        PENDING: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
        FAILED: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    };

    return statusStyles[status as keyof typeof statusStyles] || "bg-gray-500/10 text-gray-500";
};

export default function RacesList({ data }: { data: Races[] }) {
    const [races, setRaces] = useState<Races[]>(data);
    const [processingId, setProcessingId] = useState<number | null>(null); // Para indicar la carrera en proceso.

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/races/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Error eliminando",
                    description: errorData.message || "No se pudo eliminar la carrera.",
                    variant: "destructive",
                });
                return;
            }

            setRaces((prevMethods) => prevMethods.filter((method) => method.id !== id));

            toast({
                title: "Carrera eliminado",
                description: "La Carrera se eliminó correctamente.",
            });
        } catch (error) {
            console.error("Error eliminando la carrera:", error);
            toast({
                title: "Error eliminando",
                description: "Hubo un error al intentar eliminar la carrera de puntuación.",
                variant: "destructive",
            });
        }
    };

    const handleProcess = async (id: number) => {
        setProcessingId(id); // Indicar que se está procesando la carrera.
        const currentToast = toast({
            title: "Procesando carrera",
            description: "Espere mientras se procesa la carrera...",
            variant: "default",
        });

        try {
            const response = await fetch(`/api/races/${id}/process/`, {
                method: "POST",
            });

            if (!response.ok) {
                const errorData = await response.json();
                currentToast.update({
                    id: currentToast.id,
                    title: "Error al procesar",
                    description: errorData.message || "No se pudo procesar la carrera.",
                    variant: "destructive"
                });
                return;
            }

            const updatedRace = await response.json();

            // Actualizar el estado con la carrera procesada.
            setRaces((prevRaces) =>
                prevRaces.map((race) => (race.id === id ? updatedRace['race'] : race))
            );

            currentToast.update({
                id: currentToast.id,
                title: "Carrera procesada",
                description: "La carrera se procesó correctamente.",
                variant: "default"
            });
        } catch (error) {
            console.error("Error procesando la carrera:", error);
            currentToast.update({
                id: currentToast.id,
                title: "Error al procesar",
                description: "Hubo un error al intentar procesar la carrera.",
                variant: "destructive",
            });
        } finally {
            setProcessingId(null); // Resetear el estado de procesamiento.
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Platform</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Processed</TableHead>
                    <TableHead className="text-gray-300">Participants</TableHead>
                    <TableHead className="text-gray-300 text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {races.map((race) => (
                    <TableRow
                        key={race.id}
                        className="border-gray-700 hover:bg-gray-700/30 transition-colors animate-fade-in"
                    >
                        <TableCell className="font-medium text-white">{race.name}</TableCell>
                        <TableCell className="text-gray-300">
                            {new Date(race.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-300">{race.platform}</TableCell>
                        <TableCell>
                            <Badge className={getStatusBadge(race.processingStatus)}>
                                {race.processingStatus}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {race.isProcessed ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                            )}
                        </TableCell>
                        <TableCell>
                            <Link
                                href={`/races/${race.id}/participants`}
                                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                <Users className="mr-2 h-4 w-4" />
                            </Link>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/races/edit/${race.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-400">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(race.id)}
                                    variant="ghost" size="sm" className="text-red-400">
                                    Elimnar
                                </Button>
                                <Button
                                    onClick={() => handleProcess(race.id)}
                                    variant="ghost"
                                    size="sm"
                                    disabled={processingId === race.id}
                                    className="text-blue-400"
                                >
                                    {processingId === race.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Procesar"
                                    )}
                                </Button>
                                <a
                                    href={race.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}

                {races.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                            No hay carreras creadas.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}