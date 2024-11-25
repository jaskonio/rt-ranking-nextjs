"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import RunnerList from "./runner-list"


export default function Page() {
    const [runners, setRunners] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/runners`)
            .then((res) => res.json())
            .then((runnersReponse) => {
                setRunners(runnersReponse['runners'])
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (!runners) return <p>No hay runners registrados</p>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold text-white animate-fade-in">
                    Gestión de Runners
                </h1>
            </div>

            <header className="p-6 flex justify-between items-center">
                <Link href="/admin/runners/add">
                    <Button variant="outline" className="bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-400">
                        Nuevo Runners
                    </Button>
                </Link>
            </header>
        
            <RunnerList data={runners}></RunnerList>
        </div >
    );
}