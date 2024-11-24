"use client";

import { Platform, RacesFormAdd } from "@/type/race";
import LeagueForm from "../league-form";


export default function NewRacePage() {
    const defaultValues = {
        name: '',
        startDate: '',
        endDate: '',
        scoringMethodId: 0
    }

    const onSubmitRequest = async (payload: RacesFormAdd) => {
        await fetch("/api/leagues", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">Añade Nueva Liga</h1>
                <p className="text-gray-300">Crea una Nueva Liga</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <LeagueForm />
            </div>
        </div>

    );
}