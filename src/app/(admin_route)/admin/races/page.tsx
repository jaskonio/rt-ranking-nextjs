"use client"

import { useEffect, useState } from "react"
import RacesList from "./races-list"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default function Page() {
    const [races, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/races`)
            .then((res) => res.json())
            .then((races) => {
                setData(races)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (!races) return <p>No hay carreras registradas</p>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold text-white animate-fade-in">
                    Gestión de Carreras
                </h1>
            </div>

            <header className="p-6 flex justify-between items-center">
                <Link href="/admin/races/add">
                    <Button variant="outline" className="bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-400">
                        Nueva Carrera
                    </Button>
                </Link>
            </header>

            <RacesList data={races['races']}></RacesList>
        </div >
    );
}