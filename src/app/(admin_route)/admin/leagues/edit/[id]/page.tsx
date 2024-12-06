"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeagueForm, { LeagueFormSchematType } from "../../league-form";
import { League, LeagueResponse } from "@/type/league";


export default function Page() {
    const { id } = useParams();
    const [league, setLeague] = useState<League | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/leagues/${id}`)
            .then((res) => res.json())
            .then((leagueResponse) => {
                setLeague(leagueResponse['league'])
                setLoading(false)
            })
    }, [id])

    if (isLoading) return <header>Loading...</header>
    if (!league) return <p>No existe la Liga</p>

    const defaultValues: LeagueFormSchematType = {
        name: league.name,
        startDate: league.startDate,
        endDate: league.endDate,
        scoringMethodId: league.scoringMethodId,
        photoUrl: league.photoUrl,
        visible: league.visible,
        type: league.type,
        participants: league.participants,
        races: league.races
    }

    const onSubmitRequest = async (payload: LeagueFormSchematType) => {
        console.log(payload)

        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("startDate", payload.startDate);
        formData.append("endDate", payload.endDate);
        formData.append("scoringMethodId", payload.scoringMethodId.toString());
        formData.append("visible", String(payload.visible));

        const imageBlob = await fetch(payload.photoUrl).then((res) => res.blob());
        const imageFile = new File([imageBlob], "banner.jpg", { type: imageBlob.type });
        formData.append("photo", imageFile);

        formData.append("participants", JSON.stringify(payload.participants));
        formData.append("races", JSON.stringify(payload.races));

        const newLeagueResponse = await fetch(`/api/leagues/${id}`, {
            method: "PUT",
            body: formData,
        });

        const newLeagueJsonResponse: LeagueResponse = await newLeagueResponse.json()
        if (!newLeagueJsonResponse.success) throw new Error("Error al editar la Liga")
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">
                    Editar Liga
                </h1>
                <p className="text-gray-300">
                    Configura la Liga
                </p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <LeagueForm defaultValues={defaultValues} onSubmitRequest={onSubmitRequest}></LeagueForm>
            </div>
        </div>
    );
}
