"use client";


import { League } from "@/type/league";
import LeagueCard from "./league-card";
import { useEffect, useState } from "react";


export default function LeagueCardList({ leagues }: { leagues: League[] }) {
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
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4 animate-fade-in">
                    <h1 className="text-5xl font-bold text-white">Ligas disponibles</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {leagues.map((league, index) => (
                        <div
                            key={league.id}
                            className="transform hover:scale-[1.02] transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <LeagueCard key={index} league={league} runners={runners} />
                        </div>
                    ))}
                </div>

                {leagues.length === 0 && (
                    <div className="text-center mt-12">
                        <p className="text-gray-400">No hay ligas disponibles!</p>
                    </div>
                )}
            </div>
        </div>
    );
}