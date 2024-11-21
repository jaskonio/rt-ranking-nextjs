"use client"

import { ScoringMethodDetail, ScoringMethodFormPOST } from "@/type/scoring-method";
import ScoringMethodAdd, { AttributeNameToOrder, OrderValue } from "../scoring-method-form";


export default function Page() {
    const defaultValues = {
        name: '',
        description: '',
        formula: '',
        primaryAttribute: AttributeNameToOrder[0],
        primaryOrder: OrderValue[0],
        secondaryAttribute: AttributeNameToOrder[0],
        secondaryOrder: OrderValue[0],
        tertiaryAttribute: AttributeNameToOrder[0],
        tertiaryOrder: OrderValue[0],
        pointsDistribution: '20,10,5,1',
    }
    const onSubmitRequest = async (payload: ScoringMethodFormPOST) => {
        const response = await fetch("/api/scoring-method", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data: ScoringMethodDetail = await response.json()
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
