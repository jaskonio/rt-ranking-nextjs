"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Races, RacesFormAdd } from "@/type/race";
import RaceForm from "../../race-form";


export default function Page() {
    const { id } = useParams();
    const [race, setData] = useState<Races | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/races/${id}`)
            .then((res) => res.json())
            .then((race) => {
                setData(race['race'])
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (!race) return <p>No hay carrera</p>

    const onSubmitRequest = async (payload: RacesFormAdd) => {
        const response = await fetch(`/api/races/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const jsonResponse = await response.json()
        if (!jsonResponse['success']) throw new Error(jsonResponse['error'])
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">
                    Editar Carreara
                </h1>
                <p className="text-gray-300">
                    Configura la carrera
                </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <RaceForm defaultValues={race} onSubmitRequest={onSubmitRequest}></RaceForm>
            </div>
        </div>
    );
}
