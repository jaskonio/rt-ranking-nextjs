"use client";

import Link from "next/link";
import { Calendar, Users, Flag, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { League } from "@/type/league";


export default function LeagueCardList({ leagues }: { leagues: League[] }) {

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4 animate-fade-in">
                    <h1 className="text-5xl font-bold text-white">Ligas disponibles</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leagues.map((league, index) => (
                        <Link
                            href={`/leagues/${league.id}`}
                            key={league.id}
                            className="transform hover:scale-105 transition-all duration-300"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors animate-slide-in">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-bold text-white">
                                            {league.name}
                                        </CardTitle>
                                    </div>
                                    <CardDescription className="text-gray-400 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(league.startDate).toLocaleDateString()} - {new Date(league.endDate).toLocaleDateString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Users className="h-4 w-4 text-blue-400" />
                                                <span>{league.participants?.length || 0} Participantes</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-300">
                                                <Flag className="h-4 w-4 text-green-400" />
                                                <span>{league.races?.length || 0} Carreras</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                            >
                                                Ver Clasificación
                                                <ArrowUpRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {leagues.length === 0 && (
                    <div className="text-center mt-12">
                        <p className="text-gray-400">No hay ligas disponibles!</p>
                    </div>
                )}
            </div>
        </div>
    );
}