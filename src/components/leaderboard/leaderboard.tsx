"use client";

import { RunnerLeagueDetail } from "@/type/league";
import { Medal, Trophy, ChevronUp, ChevronDown, Minus } from "lucide-react";


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