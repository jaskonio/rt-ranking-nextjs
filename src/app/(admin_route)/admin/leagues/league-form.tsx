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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Races } from "@/type/race";
import { RunnerDetail } from "@/type/runner";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateLeagueSkeleton } from "@/components/create-league-skeleton";
import { LeagueParticipant, LeagueRace, LeagueType } from "@/type/league";
import { ScoringMethod } from "@/type/scoring-method";
import SelectParticipantTable from "@/components/league/select-participant-table";
import SelectRaceTable from "@/components/league/select-race-table";


const LeagueFormSchema = z.object({
    name: z.string().min(1, "League name is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    scoringMethodId: z.number(),
    photoUrl: z.string().min(1, "Foto is required"),
    visible: z.boolean(),
    type: z.string().min(1, "Foto is required"),

    participants: z.array(z.object({
        id: z.number(),
        runnerId: z.number(),
        bibNumber: z.number(),
        disqualified_at_race_order: z.number()
    })),
    races: z.array(z.object({
        id: z.number(),
        raceId: z.number(),
        order: z.number(),
    })),
});

export type LeagueFormSchematType = z.infer<typeof LeagueFormSchema>

type LeagueFormType = {
    defaultValues: LeagueFormSchematType;
    onSubmitRequest: (payload: LeagueFormSchematType) => Promise<void>;
}
export default function LeagueForm({ defaultValues, onSubmitRequest }: LeagueFormType) {
    const [isLoading, setIsLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const [scoringMethods, setScoringMethods] = useState<ScoringMethod[] | null>(null)
    const [availableRaces, setAvailableRaces] = useState<Races[] | null>(null)
    const [runners, setRunners] = useState<RunnerDetail[] | null>(null)
    const [selectedParticipants, setSelectedParticipants] = useState<LeagueParticipant[]>(defaultValues.participants);
    const [leagueType, setLeagueType] = useState(defaultValues.type)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scoringMethodsResponse, racesResponse, runnersResponse] = await Promise.all([
                    fetch(`/api/scoring-method`).then((res) => res.json()),
                    fetch(`/api/races`).then((res) => res.json()),
                    fetch(`/api/runners`).then((res) => res.json()),
                ]);

                setScoringMethods(scoringMethodsResponse.scoringMethods || []);
                setAvailableRaces(racesResponse.races.reverse() || []);
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
    const [selectedRaces, setSelectedRaces] = useState<LeagueRace[]>(defaultValues.races);

    const [openRunner, setOpenRunner] = useState(false);
    const [openRace, setOpenRace] = useState(false);

    const [bannerPreview, setBannerPreview] = useState<string | null>(defaultValues.photoUrl || null);

    const form = useForm<LeagueFormSchematType>({
        resolver: zodResolver(LeagueFormSchema),
        defaultValues: defaultValues,
    });

    if (isLoading) return (<CreateLeagueSkeleton></CreateLeagueSkeleton>);

    if (!scoringMethods || !availableRaces || !runners) return <p>Error al recuperar los datos</p>

    const onSubmit = async (values: LeagueFormSchematType) => {
        console.log('onSubmit')
        console.log(values)

        setIsLoading(true);
        try {
            await onSubmitRequest(values);

            router.push("/admin/leagues");
        } catch (error) {
            const message = error instanceof Error
            setErrorMessage('Error al guardar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleParticipationsChange = (participations: LeagueParticipant[]) => {
        form.setValue('participants', participations);
        setSelectedParticipants(participations)
    };

    const handleParticipantAdd = (runnerId: number) => {
        setSelectedParticipants([
            ...selectedParticipants,
            {
                id: selectedParticipants.length + 9999,
                runnerId: runnerId,
                bibNumber: 0,
                disqualified_at_race_order: 9999
            },
        ]);

        setOpenRunner(false);
    };

    const handleSelecteRacesChange = (races: LeagueRace[]) => {
        form.setValue('races', races);
        setSelectedRaces(races)
        console.log(form.getValues())
    };

    const handleSelectRaceAdd = (raceId: number) => {
        setSelectedRaces([...selectedRaces, {
            id: selectedRaces.length + 9999,
            order: selectedRaces.length + 1,
            raceId: raceId
        }]);
        setOpenRace(false)
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
                form.setValue('photoUrl', reader.result as string)
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
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    defaultValue={field.value.toString()}
                                >
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-white">Tipo de Liga</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        setLeagueType(value)
                                    }}
                                    defaultValue={field.value}>
                                    <FormControl>
                                        <div className="relative">
                                            <Calculator className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                                <SelectValue placeholder="Selecciona el tipo de Liga" />
                                            </SelectTrigger>
                                        </div>
                                    </FormControl>
                                    <SelectContent className="bg-gray-800 border-gray-700">
                                        {Object.values(LeagueType).map((a, index) => (
                                            <SelectItem key={index} value={a} className="text-white hover:bg-gray-700">{a}</SelectItem>
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
                {
                    leagueType == LeagueType.CIRCUITO &&
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
                                                                src={runner.photoUrl || ''}
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
                            <div className="rounded-lg p-4 space-y-2">
                                <SelectParticipantTable
                                    runners={runners}
                                    availableRaces={availableRaces}
                                    races={selectedRaces}
                                    participants={selectedParticipants}
                                    onChange={handleParticipationsChange}
                                />
                            </div>
                        )}
                    </div>
                }

                {/* Races Section */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Flag className="h-5 w-5" />
                        Carreras disponibles
                    </h3>

                    <Popover open={openRace} onOpenChange={setOpenRace}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openRace}
                                className="w-full justify-between bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600"
                            >
                                Selecciona las Carreras...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0  border-gray-700">
                            <Command>
                                <CommandInput placeholder="Buscar runners..." />
                                <CommandList>
                                    <CommandEmpty>No hay carreras.</CommandEmpty>
                                    <CommandGroup heading="Carreras">
                                        {availableRaces.map((race, index) => (
                                            <CommandItem
                                                key={index}
                                                onSelect={() => handleSelectRaceAdd(race.id)}
                                                className=" hover:bg-gray-700"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedRaces.some(p => p.raceId === race.id)
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {race.name} - {race.date}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>

                    {selectedRaces.length > 0 && (
                        <SelectRaceTable
                            availableRaces={availableRaces}
                            races={selectedRaces}
                            onChange={handleSelecteRacesChange}
                        />
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
                {
                    errorMessage && (
                        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                    )
                }
            </form>
        </Form>
    );
}