"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SortingAttribute } from "@/type/scoring-method";
import { SortingAttributeFormRow } from "./sorting-method-form-row";


const INITIAL_SORTING_ATTRIBUTE_VALUES: SortingAttribute = {
    id: 0,
    methodId: 0,
    attribute: '',
    order: 'ASC',
    priorityLevel: 0,
};

interface SortingAttributeTableProps {
    sortingKeys: string[];
    values: SortingAttribute[];
    onChange: (sortingAttribute: SortingAttribute[]) => void;
}

export default function SortingAttributeTable({ sortingKeys, values, onChange }: SortingAttributeTableProps) {
    const [sortingAttributes, setSortingAttributes] = useState<SortingAttribute[]>(values);

    useEffect(() => {
        setSortingAttributes(values); // Actualiza si los valores cambian desde el formulario
    }, [values]);

    useEffect(() => {
        onChange(sortingAttributes)
    }, [sortingAttributes, onChange])

    const addSortingAttribute = () => {
        console.log(sortingAttributes)
        const newValue = { ...INITIAL_SORTING_ATTRIBUTE_VALUES }
        newValue.id = sortingAttributes.length + 1
        newValue.order = 'ASC'
        newValue.priorityLevel = sortingAttributes.length + 1

        setSortingAttributes([...sortingAttributes, newValue]);
    };

    const removeSortingAttribute = (id: number) => {
        setSortingAttributes(sortingAttributes.filter(p => p.id !== id));
    };

    const updateSortingAttribute = (id: number, field: keyof SortingAttribute, value: string | number) => {
        setSortingAttributes(sortingAttributes.map(p =>
            p.id === id ? { ...p, [field]: value } : p
        ));
    };


    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-white">Participantes</h2>
                <Button type="button" onClick={addSortingAttribute} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir nuevo atributo de ordenación
                </Button>
            </div>

            <div className="rounded-lg border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-700 bg-gray-800/50">
                                <TableHead className="text-gray-300">ID</TableHead>
                                <TableHead className="text-gray-300">Atributo</TableHead>
                                <TableHead className="text-gray-300">Orden</TableHead>
                                <TableHead className="text-gray-300">Nivel de prioridad.</TableHead>
                                <TableHead className="text-gray-300">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortingAttributes.map((sortingAttribute, index) => (
                                <SortingAttributeFormRow
                                    key={index}
                                    defaultValue={sortingAttribute}
                                    sortingKeys={sortingKeys}
                                    onUpdate={updateSortingAttribute}
                                    onRemove={removeSortingAttribute}
                                />
                            ))}
                            {sortingAttributes.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={14} className="text-center text-gray-500 py-8">
                                        Aún no hay atributos. Click en el boton Añadir Nuevos Atributos.
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