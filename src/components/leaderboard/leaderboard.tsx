"use client";

import { Medal, Trophy, Activity, ChevronUp, Timer, Route, ChevronDown, Minus, Signal } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RaceLeagueDetail, RunnerLeagueDetail } from "@/type/runner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMemo, useState } from "react";


const getPodiumIcon = (position: number) => {
    switch (position) {
        case 1:
            return <Trophy className="h-6 w-6 text-yellow-400 animate-pulse" />;
        case 2:
            return <Medal className="h-6 w-6 text-gray-400" />;
        case 3:
            return <Medal className="h-6 w-6 text-amber-700" />;
        default:
            return null;
    }
};

const getPreviusPositionContent = (runner: RunnerLeagueDetail) => {
    if (runner.position == runner.previousPosition) {
        return (<div className="text-xs text-gray-500 mt-1">
            <Minus></Minus>
        </div>)
    }

    if (runner.position < runner.previousPosition) {
        return (<div className="text-xs text-green-500 mt-1">
            <ChevronUp></ChevronUp>
            <span>{runner.position - runner.previousPosition}</span>
        </div>)
    }

    if (runner.position > runner.previousPosition) {
        return (<div className="text-xs text-red-500 mt-1">
            <ChevronDown></ChevronDown>
            <span>{runner.position - runner.previousPosition}</span>
        </div>)
    }
}

const RunnerDetail = (runner: RunnerLeagueDetail, index: number = 0) => {
    return <div
        key={index}
        className={cn(
            "relative overflow-hidden rounded-xl transition-all duration-500 transform hover:scale-[1.02]",
            "animate-slide-in",
            "bg-gradient-to-r shadow-lg",
            runner.position === 1
                ? "from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 ring-2 ring-yellow-500/50"
                : runner.position === 2
                    ? "from-gray-400/20 to-gray-500/20 hover:from-gray-400/30 hover:to-gray-500/30 ring-1 ring-gray-400/50"
                    : runner.position === 3
                        ? "from-amber-700/20 to-amber-800/20 hover:from-amber-700/30 hover:to-amber-800/30 ring-1 ring-amber-700/50"
                        : "from-gray-800/40 to-gray-700/40 hover:from-gray-700/60 hover:to-gray-600/60"
        )}

    >
        <div className="p-6 flex items-center gap-6">
            <div className="flex-shrink-0 w-16 text-center relative">
                <div className="justify-self-start">
                    {getPodiumIcon(runner.position) || (
                        <span className="text-2xl font-bold text-gray-400">
                            {runner.position}
                        </span>
                    )}
                    {
                        getPreviusPositionContent(runner)
                    }

                </div>
            </div>

            <div className="flex-shrink-0 group">
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white/20 transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src={runner.photoUrl}
                        alt={runner.name}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            <div className="flex-grow">
                <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-white">
                        {runner.name}
                    </h3>
                    {/* <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                    </span> */}
                </div>
                <div className="mt-2 flex items-center gap-6 text-gray-300">
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>{runner.points} pts</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Activity className="h-4 w-4 text-green-400" />
                        <span>{runner.pace}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Signal className="h-4 w-4 text-green-400" />
                        <span>{runner.numTopFive}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Medal className="h-4 w-4 text-yellow-400" />
                        <span>{runner.bestPosition}</span>
                    </div>

                </div>
            </div>
            {/* 
            <Link
                href={`/races/${runner.id}`}
                className="flex-shrink-0 flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 hover:bg-blue-500/20 rounded-full px-4 py-2"
            >
                Details
                <ArrowUpRight className="h-4 w-4" />
            </Link> */}
        </div>

        {runner.position === 1 && (
            <div className="absolute top-0 right-0 w-24 h-24">
                <div className="absolute transform rotate-45 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold py-1 right-[-35px] top-[32px] w-[170px] text-center shadow-lg">
                    CHAMPION
                </div>
            </div>
        )}
    </div>
}

const RunnerList = (runners: RunnerLeagueDetail[]) => {
    return <div className="space-y-4">
        {runners.map((runner, index) => (
            RunnerDetail(runner, index)
        ))}
    </div>
}

type LeaderboardPage = {
    title: string,
    subTitle: string,
    subSubTitle: string,
    races: RaceLeagueDetail[],
}
export default function LeaderboardPage({ title, subTitle, subSubTitle, races }: LeaderboardPage) {
    const [raceSelectedId, setRaceSelectedId] = useState<string>(races[0].raceId.toString())

    const raceSelected = useMemo(() => {
        return races.filter(e => e.raceId.toString() == raceSelectedId)[0]
    }, [raceSelectedId, races])

    return (
        <div className="max-w-4xl mx-auto">

            <div className="relative h-[400px] w-full">
                <Image
                    src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3"
                    alt="Marathon"
                    fill
                    className="object-cover brightness-50"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">
                    <div className="container mx-auto h-full flex flex-col justify-end pb-16 px-4">
                        <div className="text-center space-y-4 animate-fade-in relative z-10">
                            <h1 className="text-6xl font-bold text-white text-shadow-lg">
                                {title}
                            </h1>
                            <div className="flex justify-center items-center gap-8 text-gray-200">
                                <div className="flex items-center gap-2">
                                    <Route className="h-5 w-5" />
                                    <span>{subTitle}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Timer className="h-5 w-5" />
                                    <span>{subSubTitle}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select onValueChange={setRaceSelectedId} defaultValue={raceSelectedId}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Carrea" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {races.map((race, index) => (
                                                <SelectItem key={index} value={race.raceId.toString()}>{race.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 pb-12">

                <div className="space-y-4">
                    {RunnerList(raceSelected.runners)}
                </div>
            </div>
        </div>
    );
}