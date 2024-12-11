"use client"

import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import { LeagueRace } from "@/type/league";
import { Races } from "@/type/race";
import SelectRaceForm from "./select-race-form";
import { useEffect, useState } from "react";


type SelectRaceTableProps = {
    availableRaces: Races[];
    races: LeagueRace[];
    onChange: (races: LeagueRace[]) => void;
}
export default function SelectRaceTable({ availableRaces, races, onChange }: SelectRaceTableProps) {
    const [selectedRaces, setSelectedRaces] = useState<LeagueRace[]>(races);

    useEffect(() => {
        setSelectedRaces(races); // Actualiza si los valores cambian desde el formulario
    }, [races]);

    useEffect(() => {
        onChange(selectedRaces)
    }, [selectedRaces, onChange])

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(selectedRaces);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const reorderedItems = items.map((item, index) => ({
            ...item,
            order: index + 1,
        }));

        setSelectedRaces(reorderedItems);
    };

    const onRemove = (id: number) => {
        setSelectedRaces(selectedRaces.filter(p => p.id !== id));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="races">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                    >
                        {races.map((race, index) => (
                            <SelectRaceForm
                                availableRaces={availableRaces}
                                selectedRace={race}
                                index={index}
                                onRemove={onRemove}
                                key={index}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}