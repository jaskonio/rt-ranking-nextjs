import Link from "next/link";
import { Calendar, Users, Flag, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { League, LeagueParticipant } from "@/type/league";
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { RunnerDetail } from "@/type/runner";
import { Badge } from "@/components/ui/badge";


type Participant = {
    name: string;
    photoUrl: string
}
const AvatarGroup = ({ participants }: { participants: Participant[] }) => {
    return (
        <div className="flex -space-x-2">
            {participants.map((participant, index) => (
                <div
                    key={index}
                    className="relative rounded-full border-2 border-gray-800 hover:z-10 transition-all duration-200 hover:scale-110"
                    style={{ zIndex: participants.length - index }}
                >
                    <Avatar className="h-8 w-8">
                        <div className="relative w-full h-full">
                            <Image
                                src={participant.photoUrl}
                                alt={participant.name}
                                fill
                                sizes="32px"
                                className="rounded-full object-cover"
                                priority={index < 2}
                            />
                        </div>
                    </Avatar>
                </div>
            ))}
        </div>
    );
}

export default function LeagueCard({ league, runners }: { league: League, runners: RunnerDetail[] }) {
    const runnersMap = runners.reduce((map, p) => {
        map.set(p.id, p)
        return map
    }, new Map())

    const participantsMap = league.participants.reduce((map, p) => {
        map.set(p.id, p)
        return map
    }, new Map<number, LeagueParticipant>())


    const participantGroup: Participant[] = league.leagueGlobalCircuitoRanking.map((r) => {
        const participant = participantsMap.get(r.participantId)
        if (!participant) return null
        const runner = runnersMap.get(participant.runnerId)
        if (!runner) return null
        return { name: runner.name, photoUrl: runner.photoUrl }
    }).filter((p) => p !== null)

    return (
        <Link href={`/leagues/${league.id}`} className="block">
            <Card className={`group overflow-hidden bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors animate-slide-in`}>
                <div className="relative w-full h-48 overflow-hidden">
                    <Image
                        src={league.photoUrl}
                        alt={`${league.name}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between items-start">
                            <h3 className="text-xl font-bold text-white">
                                {league.name}
                            </h3>
                            <Badge
                                className={
                                    'Active' === "Active"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-blue-500/20 text-blue-400"
                                }
                            >
                                Active
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <Calendar className="h-4 w-4" />
                            {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}
                        </div>
                    </div>

                    {league.participants.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>Top Participants</span>
                            </div>
                            <AvatarGroup participants={participantGroup.slice(0, 5)} />
                        </div>
                    )}

                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                            <Users className="h-4 w-4 text-blue-400" />
                            <span>{league.participants?.length || 0} Participants</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                            <Flag className="h-4 w-4 text-green-400" />
                            <span>{league.races?.length || 0} Races</span>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <div className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 inline-flex items-center px-3 py-1.5 text-sm rounded-md transition-colors">
                            View Details
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}