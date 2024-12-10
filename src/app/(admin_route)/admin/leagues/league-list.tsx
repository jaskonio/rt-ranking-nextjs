"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Loader2, Flag, ChartNoAxesColumnDecreasing } from "lucide-react";
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
import { League } from "@/type/league";



export default function LeagueList({ data }: { data: League[] }) {
    const [leagues, setLeague] = useState<League[]>(data);
    const [processingId, setProcessingId] = useState<number | null>(null); // Para indicar la carrera en proceso.

    const handleDelete = async (id: number) => {
        try {
            const response = await fetch(`/api/leagues/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast({
                    title: "Error eliminando",
                    description: errorData.message || "No se pudo eliminar la liga.",
                    variant: "destructive",
                });
                return;
            }

            setLeague((prevMethods) => prevMethods.filter((method) => method.id !== id));

            toast({
                title: "Liga eliminado",
                description: "La Liga se eliminó correctamente.",
            });
        } catch (error) {
            console.error("Error eliminando la Liga:", error);
            toast({
                title: "Error eliminando",
                description: "Hubo un error al intentar eliminar la Liga.",
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
            const response = await fetch(`/api/leagues/${id}/generate-ranking/`, {
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

            currentToast.update({
                id: currentToast.id,
                title: "Liga procesada",
                description: "La Liga se procesó correctamente.",
                variant: "default"
            });
        } catch (error) {
            console.error("Error procesando la Liga:", error);
            currentToast.update({
                id: currentToast.id,
                title: "Error al procesar",
                description: "Hubo un error al intentar procesar la Liga.",
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
                    <TableHead className="text-gray-300">Nombre</TableHead>
                    <TableHead className="text-gray-300">Fecha</TableHead>
                    <TableHead className="text-gray-300">Regla de puntuación</TableHead>
                    <TableHead className="text-gray-300">Nº Participantes</TableHead>
                    <TableHead className="text-gray-300">Nº Carreras</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {leagues.map((league) => (
                    <TableRow
                        key={league.id}
                        className="border-gray-700 hover:bg-gray-700/30 transition-colors animate-fade-in"
                    >
                        <TableCell className="font-medium text-white">{league.name}</TableCell>
                        <TableCell className="text-gray-300">
                            {new Date(league.startDate).toLocaleDateString()}-{new Date(league.endDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-gray-300">
                            {league.scoringMethod.name}
                        </TableCell>
                        <TableCell className="text-gray-300">
                            <div className="flex items-center ">
                                <Users className="mr-2 h-4 w-4" />
                                {league.participants.length}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center text-red-400">
                                <Flag className="mr-2 h-4 w-4" />
                                {league.races.length}
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <Link href={`/admin/leagues/edit/${league.id}`}>
                                    <Button variant="ghost" size="sm" className="text-gray-400">
                                        Edit
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => handleDelete(league.id)}
                                    variant="ghost" size="sm" className="text-red-400">
                                    Elimnar
                                </Button>
                                <Button
                                    onClick={() => handleProcess(league.id)}
                                    variant="ghost"
                                    size="sm"
                                    disabled={processingId === league.id}
                                    className="text-blue-400"
                                >
                                    {processingId === league.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        "Procesar"
                                    )}
                                </Button>
                                <a
                                    href={`/leagues/${league.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white"
                                >
                                    <ChartNoAxesColumnDecreasing className="h-4 w-4" />
                                </a>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}