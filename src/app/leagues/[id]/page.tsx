"use client";

import LeaderboardGlobalBasket from "@/components/leaderboard/leaderboard-global-basket";
import { LeagueGlobalRanking, LeagueType } from "@/type/league";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"
import LeaderboardGlobalCircuito from "@/components/leaderboard/leaderboard-global-circuito";
import { RunnerGlobalBasket, RunnerGlobalCircuito } from "@/type/runner";


export default function Page() {
    const { id: leagueId } = useParams();
    const [league, setLeague] = useState<LeagueGlobalRanking | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues/${leagueId}/history-ranking`)
            .then((res) => res.json())
            .then((data) => {
                setLeague(data['globalRanking'])
                setLoading(false)
            })
    }, [leagueId])

    if (isLoading) return <p>Loading...</p>
    if (!league) return <p>No profile data</p>
    if (!league.visible) return <p>No disponible</p>

    if (league.type == LeagueType.CIRCUITO) {
        return (
            <LeaderboardGlobalCircuito
                title={league.name}
                subTitle="2023"
                runners={league.data as RunnerGlobalCircuito[]}
                bannerUrl={league.photoUrl} />
        );
    }

    return (
        <LeaderboardGlobalBasket
            title={league.name}
            subTitle="2023"
            runners={league.data as RunnerGlobalBasket[]}
            bannerUrl={league.photoUrl} />
    );
}