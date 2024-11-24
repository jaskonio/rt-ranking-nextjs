"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trophy, Calendar, Calculator, Users, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

// Mock data - Replace with API calls
const scoringMethods = [
    { id: 1, name: "Standard Points", description: "Basic point system based on position" },
    { id: 2, name: "Time Based", description: "Points calculated from finish time" },
    { id: 3, name: "Age Graded", description: "Points adjusted for age categories" },
];

const availableRaces = [
    { id: 1, name: "Spring Marathon 2024", date: "2024-03-15" },
    { id: 2, name: "Summer Trail Run", date: "2024-06-20" },
    { id: 3, name: "Autumn 10K", date: "2024-09-10" },
];

const runners = [
    { id: 1, value: "1", label: "Sarah Johnson", category: "Elite" },
    { id: 2, value: "2", label: "Michael Chen", category: "Elite" },
    { id: 3, value: "3", label: "Emma Rodriguez", category: "Amateur" },
];


const formSchema = z.object({
    name: z.string().min(1, "League name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    scoringMethodId: z.string().min(1, "Scoring method is required"),
    participants: z.array(z.object({
        runnerId: z.string(),
        bibNumber: z.string(),
    })),
    races: z.array(z.object({
        raceId: z.string(),
        order: z.number(),
    })),
});

export default function CreateLeaguePage() {
    const router = useRouter();
    const [selectedRaces, setSelectedRaces] = useState<Array<{ id: number, name: string, order: number }>>([]);
    const [openRunner, setOpenRunner] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<Array<{
        runnerId: string,
        name: string,
        bibNumber: string,
    }>>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            startDate: "",
            endDate: "",
            scoringMethodId: "",
            participants: [],
            races: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        router.push("/leagues");
    };

    const handleRaceSelection = (raceId: string) => {
        const race = availableRaces.find(r => r.id.toString() === raceId);
        if (race && !selectedRaces.find(r => r.id === race.id)) {
            setSelectedRaces([...selectedRaces, { ...race, order: selectedRaces.length + 1 }]);
        }
    };

    const handleDragEnd = (result: any) => {
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

    const handleParticipantAdd = (runnerId: string) => {
        const runner = runners.find(r => r.value === runnerId);
        if (runner && !selectedParticipants.find(p => p.runnerId === runnerId)) {
            setSelectedParticipants([
                ...selectedParticipants,
                {
                    runnerId,
                    name: runner.label,
                    bibNumber: '0',
                },
            ]);
            setOpenRunner(false);
        }
    };

    const handleBibNumberChange = (runnerId: string, newBibNumber: string) => {
        setSelectedParticipants(
            selectedParticipants.map(p =>
                p.runnerId === runnerId
                    ? { ...p, bibNumber: newBibNumber }
                    : p
            )
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">League Name</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Trophy className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                        <Input
                                            placeholder="Enter league name"
                                            className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">Start Date</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                type="date"
                                                className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">End Date</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                            <Input
                                                type="date"
                                                className="bg-gray-700/50 border-gray-600 text-white pl-10"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="scoringMethodId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Scoring Method</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Calculator className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                                <SelectValue placeholder="Select scoring method" />
                                            </SelectTrigger>
                                        </div>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {scoringMethods.map((method) => (
                                            <SelectItem
                                                key={method.id}
                                                value={method.id.toString()}
                                                className="text-white hover:bg-gray-700"
                                            >
                                                <div className="flex flex-col">
                                                    <span>{method.name}</span>
                                                    <span className="text-sm text-gray-400">{method.description}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Participants Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Participantes
                    </h3>

                    <Popover open={openRunner} onOpenChange={setOpenRunner}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openRunner}
                                className="w-full justify-between bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600"
                            >
                                Select runners...
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
                                                onSelect={() => handleParticipantAdd(runner.value)}
                                                className=" hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedParticipants.some(p => p.runnerId === runner.value)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {runner.label}
                                                <Badge className="ml-2 bg-blue-500/20 text-blue-300">
                                                    {runner.category}
                                                </Badge>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {selectedParticipants.length > 0 && (
                        <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                            {selectedParticipants.map((participant) => (
                                <div
                                    key={participant.runnerId}
                                    className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-3 flex-grow">
                                        <span className="text-white">{participant.name}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Dorsal </span>
                                            <Input
                                                type="number"
                                                value={participant.bibNumber}
                                                onChange={(e) => handleBibNumberChange(participant.runnerId, e.target.value)}
                                                className="w-24 bg-gray-700/50 border-gray-600 text-white"
                                                min="0"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedParticipants(
                                                selectedParticipants.filter(p => p.runnerId !== participant.runnerId)
                                            );
                                        }}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Races Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Flag className="h-5 w-5" />
                        Carreras disponibles
                    </h3>

                    <Select onValueChange={handleRaceSelection}>
                        <FormControl>
                            <div className="relative">
                                <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                    <SelectValue placeholder="Add races to the league" />
                                </SelectTrigger>
                            </div>
                        </FormControl>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            {availableRaces.map((race) => (
                                <SelectItem
                                    key={race.id}
                                    value={race.id.toString()}
                                    className="text-white hover:bg-gray-700"
                                    disabled={selectedRaces.some(r => r.id === race.id)}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span>{race.name}</span>
                                        <span className="text-sm text-gray-400">
                                            {new Date(race.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {selectedRaces.length > 0 && (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="races">
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className="space-y-2"
                                    >
                                        {selectedRaces.map((race, index) => (
                                            <Draggable
                                                key={race.id}
                                                draggableId={race.id.toString()}
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
                                                                Race {race.order}
                                                            </Badge>
                                                            <span className="text-white">{race.name}</span>
                                                            {/* <span className="text-gray-400">
                                                                {new Date(race.).toLocaleDateString()}
                                                            </span> */}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRaces(
                                                                    selectedRaces.filter(r => r.id !== race.id)
                                                                        .map((r, i) => ({ ...r, order: i + 1 }))
                                                                );
                                                            }}
                                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        >
                                                            Remove
                                                        </Button>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                    <Link href="/leagues">
                        <Button variant="outline" className="text-white border-gray-600">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Create League
                    </Button>
                </div>
            </form>
        </Form>
    );
}