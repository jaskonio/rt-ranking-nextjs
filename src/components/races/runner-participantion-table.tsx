"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ParticipationFormRow, RunnerSelectItems } from "./participation-form-row";
import { RunnerBasketClassification } from "@/type/race";
import { RunnerDetail } from "@/type/runner";


const INITIAL_PARTICIPATION: RunnerBasketClassification = {
    id: 0,
    runnerId: 0,
    generalPosition: 0,
    categoryPosition: 0,
    localPosition: 0,
    time: "00:11:00",
    pace: '4:00',
    bibNumber: 1234,
};

interface RunnerParticipationTableProps {
    runners: RunnerDetail[];
    values: RunnerBasketClassification[];
    onChange: (runners: RunnerBasketClassification[]) => void;
}

export default function RunnerParticipationTable({ runners, values, onChange }: RunnerParticipationTableProps) {
    const [participations, setParticipations] = useState<RunnerBasketClassification[]>(values);
    const newRunnerSelectItems: RunnerSelectItems[] = runners.map((r) => {
        return {
            id: r.id,
            disabled: false,
            visible: true,
            data: r
        }
    });
    const [runnerSelectItems, setRunnerSelectItems] = useState<RunnerSelectItems[]>(newRunnerSelectItems)

    const addParticipation = () => {
        const newParticipationValue = { ...INITIAL_PARTICIPATION }
        newParticipationValue.id = participations.length + 1
        newParticipationValue.generalPosition = participations.length + 1
        newParticipationValue.categoryPosition = participations.length + 1
        newParticipationValue.localPosition = participations.length + 1

        const newParticipation: RunnerBasketClassification = { ...newParticipationValue };
        setParticipations([...participations, newParticipation]);
    };

    const removeParticipation = (id: number) => {
        setParticipations(participations.filter(p => p.id !== id));
    };

    const updateParticipation = (id: number, field: keyof RunnerBasketClassification, value: string | number) => {
        setParticipations(participations.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    useEffect(() => {
        onChange(participations)
    }, [participations])

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Participantes</h2>
                <Button type="button" onClick={addParticipation} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir Participante
                </Button>
            </div>

            <div className="rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700 bg-gray-800/50">
                                <TableHead className="text-gray-300">ID</TableHead>
                                <TableHead className="text-gray-300">Runner</TableHead>
                                <TableHead className="text-gray-300">Dorsal</TableHead>
                                <TableHead className="text-gray-300">Tiempo.</TableHead>
                                <TableHead className="text-gray-300">Ritmo</TableHead>
                                <TableHead className="text-gray-300">General Pos.</TableHead>
                                <TableHead className="text-gray-300">Category Pos.</TableHead>
                                <TableHead className="text-gray-300">Local Pos.</TableHead>
                                <TableHead className="text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participations.map((participation) => (
                                <ParticipationFormRow
                                    key={participation.id}
                                    participation={participation}
                                    runnerSelectItems={runnerSelectItems}
                                    onUpdate={updateParticipation}
                                    onRemove={removeParticipation}
                                />
                            ))}
                            {participations.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center text-gray-500 py-8">
                                        Aún no hay participantes. Click en el boton 'Añadir Participante'.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}