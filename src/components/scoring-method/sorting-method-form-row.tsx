"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { SortingAttribute } from "@/type/scoring-method";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";


interface SortingAttributeFormRowProps {
    sortingKeys: string[];
    defaultValue: SortingAttribute;
    onUpdate: (id: number, field: keyof SortingAttribute, value: string | number) => void;
    onRemove: (id: number) => void;
}

export function SortingAttributeFormRow({ sortingKeys, defaultValue, onUpdate, onRemove }: SortingAttributeFormRowProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(defaultValue.attribute)

    return (
        <TableRow className="border-gray-700">
            <TableCell>
                <span className="text-white"> {defaultValue.id}</span>
            </TableCell>

            <TableCell>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600"
                        >
                            {defaultValue.attribute}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0  border-gray-700">
                        <Command>
                            <CommandInput placeholder="Buscar runners..." />
                            <CommandList>
                                <CommandEmpty>No runner found.</CommandEmpty>
                                <CommandGroup heading="Runners">
                                    {sortingKeys.map((sortingKey, index) => (
                                        <CommandItem
                                            key={index}
                                            onSelect={() => {
                                                setValue(sortingKey)
                                                onUpdate(defaultValue.id, "attribute", sortingKey)
                                                setOpen(false)
                                            }}
                                            className=" hover:bg-gray-700"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    sortingKey === value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {sortingKey}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </TableCell>

            <TableCell>
                <Select
                    onValueChange={(value) => onUpdate(defaultValue.id, "order", value)}
                    defaultValue={defaultValue.order}>
                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                        <SelectValue placeholder="Seleccion tipo de ordenación" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        {['ASC', 'DESC'].map((a, index) => (
                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </TableCell>

            <TableCell>
                <Input
                    type="number"
                    value={defaultValue.priorityLevel}
                    onChange={(e) => onUpdate(defaultValue.id, "priorityLevel", parseInt(e.target.value))}
                    className="bg-gray-700/50 border-gray-600 text-white w-20"
                />
            </TableCell>

            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(defaultValue.id)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}