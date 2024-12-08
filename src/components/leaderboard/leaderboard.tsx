"use client";

import { Medal, Trophy, ChevronUp, Timer, Route, ChevronDown, Minus } from "lucide-react";
import Image from "next/image";
import { RunnerGlobalBasket, RunnerLeagueDetail } from "@/type/runner";


export const getPodiumIcon = (position: number) => {
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

export const getPreviusPositionContent = (runner: RunnerLeagueDetail) => {
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

type LeaderboardProps = {
    title: string,
    subTitle: string,
    subSubTitle: string,
    bannerUrl: string
    runners: RunnerGlobalBasket[],
}
export const Leaderboard = ({ title, subTitle, subSubTitle, runners, bannerUrl }: LeaderboardProps) => {
    return (
        <div className="max-w-4xl mx-auto">

            <div className="relative h-[400px] w-full">
                <Image
                    src={bannerUrl}
                    alt={title}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 pb-12">

                <div className="space-y-4">
                    {/* {runners.map((runner, index) => (
                        RunnerDetail(runner, index)
                    ))} */}
                </div>
            </div>
        </div>
    );
}