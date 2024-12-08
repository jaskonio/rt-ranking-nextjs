"use client";

import LeagueForm, { LeagueFormSchematType } from "../league-form";
import { LeagueResponse, LeagueType } from "@/type/league";


export default function NewRacePage() {
    const defaultValues: LeagueFormSchematType = {
        name: '',
        startDate: '',
        endDate: '',
        participants: [],
        races: [],
        photoUrl: '',
        visible: false,
        type: LeagueType.CIRCUITO
    }

    const onSubmitRequest = async (payload: LeagueFormSchematType) => {
        console.log('onSubmitRequest')
        console.log(payload)

        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("startDate", payload.startDate);
        formData.append("endDate", payload.endDate);
        if (payload.scoringMethodId) {
            formData.append("scoringMethodId", String(payload.scoringMethodId));

        }
        formData.append("visible", String(payload.visible));
        formData.append("type", payload.type);

        const imageBlob = await fetch(payload.photoUrl).then((res) => res.blob());
        const imageFile = new File([imageBlob], "banner.jpg", { type: imageBlob.type });
        formData.append("photo", imageFile);

        formData.append("participants", JSON.stringify(payload.participants));
        formData.append("races", JSON.stringify(payload.races));

        const newLeagueResponse = await fetch("/api/leagues", {
            method: "POST",
            body: formData,
        });

        const newLeagueJsonResponse: LeagueResponse = await newLeagueResponse.json()
        if (!newLeagueJsonResponse.success) throw new Error("Error al crear la nueva Liga")
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