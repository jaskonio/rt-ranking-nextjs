"use client"

import { toast } from "@/hooks/use-toast";
import { ScoringMethodDetail } from "@/type/scoring-method";
import Link from "next/link";
import { useState } from "react";

export default function ScoringMethodList({ scoringMethods }: { scoringMethods: ScoringMethodDetail[] }) {
    const [methods, setMethods] = useState<ScoringMethodDetail[]>(scoringMethods);

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
        < div className="" >
            <table className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r shadow-lg">
                <thead>
                    <tr className="bg-gray-700 text-white">
                        <th className="px-4 py-2">Nombre</th>
                        <th className="px-4 py-2">Descripción</th>
                        <th className="px-4 py-2">formula</th>
                        <th className="px-4 py-2">Regla Primaria/Order</th>
                        <th className="px-4 py-2">Regla Secundaria/Orden</th>
                        <th className="px-4 py-2">Regla Terciaria/Orden</th>
                        <th className="px-4 py-2">Distribución de puntos</th>
                        <th className="px-4 py-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {methods.map((method) => (
                        <tr key={method.id} className="bg-gray-800 hover:bg-gray-700 text-gray-100">
                            <td className="px-4 py-2">{method.name}</td>
                            <td className="px-4 py-2">{method.description}</td>
                            <td className="px-4 py-2">{method.formula}</td>
                            <td className="px-4 py-2">{method.primaryAttribute}/{method.primaryOrder}</td>
                            <td className="px-4 py-2">{method.secondaryAttribute}/{method.secondaryOrder}</td>
                            <td className="px-4 py-2">{method.tertiaryAttribute}/{method.tertiaryOrder}</td>
                            <td className="px-4 py-2">{method.pointsDistribution.toString()}</td>
                            <td className="px-4 py-2">
                                <Link href={`/admin/scoring-method/edit/${method.id}`}>
                                    <button className="text-blue-400 hover:underline">Editar</button>
                                </Link>
                                {" "}
                                |{" "}
                                <button onClick={() => handleDelete(method.id)} className="text-red-400 hover:underline">Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >

    );
}
