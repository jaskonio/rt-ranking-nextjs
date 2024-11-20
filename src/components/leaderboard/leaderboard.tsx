"use client";

import { Medal, Trophy, Clock, Activity, ArrowUpRight, Timer, Route } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export type Runner = {
    id: number;
    position: number;
    previousPosition: number;
    name: string;
    points: number;
    photoUrl: string;
    time: string;
    pace: string;
    // raceId: string;
    category: string;
    bib: number;
};

export type Race = {
    raceId: number;
    order: number;
    name: string;
    date: string;
    distance: string;
    category: string;
    runners: Runner[];
};

// const runners: Runner[] = [
//     {
//         id: 1,
//         position: 1,
//         name: "Sarah Johnson",
//         points: 100,
//         photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
//         time: "2:43:45",
//         pace: "3:52/km",
//         raceId: "spring-marathon-2024",
//         category: "Elite Women",
//         bib: 1001
//     },
//     {
//         id: 2,
//         position: 2,
//         name: "Michael Chen",
//         points: 95,
//         photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
//         time: "2:44:30",
//         pace: "3:54/km",
//         raceId: "spring-marathon-2024",
//         category: "Elite Men",
//         bib: 1002
//     },
//     {
//         id: 3,
//         position: 3,
//         name: "Emma Rodriguez",
//         points: 90,
//         photoUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
//         time: "2:45:15",
//         pace: "3:55/km",
//         raceId: "spring-marathon-2024",
//         category: "Elite Women",
//         bib: 1003
//     },
//     {
//         id: 4,
//         position: 4,
//         name: "David Kim",
//         points: 85,
//         photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
//         time: "2:46:00",
//         pace: "3:56/km",
//         raceId: "spring-marathon-2024",
//         category: "Elite Men",
//         bib: 1004
//     },
//     {
//         id: 5,
//         position: 5,
//         name: "Laura Martinez",
//         points: 80,
//         photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
//         time: "2:47:30",
//         pace: "3:58/km",
//         raceId: "spring-marathon-2024",
//         category: "Elite Women",
//         bib: 1005
//     }
// ];

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

const RunnerDetail = (runner: Runner, index: number = 0) => {
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
                {getPodiumIcon(runner.position) || (
                    <span className="text-2xl font-bold text-gray-400">
                        {runner.position}
                    </span>
                )}
                <div className="text-xs text-gray-500 mt-1">#{runner.bib}</div>
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
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        {runner.category}
                    </span>
                </div>
                <div className="mt-2 flex items-center gap-6 text-gray-300">
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Clock className="h-4 w-4 text-blue-400" />
                        <span>{runner.time}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Activity className="h-4 w-4 text-green-400" />
                        <span>{runner.pace}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-gray-800/50 rounded-full px-3 py-1">
                        <Trophy className="h-4 w-4 text-yellow-400" />
                        <span>{runner.points} pts</span>
                    </div>
                </div>
            </div>

            {/* <Link
                href={`/races/${runner.raceId}`}
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

const RunnerList = (runners: Runner[]) => {
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
    races: Race[],
}
export default function LeaderboardPage({ title, subTitle, subSubTitle, races }: LeaderboardPage) {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-5xl font-bold text-white animate-fade-in">
                    {title}
                </h1>
                <div className="flex justify-center items-center gap-8 text-gray-300">
                    <div className="flex items-center gap-2">
                        <Route className="h-5 w-5" />
                        <span>{subTitle}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5" />
                        <span>{subSubTitle}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {RunnerList(races[0].runners)}
            </div>
        </div>
    );
}