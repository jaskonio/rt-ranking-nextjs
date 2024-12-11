"use client"

import { LeagueParticipant, LeagueRace } from "@/type/league";
import { RunnerDetail } from "@/type/runner";
import SelectParticipantForm from "./select-participant-form";
import { useEffect, useState } from "react";
import { Races } from "@/type/race";

type SelectParticipantTableProps = {
    runners: RunnerDetail[];
    availableRaces: Races[];
    participants: LeagueParticipant[];
    races: LeagueRace[];
    onChange: (participants: LeagueParticipant[]) => void;
}
export default function SelectParticipantTable({ runners, availableRaces, races, participants, onChange }: SelectParticipantTableProps) {
    const [selectedParticipants, setSelectedParticipants] = useState<LeagueParticipant[]>(participants);

    useEffect(() => {
        setSelectedParticipants(participants); // Actualiza si los valores cambian desde el formulario
    }, [participants]);

    useEffect(() => {
        onChange(selectedParticipants)
    }, [selectedParticipants, onChange])

    const onUpdate = (id: number, field: keyof LeagueParticipant, value: string | number) => {
        console.log(value)
        setSelectedParticipants(selectedParticipants.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const onRemove = (id: number) => {
        setSelectedParticipants(selectedParticipants.filter(p => p.id !== id));
    };

    return (
        <div>
            {
                participants.sort().map((participant, index) => (
                    <SelectParticipantForm
                        key={index}
                        participant={participant}
                        runners={runners}
                        availableRaces={availableRaces}
                        races={races}
                        onUpdate={onUpdate}
                        onRemove={onRemove} />
                ))
            }
        </div>
    )
}