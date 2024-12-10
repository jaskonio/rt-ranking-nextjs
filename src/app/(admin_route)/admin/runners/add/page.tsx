"use client"

import { RunnerResponse } from "@/type/runner";
import RunnerForm, { RunnerFormSchema } from "../runner-form";

export default function Page() {
    const defaultValues: RunnerFormSchema = {
        name: '',
        surname: '',
    }

    const onSubmitRequest = async (payload: RunnerFormSchema) => {
        const formData = new FormData();

        formData.append("name", payload.name);
        formData.append("surname", payload.surname);

        if (payload.photoUrl) {
            const imageBlob = await fetch(payload.photoUrl).then((res) => res.blob());
            const imageFile = new File([imageBlob], "avatar.jpg", { type: imageBlob.type });
            formData.append("photo", imageFile);
        }

        const newRunnersResponse = await fetch("/api/runners", {
            method: "POST",
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