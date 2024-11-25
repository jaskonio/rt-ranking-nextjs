"use client";

import LeaderboardPage from "@/components/leaderboard/leaderboard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react"


export default function Page() {
    const { id: leagueId } = useParams();
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues/${leagueId}/history-ranking`)
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

    return (
        <div>
            <LeaderboardPage
                title={data['league']['name']}
                subSubTitle="Circuito"
                subTitle="2023"
                races={data['league']['races']}></LeaderboardPage>
        </div>
    );
}