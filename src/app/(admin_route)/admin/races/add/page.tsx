"use client";

import { Platform, RaceResponse } from "@/type/race";
import RaceForm, { RaceFormSchema } from "../race-form";
import { z } from "zod";


export default function NewRacePage() {
    const defaultValues: z.infer<typeof RaceFormSchema> = {
        name: '',
        date: '',
        url: '',
        platform: Object.values(Platform)[0],
        RaceBasketClassification: []
    }

    const onSubmitRequest = async (payload: z.infer<typeof RaceFormSchema>) => {
        const newRaceResponse = await fetch("/api/races", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const newRaceJsonResponse: RaceResponse = await newRaceResponse.json()
        if (!newRaceJsonResponse.success) throw new Error("Error al crear la carrera")
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">Añade Nueva Carrera</h1>
                <p className="text-gray-300">Crea una nueva carrera</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <RaceForm defaultValues={defaultValues} onSubmitRequest={onSubmitRequest}></RaceForm>
            </div>
        </div>

    );
}