"use client"

import LeagueCardList from "@/components/league-list"
import { useEffect, useState } from "react"

export default function Page() {
    const [leagues, setLeague] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues`)
            .then((res) => res.json())
            .then((leagues) => {
                setLeague(leagues['leagues'])
                setLoading(false)
            })
    }, [])

    if (isLoading) return <header>Loading...</header>
    if (!leagues) return <p>No hay ligas registradas</p>
    return (
        <LeagueCardList leagues={leagues} />
    );
}