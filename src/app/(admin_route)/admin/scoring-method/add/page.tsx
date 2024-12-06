"use client"

import ScoringMethodAdd, { ScoringMethodFormSchema } from "../scoring-method-form";


export default function Page() {
    const defaultValues: ScoringMethodFormSchema = {
        name: '',
        description: '',
        modelType: 'CIRCUITO',
        pointsDistribution: '20,10,5,1',
        sortingAttributes: []
    }

    const onSubmitRequest = async (payload: ScoringMethodFormSchema) => {
        const response = await fetch("/api/scoring-method", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json()
        return data
    }

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
                <ScoringMethodAdd defaultValues={defaultValues} onSubmitRequest={onSubmitRequest}></ScoringMethodAdd>
            </div>
        </div>
    );
}
