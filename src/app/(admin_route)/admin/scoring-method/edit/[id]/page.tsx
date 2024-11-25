"use client"

import { useEffect, useState } from "react";
import ScoringMethodAdd from "../../scoring-method-form";
import { useParams } from "next/navigation";
import { ScoringMethodDetail, ScoringMethodFormPOST } from "@/type/scoring-method";


export default function Page() {
    const { id } = useParams();
    const [scoringMethod, setData] = useState<ScoringMethodDetail | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/scoring-method/${id}`)
            .then((res) => res.json())
            .then((scoringMethods) => {
                setData(scoringMethods)
                setLoading(false)
            })
    }, [id])

    if (isLoading) return <header>Loading...</header>
    if (!scoringMethod) return <p>No hay Método de Puntuación</p>

    const onSubmitRequest = async (payload: ScoringMethodFormPOST) => {
        const response = await fetch(`/api/scoring-method/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data: ScoringMethodDetail = await response.json()
        return data
    }

    scoringMethod.pointsDistribution = scoringMethod.pointsDistribution.toString()

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">
                    Regla de puntuación
                </h1>
                <p className="text-gray-300">
                    Configura el metodo para calcular los puntos
                </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <ScoringMethodAdd defaultValues={scoringMethod} onSubmitRequest={onSubmitRequest}></ScoringMethodAdd>
            </div>
        </div>
    );
}
