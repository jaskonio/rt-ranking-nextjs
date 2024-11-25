"use client";

import LeaderboardPage from "@/components/leaderboard/leaderboard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"


export default function Page() {
    const { id: leagueId } = useParams();
    const [league, setLeague] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues/${leagueId}/history-ranking`)
            .then((res) => res.json())
            .then((data) => {
                setLeague(data['league'])
                setLoading(false)
            })
    }, [leagueId])

    if (isLoading) return <p>Loading...</p>
    if (!league) return <p>No profile data</p>

    return (
        <div>
            <LeaderboardPage
                title={league['name']}
                subSubTitle="Circuito"
                subTitle="2023"
                races={league['races']}
                bannerUrl={league['photoUrl']}
            ></LeaderboardPage>
        </div>
    );
}