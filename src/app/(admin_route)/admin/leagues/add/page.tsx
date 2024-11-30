"use client";

import LeagueForm from "../league-form";
import { LeagueFormProps, LeagueResponse, LeagueSetParticipantResponse, LeagueSetRacesResponse } from "@/type/league";


export default function NewRacePage() {
    const defaultValues: LeagueFormProps = {
        name: '',
        startDate: '',
        endDate: '',
        scoringMethodId: '0',
        participants: [],
        races: [],
        imageContent: '',
        imageUrl: '',
        disqualifiedRaces: []
    }

    const onSubmitRequest = async (payload: LeagueFormProps) => {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("startDate", payload.startDate);
        formData.append("endDate", payload.endDate);
        formData.append("scoringMethodId", payload.scoringMethodId.toString());

        if (payload.imageContent) {
            const imageBlob = await fetch(payload.imageContent).then((res) => res.blob());
            const imageFile = new File([imageBlob], "banner.jpg", { type: imageBlob.type });
            formData.append("imageContent", imageFile);
        }

        const newLeagueResponse = await fetch("/api/leagues", {
            method: "POST",
            body: formData,
        });

        const newLeagueJsonResponse: LeagueResponse = await newLeagueResponse.json()
        if (!newLeagueJsonResponse.success) throw new Error("Error al crear la nueva Liga")

        const leagueId = newLeagueJsonResponse.league.id
        // set participants
        const participantsResponse = await fetch(`/api/leagues/${leagueId}/participants`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.participants),
        });

        const participantsJsonResponse: LeagueSetParticipantResponse = await participantsResponse.json()
        if (!participantsJsonResponse.success) throw new Error("Error al asignar los nuevos participantes")

        // set races
        const racesResponse = await fetch(`/api/leagues/${leagueId}/races`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload.races),
        });

        const racesJsonResponse: LeagueSetRacesResponse = await racesResponse.json()
        if (!racesJsonResponse.success) throw new Error("Error al asignar las nuevas carreras")
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">Añade Nueva Liga</h1>
                <p className="text-gray-300">Crea una Nueva Liga</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <LeagueForm defaultValues={defaultValues} onSubmitRequest={onSubmitRequest} />
            </div>
        </div>

    );
}