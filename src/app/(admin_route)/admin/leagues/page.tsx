"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import LeagueList from "./league-list"


export default function Page() {
    const [leagues, setLeague] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/leagues`)
            .then((res) => res.json())
            .then((leagues) => {
                if (leagues.success) {
                    setLeague(leagues.leagues || []);
                } else {
                    setError(leagues.error || "Error desconocido al obtener las ligas");
                }
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (error) {
        return (
            <div className="max-w-4xl mx-auto text-center mt-16">
                <h1 className="text-3xl font-bold text-red-500">Error</h1>
                <p className="text-lg text-white mt-4">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold text-white animate-fade-in">
                    Gestión de liga
                </h1>
            </div>

            <header className="p-6 flex justify-between items-center">
                <Link href="/admin/leagues/add">
                    <Button variant="outline" className="bg-yellow-400 px-4 py-2 rounded-md hover:bg-yellow-400">
                        Nueva Liga
                    </Button>
                </Link>
            </header>

            <LeagueList data={leagues}></LeagueList>
        </div >
    );
}