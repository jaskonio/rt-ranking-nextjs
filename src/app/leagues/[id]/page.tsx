"use client";

import LeaderboardPage from "@/components/leaderboard/leaderboard";
import { LeagueHistoryRanking, LeagueHistoryRankingResponse } from "@/type/league";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"


export default function Page() {
    const { id: leagueId } = useParams();
    const [league, setLeague] = useState<LeagueHistoryRanking | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues/${leagueId}/history-ranking`)
            .then((res) => res.json())
            .then((data: LeagueHistoryRankingResponse) => {
                setLeague(data.historyRanking)
                setLoading(false)
            })
    }, [leagueId])

    if (isLoading) return <p>Loading...</p>
    if (!league) return <p>No profile data</p>
    if (!league.visible) return <p>No disponible</p>

    return (
        <div>
            <LeaderboardPage
                title={league.name}
                subSubTitle="Circuito"
                subTitle="2023"
                races={league.races}
                bannerUrl={league.photoUrl}
            ></LeaderboardPage>
        </div>
    );
}