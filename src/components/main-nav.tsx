"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trophy, Flag, Medal, Calculator, Activity } from "lucide-react";

const routes = [
  {
    href: "/admin/leagues",
    label: "Ligas",
    icon: Trophy,
  },
  {
    href: "/admin/races",
    label: "Carreras",
    icon: Flag,
  },
  {
    href: "/admin/scoring-method",
    label: "Reglas pts",
    icon: Calculator,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold text-white"
          >
            <Activity className="h-6 w-6 text-blue-400" />
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              RankingRT
            </span>
          </Link>

          <div className="flex gap-6 md:gap-10">
            {routes.map((route) => {
              const Icon = route.icon;
              const isActive = pathname === route.href || pathname?.startsWith(`${route.href}/`);

              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "relative flex items-center space-x-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{route.label}</span>
                  {isActive && (
                    <div className="absolute -bottom-[1.3rem] left-0 right-0 h-0.5 bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}