"use client"

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import LeagueForm from "../../league-form";
import { League, LeagueFormProps, LeagueResponse, LeagueSetDisqualifyParticipantResponse, LeagueSetParticipantResponse, LeagueSetRacesResponse } from "@/type/league";


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

    const defaultValues: LeagueFormProps = {
        name: league.name,
        startDate: league.startDate,
        endDate: league.endDate,
        scoringMethodId: league.scoringMethodId.toString(),
        participants: league.participants.map((p) => { return { bibNumber: p.bibNumber, runnerId: p.runnerId } }),
        races: league.races.map((r) => { return { order: r.order, raceId: r.raceId } }),
        imageContent: '',
        imageUrl: league.photoUrl,
        disqualifiedRaces: []
    }

    const onSubmitRequest = async (payload: LeagueFormProps) => {
        console.log(payload)

        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("startDate", payload.startDate);
        formData.append("endDate", payload.endDate);
        formData.append("scoringMethodId", payload.scoringMethodId);

        if (payload.imageContent) {
            const imageBlob = await fetch(payload.imageContent).then((res) => res.blob());
            const imageFile = new File([imageBlob], "banner.jpg", { type: imageBlob.type });
            formData.append("imageContent", imageFile);
        }

        const leagueId = id

        const newLeagueResponse = await fetch(`/api/leagues/${leagueId}`, {
            method: "PUT",
            body: formData,
        });

        const newLeagueJsonResponse: LeagueResponse = await newLeagueResponse.json()
        if (!newLeagueJsonResponse.success) throw new Error("Error al crear la nueva Liga")


        // set participants
        const participantsResponse = await fetch(`/api/leagues/${leagueId}/participants`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.participants),
        });

        const participantsJsonResponse: LeagueSetParticipantResponse = await participantsResponse.json()
        if (!participantsJsonResponse.success) throw new Error("Error al asignar los nuevos participantes")

        // set races
        const racesResponse = await fetch(`/api/leagues/${leagueId}/races`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.races),
        });

        const racesJsonResponse: LeagueSetRacesResponse = await racesResponse.json()
        if (!racesJsonResponse.success) throw new Error("Error al asignar las nuevas carreras")

        // set disqualified runner
        const disqualifiedResponse = await fetch(`/api/leagues/${leagueId}/disqualified`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.disqualifiedRaces),
        });

        const disqualifiedJsonResponse: LeagueSetDisqualifyParticipantResponse = await disqualifiedResponse.json()
        if (!disqualifiedJsonResponse.success) throw new Error("Error al descalificar runner")
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
