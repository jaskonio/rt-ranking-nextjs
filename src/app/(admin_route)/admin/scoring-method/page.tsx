"use client"

import { useEffect, useState } from "react";
import ScoringMethodList from "./scoring-method-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Page() {
    const [scoringMethods, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/scoring-method`)
            .then((res) => res.json())
            .then((scoringMethods) => {
                setData(scoringMethods)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (!scoringMethods) return <p>No hay Métodos de Puntuación</p>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold text-white animate-fade-in">
                    Gestión de Métodos de Puntuación
                </h1>
            </div>

            <header className="p-6 flex justify-between items-center">

                <Link href="/admin/scoring-method/add">
                    <Button variant="outline" className="bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-400">
                        Nuevo Método
                    </Button>
                </Link>
            </header>
            <ScoringMethodList scoringMethods={scoringMethods['scoringMethods']}></ScoringMethodList>
        </div>
    );
}
