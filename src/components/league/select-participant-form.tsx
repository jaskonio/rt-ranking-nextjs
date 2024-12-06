import { LeagueParticipant, LeagueRace } from "@/type/league";
import { RunnerDetail } from "@/type/runner";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Races } from "@/type/race";


type SelectParticipantTableProps = {
    runners: RunnerDetail[];
    availableRaces: Races[];
    races: LeagueRace[];
    participant: LeagueParticipant;
    onUpdate: (id: number, field: keyof LeagueParticipant, value: string | number) => void;
    onRemove: (id: number) => void;
}
export default function SelectParticipantForm({ runners, availableRaces, races, participant, onUpdate, onRemove }: SelectParticipantTableProps) {
    const runner = runners.find(r => r.id == participant.runnerId)
    if (!runner) return <span>Runner no encontrado</span>

    return (
        <div className="flex flex-col justify-between bg-gray-800/50 rounded-lg p-3">
            <div className="flex flex-row items-center pb-4">
                <div className="relative ml-2 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20 ">
                    {/* <Image
                            src={participant.photoUrl}
                            alt={participant.name}
                            fill
                            className="object-cover"
                        /> */}
                </div>
                <span className="text-white align-middle pl-4">{runner.name}</span>
            </div>
            <div className="flex flex-row pb-4">
                <div className="basis-1/4">
                    <span className="text-gray-400">Dorsal </span>
                    <Input
                        type="number"
                        value={participant.bibNumber}
                        onChange={(e) => onUpdate(participant.id, "bibNumber", parseInt(e.target.value))}
                        className="w-24 bg-gray-700/50 border-gray-600 text-white"
                    />
                </div>

                <div className="basis-1/4">
                    <span className="text-gray-400">Descalificar desde la carrera </span>
                    <Select
                        onValueChange={(value) => onUpdate(participant.id, "disqualified_at_race_order", parseInt(value))}
                        defaultValue={participant.disqualified_at_race_order.toString()}
                    >
                        <div className="relative">
                            <Flag className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
                            <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white pl-10">
                                <SelectValue placeholder="Selecciona una carrera" />
                            </SelectTrigger>
                        </div>
                        <SelectContent className="bg-gray-800 border-gray-700">
                            {races.map((race, index) => {
                                const availableRace = availableRaces.find(r => r.id == race.raceId)
                                if (!availableRace) return <span key={index}>Carrera no encontrada</span>

                                return (
                                    <SelectItem
                                        key={race.raceId}
                                        value={race.raceId.toString()}
                                        className="text-white hover:bg-gray-700"
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span>{race.order} - {availableRace.name}</span>
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(participant.id)}
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
                Remove
            </Button>
        </div>
    )
}