"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { RunnerCustomParticipation } from "@/type/race";
import { RunnerDetail } from "@/type/runner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import Image from "next/image";
import { cn } from "@/lib/utils";


interface ParticipationFormRowProps {
    runners: RunnerDetail[];
    participation: RunnerCustomParticipation;
    onUpdate: (id: string, field: keyof RunnerCustomParticipation, value: string | number) => void;
    onRemove: (id: string) => void;
}

export function ParticipationFormRow({
    runners,
    participation,
    onUpdate,
    onRemove,
}: ParticipationFormRowProps) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const showPopoverPlaceholder = () => {
        if (!value) {
            return "Select Runner..."
        }
        const selectedRunner = runners.find((runner) => runner.id.toString() === value)

        if (!selectedRunner) {
            return "Select Runner..."
        }

        return `${selectedRunner.name}, ${selectedRunner.surname}`
    }

    return (
        <TableRow className="border-gray-700">
            <TableCell>
                <span className="text-white"> {participation.position}</span>
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
                            {showPopoverPlaceholder()}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0  border-gray-700">
                        <Command>
                            <CommandInput placeholder="Buscar runners..." />
                            <CommandList>
                                <CommandEmpty>No runner found.</CommandEmpty>
                                <CommandGroup heading="Runners">
                                    {runners.map((runner, index) => (
                                        <CommandItem
                                            key={index}
                                            onSelect={() => {
                                                setValue(runner.id.toString())
                                                onUpdate(participation.id, "runnerId", runner.id.toString())
                                                setOpen(false)
                                            }}
                                            className=" hover:bg-gray-700"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    runner.id.toString() === value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            {runner.name} {runner.surname}
                                            <div className="flex-shrink-0 group">
                                                <div className="relative ml-2 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 ">
                                                    <Image
                                                        src={runner.photoUrl}
                                                        alt={runner.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </TableCell>

            <TableCell>
                <Input
                    type="number"
                    value={participation.bib}
                    onChange={(e) => onUpdate(participation.id, "bib", parseInt(e.target.value))}
                    className="bg-gray-700/50 border-gray-600 text-white w-20"
                />
            </TableCell>

            <TableCell>
                <Input
                    type="number"
                    value={participation.realPosition}
                    onChange={(e) => onUpdate(participation.id, "realPosition", parseInt(e.target.value))}
                    className="bg-gray-700/50 border-gray-600 text-white w-20"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    value={participation.realTime}
                    onChange={(e) => onUpdate(participation.id, "realTime", e.target.value)}
                    placeholder="HH:MM:SS"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    value={participation.realPace}
                    onChange={(e) => onUpdate(participation.id, "realPace", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={participation.realCategoryPosition}
                    onChange={(e) => onUpdate(participation.id, "realCategoryPosition", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={participation.realGenderPosition}
                    onChange={(e) => onUpdate(participation.id, "realGenderPosition", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>

            <TableCell>
                <Input
                    type="number"
                    value={participation.officialPosition}
                    onChange={(e) => onUpdate(participation.id, "officialPosition", parseInt(e.target.value))}
                    className="bg-gray-700/50 border-gray-600 text-white w-20"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    value={participation.officialTime}
                    onChange={(e) => onUpdate(participation.id, "officialTime", e.target.value)}
                    placeholder="HH:MM:SS"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="text"
                    value={participation.officialPace}
                    onChange={(e) => onUpdate(participation.id, "officialPace", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={participation.officialCategoryPosition}
                    onChange={(e) => onUpdate(participation.id, "officialCategoryPosition", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={participation.officialGenderPosition}
                    onChange={(e) => onUpdate(participation.id, "officialGenderPosition", e.target.value)}
                    placeholder="MM:SS/km"
                    className="bg-gray-700/50 border-gray-600 text-white w-24"
                />
            </TableCell>

            <TableCell>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(participation.id)}
                    className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}