"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ParticipationFormRow, RunnerSelectItems } from "./participation-form-row";
import { INITIAL_PARTICIPATION } from "@/lib/constants";
import { RunnerCustomParticipation } from "@/type/race";
import { RunnerDetail, RunnerParticipation } from "@/type/runner";


interface RunnerParticipationTableProps {
    runners: RunnerDetail[];
    values: RunnerCustomParticipation[];
    onChange: (runners: RunnerCustomParticipation[]) => void;
}

export default function RunnerParticipationTable({ runners, values, onChange }: RunnerParticipationTableProps) {
    const [participations, setParticipations] = useState<RunnerCustomParticipation[]>(values);
    const newRunnerSelectItems: RunnerSelectItems[] = runners ? runners.map((r) => {
        return {
            id: r.id,
            disabled: false,
            visible: true,
            data: r
        }
    }) : [];
    const [runnerSelectItems, setRunnerSelectItems] = useState<RunnerSelectItems[]>(newRunnerSelectItems)

    const addParticipation = () => {
        const participationValue = INITIAL_PARTICIPATION
        participationValue.realPosition = participations.length + 1
        participationValue.realCategoryPosition = participations.length + 1
        participationValue.realGenderPosition = participations.length + 1

        participationValue.officialPosition = participations.length + 1
        participationValue.officialCategoryPosition = participations.length + 1
        participationValue.officialGenderPosition = participations.length + 1

        const newParticipation: RunnerCustomParticipation = {
            id: `${participations.length + 1}`,
            // position: participations.length + 1,
            ...participationValue
        };
        setParticipations([...participations, newParticipation]);
    };

    const removeParticipation = (id: string) => {
        setParticipations(participations.filter(p => p.id !== id));
    };

    const updateParticipation = (id: string, field: keyof RunnerCustomParticipation, value: string | number) => {
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
                                <TableHead className="text-gray-300">Pos.</TableHead>
                                <TableHead className="text-gray-300">Runner</TableHead>
                                <TableHead className="text-gray-300">Dorsal</TableHead>
                                <TableHead className="text-gray-300">Real Pos.</TableHead>
                                <TableHead className="text-gray-300">Real Tiempo</TableHead>
                                <TableHead className="text-gray-300">Real Ritmo</TableHead>
                                <TableHead className="text-gray-300">Real Cat. Pos.</TableHead>
                                <TableHead className="text-gray-300">Real Gen. Pos.</TableHead>
                                <TableHead className="text-gray-300">Official Pos</TableHead>
                                <TableHead className="text-gray-300">Official Tiempo</TableHead>
                                <TableHead className="text-gray-300">Official Ritmo</TableHead>
                                <TableHead className="text-gray-300">Official Cat. Pos.</TableHead>
                                <TableHead className="text-gray-300">Official Gen. Pos.</TableHead>
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