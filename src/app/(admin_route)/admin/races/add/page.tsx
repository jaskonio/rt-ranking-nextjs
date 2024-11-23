"use client";

import { Platform, RacesFormAdd } from "@/type/race";
import RaceForm from "../race-form";


export default function NewRacePage() {
    const defaultValues = {
        name: '',
        date: '',
        url: '',
        platform: Object.values(Platform)[0]
    }

    const onSubmitRequest = async (payload: RacesFormAdd) => {
        await fetch("/api/races", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-16 space-y-4 animate-fade-in">
                    <h1 className="text-5xl font-bold text-white">Añade Nueva Carrera</h1>
                    <p className="text-gray-300">Crea una nueva carrera</p>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                    <RaceForm defaultValues={defaultValues} onSubmitRequest={onSubmitRequest}></RaceForm>
                </div>
            </div>
        </div>
    );
}