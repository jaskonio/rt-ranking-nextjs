"use client";

import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Trophy, Calendar, Calculator, Users, Flag, ImageIcon, X, Eye } from "lucide-react";
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
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { ScoringMethodDetail } from "@/type/scoring-method";
import { Races } from "@/type/race";
import { RunnerDetail } from "@/type/runner";
import { LeagueFormProps } from "@/type/league";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateLeagueSkeleton } from "@/components/create-league-skeleton";


const formSchema = z.object({
    name: z.string().min(1, "League name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    scoringMethodId: z.string().min(1, "Scoring method is required"),
    participants: z.array(z.object({
        id: z.number().optional(),
        runnerId: z.number(),
        bibNumber: z.number(),
        disqualified_at_race_order: z.number().optional()
    })),
    races: z.array(z.object({
        id: z.number().optional(),
        raceId: z.number(),
        order: z.number(),
    })),
    visible: z.boolean(),
});

type LeagueFormType = {
    defaultValues: LeagueFormProps;
    onSubmitRequest: (payload: LeagueFormProps) => Promise<void>;
}
export default function LeagueForm({ defaultValues, onSubmitRequest }: LeagueFormType) {
    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const [scoringMethods, setScoringMethods] = useState<ScoringMethodDetail[] | null>(null)
    const [availableRaces, setAvailableRaces] = useState<Races[] | null>(null)
    const [runners, setRunners] = useState<RunnerDetail[] | null>(null)
    const [selectedParticipants, setSelectedParticipants] = useState<Array<{
        id?: number,
        runnerId: number,
        name: string,
        bibNumber: number,
        photoUrl: string,
        disqualified_at_race_order?: number
    }>>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scoringMethodsResponse, racesResponse, runnersResponse] = await Promise.all([
                    fetch(`/api/scoring-method`).then((res) => res.json()),
                    fetch(`/api/races`).then((res) => res.json()),
                    fetch(`/api/runners`).then((res) => res.json()),
                ]);

                setScoringMethods(scoringMethodsResponse.scoringMethods || []);
                setAvailableRaces(racesResponse.races || []);
                setRunners(runnersResponse.runners || []);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
                setErrorMessage("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData()
    }, [])

    const router = useRouter();
    const [selectedRaces, setSelectedRaces] = useState<Array<{
        id?: number,
        raceId: number,
        name: string,
        order: number
    }>>([]);

    const [openRunner, setOpenRunner] = useState(false);


    const [bannerPreview, setBannerPreview] = useState<string | null>(defaultValues.imageContent || defaultValues.imageUrl || null);

    useEffect(() => {
        const searchDefaultSelectedRace = defaultValues.races.map((dr) => {
            const race = availableRaces?.find(ar => ar.id == dr.raceId)

            return {
                ...dr,
                name: race?.name ?? 'xxxxxxx'
            }
        })
        setSelectedRaces(searchDefaultSelectedRace)
    }, [availableRaces, defaultValues.races])

    useEffect(() => {
        const searchDefaultSelectedParticipant = defaultValues.participants.map((dp) => {
            const participant = runners?.find(ar => ar.id == dp.runnerId)
            const fullName = `${participant?.name}, ${participant?.surname}`
            return {
                id: dp.id,
                runnerId: participant?.id ?? 0,
                name: fullName ?? '',
                bibNumber: dp.bibNumber,
                photoUrl: participant?.photoUrl ?? '',
                disqualified_at_race_order: dp.disqualified_at_race_order
            }
        })
        setSelectedParticipants(searchDefaultSelectedParticipant)
    }, [runners, defaultValues.participants])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    if (isLoading) {
        return (
            <CreateLeagueSkeleton></CreateLeagueSkeleton>
        );
    }
    if (!scoringMethods || !availableRaces || !runners) return <p>Error al recuperar los datos</p>

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log('onSubmit')
        console.log(values)

        values.participants = selectedParticipants
        values.races = selectedRaces

        setIsLoading(true);
        try {
            const payload: LeagueFormProps = {
                name: values.name,
                endDate: values.endDate,
                startDate: values.startDate,
                scoringMethodId: values.scoringMethodId,
                participants: values.participants,
                races: values.races,
                imageUrl: defaultValues.imageUrl,
                imageContent: defaultValues.imageContent,
                visible: values.visible,
            }
            console.log(payload)

            await onSubmitRequest(payload)

            router.push("/admin/leagues");
        } catch (error) {
            const message = error instanceof Error
            console.error(message)
            setErrorMessage('Error al guardar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRaceSelection = (raceId: string) => {
        const race = availableRaces.find(r => r.id.toString() === raceId);
        const leagueRace = defaultValues.races.find(r => r.raceId == Number(raceId))
        if (race && leagueRace) {
            setSelectedRaces([...selectedRaces, {
                id: leagueRace.id,
                name: race.name,
                order: selectedRaces.length + 1,
                raceId: race.id
            }]);
        }

        if (race && !leagueRace) {
            setSelectedRaces([...selectedRaces, {
                name: race.name,
                order: selectedRaces.length + 1,
                raceId: race.id
            }]);
        }
    };

    const handleDisqualifiedRaceSelection = (runnerId: number, raceId: string) => {
        console.log(`runnerId: ${runnerId}. raceId: ${raceId}`)

        const race = selectedRaces.find(r => r.raceId === parseInt(raceId))
        const participant = selectedParticipants.find(p => p.runnerId == runnerId)
        const selectedParticipantsWhioutCurrentParticipant = selectedParticipants.filter(p => p.runnerId != runnerId)
        if (participant) {
            participant.disqualified_at_race_order = race?.order ?? undefined
            setSelectedParticipants([...selectedParticipantsWhioutCurrentParticipant.sort(), participant]);
        }
    };

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

    const handleParticipantAdd = (runnerId: number) => {
        const runner = runners.find(r => r.id === runnerId);

        if (runner) {
            setSelectedParticipants([
                ...selectedParticipants,
                {
                    runnerId: runnerId,
                    name: `${runner.name}, ${runner.surname}`,
                    bibNumber: 0,
                    photoUrl: runner.photoUrl
                },
            ]);
        }

        setOpenRunner(false);
    };

    const handleBibNumberChange = (runnerId: number, newBibNumber: string) => {
        setSelectedParticipants(
            selectedParticipants.map(p =>
                p.runnerId === runnerId
                    ? { ...p, bibNumber: Number(newBibNumber) }
                    : p
            )
        );
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeBanner = () => {
        setBannerPreview(null);
        const input = document.getElementById('bannerImage') as HTMLInputElement;
        if (input) input.value = '';
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="grid gap-6">
                    {/* Banner Image Upload */}
                    <div className="space-y-4">
                        <FormLabel className="text-white">Banner</FormLabel>
                        <div className="relative">
                            {bannerPreview ? (
                                <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                                    <Image
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        fill
                                        className="object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={removeBanner}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-[200px] border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-gray-500 hover:bg-gray-700/30 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3" />
                                        <p className="mb-2 text-sm text-gray-400">
                                            <span className="font-semibold">Click para subir</span> or arrastra
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 800x400px)</p>
                                    </div>
                                    <input
                                        id="bannerImage"
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleBannerUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>
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
                                    <FormLabel className="text-white">Fecha de Inicio</FormLabel>
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
                                    <FormLabel className="text-white">Fecha Fin</FormLabel>
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
                                <FormLabel className="text-white">Regla de puntuación</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Calculator className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                                <SelectValue placeholder="Selecciona regla de puntuación" />
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

                    <FormField
                        control={form.control}
                        name="visible"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-100 p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-blue-600"
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel className="text-white">
                                        <div className="flex items-center gap-2">
                                            <Eye className="h-4 w-4 text-gray-400" />
                                            Liga visible
                                        </div>
                                    </FormLabel>
                                    <p className="text-sm text-gray-400">
                                        Todo los usuario podrán ver la Liga y la clasificación
                                    </p>
                                </div>
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
                                Selecciona participantes...
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
                                                onSelect={() => handleParticipantAdd(runner.id)}
                                                className=" hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedParticipants.some(p => p.runnerId === runner.id)
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

                    {selectedParticipants.length > 0 && (
                        <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                            {selectedParticipants.sort().map((participant, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3"
                                >
                                    <div className="flex items-center gap-3 flex-grow">
                                        <div className="flex-shrink-0 group">
                                            <div className="relative ml-2 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 ">
                                                {/* <Image
                                                    src={participant.photoUrl}
                                                    alt={participant.name}
                                                    fill
                                                    className="object-cover"
                                                /> */}
                                            </div>
                                        </div>
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

                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">Descalificar desde la carrera </span>

                                            <Select onValueChange={(raceId) => handleDisqualifiedRaceSelection(participant.runnerId, raceId)}>
                                                <div className="relative">
                                                    <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                                    <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                                        <SelectValue placeholder="Selecciona una carrera" />
                                                    </SelectTrigger>
                                                </div>
                                                <SelectContent className="bg-gray-800 border-gray-700">
                                                    {selectedRaces.map((race) => (
                                                        <SelectItem
                                                            key={race.raceId}
                                                            value={race.raceId.toString()}
                                                            className="text-white hover:bg-gray-700"
                                                        >
                                                            <div className="flex justify-between items-center w-full">
                                                                <span>{race.name} - {race.order}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
                                    disabled={selectedRaces.some(r => r.raceId === race.id)}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span>{race.name}</span>
                                        <span className="text-sm text-gray-400">
                                            - {new Date(race.date).toLocaleDateString()}
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
                                                key={race.raceId}
                                                draggableId={race.raceId.toString()}
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
                                                            {/* <span className="text-gray-400">
                                                                {new Date(race.).toLocaleDateString()}
                                                            </span> */}
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedRaces(
                                                                    selectedRaces.filter(r => r.raceId !== race.raceId)
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
                        <Button variant="outline" className="border-gray-600">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                        {isLoading ? "Guardando..." : "Guardar"}
                    </Button>
                </div>
                {errorMessage && (
                    <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                )}
            </form>
        </Form>
    );
}