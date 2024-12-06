"use client"

import { Draggable } from "@hello-pangea/dnd";
import { Button } from "../ui/button";
import { LeagueRace } from "@/type/league";
import { Races } from "@/type/race";
import { Badge } from "../ui/badge";

type SelectRaceFormProps = {
    availableRaces: Races[];
    selectedRace: LeagueRace;
    index: number;
    onRemove: (id: number) => void;
}
export default function SelectRaceForm({ availableRaces, selectedRace, index, onRemove }: SelectRaceFormProps) {
    const race = availableRaces.find(a => a.id == selectedRace.raceId)

    if (!race) return <span>Carrera no encontrada</span>

    return (
        <Draggable
            draggableId={selectedRace.id.toString()}
            index={index}
        >
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
                >
                    <div className="flex items-center gap-3">
                        <Badge className="bg-blue-500/20 text-blue-300">
                            Carrera {index + 1}
                        </Badge>
                        <span className="text-white">{race.name}</span>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(selectedRace.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                        Remove
                    </Button>
                </div>
            )}
        </Draggable>

    );
}