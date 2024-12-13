"use client"

import LeagueCardList from "@/components/league/league-list"
import { League } from "@/type/league"
import { useEffect, useState } from "react"

export default function Page() {
    const [leagues, setLeague] = useState<League[] | null>(null)
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

    const visibleLeague = leagues.filter(l => l.visible)
    return (
        <LeagueCardList leagues={visibleLeague} />
    );
}