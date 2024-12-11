"use client"

import { RunnerDetail, RunnerResponse } from "@/type/runner";
import RunnerForm, { RunnerFormSchema } from "../../runner-form";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";


export default function Page() {
    const { id } = useParams();
    const [runner, setRunner] = useState<RunnerDetail | null>(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/runners/${id}`)
            .then((res) => res.json())
            .then((runnerResponse: RunnerResponse) => {
                setRunner(runnerResponse.runner)
                setLoading(false)
            })
    }, [id])

    if (isLoading) return <header>Loading...</header>
    if (!runner) return <p>No runner registrado</p>

    const defaultValues: RunnerFormSchema = {
        name: runner.name,
        surname: runner.surname,
        photoUrl: runner.photoUrl
    }

    const onSubmitRequest = async (payload: RunnerFormSchema) => {
        console.log('onSubmitRequest')
        console.log(payload)

        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("surname", payload.surname);

        if (payload.photoUrl) {
            const imageBlob = await fetch(payload.photoUrl).then((res) => res.blob());
            const imageFile = new File([imageBlob], "avatar.jpg", { type: imageBlob.type });
            formData.append("photo", imageFile);
        }

        const newRunnersResponse = await fetch(`/api/runners/${id}`, {
            method: "PUT",
            body: formData,
        });

        const newRunnersJsonResponse: RunnerResponse = await newRunnersResponse.json()
        if (!newRunnersJsonResponse.success) throw new Error("Error al crear el Runner")
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-16 space-y-4 animate-fade-in">
                <h1 className="text-5xl font-bold text-white">Añadir nuevo Runner</h1>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 shadow-xl animate-slide-in">
                <RunnerForm defaultValues={defaultValues} onSubmitRequest={onSubmitRequest}></RunnerForm>
            </div>
        </div>
    );
}