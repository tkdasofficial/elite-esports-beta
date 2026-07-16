import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { TopBar } from "./top-bar";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";
import { cn } from "@/lib/utils";

const bottomBarPages = ["/", "/leaderboard", "/matches", "/wallet"];

export function AppShell({
  children,
  hideTopBar = false,
  hideBottomNav = false,
}: {
  children: ReactNode;
  hideTopBar?: boolean;
  hideBottomNav?: boolean;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isBottomBarPage = bottomBarPages.includes(pathname);
  const showBottomNav = isMounted && !hideBottomNav && isBottomBarPage;

  return (
    <div className={cn("min-h-screen bg-background", showBottomNav ? "pb-24" : "pb-6")}>
      {!hideTopBar && <TopBar />}
      <main className="mx-auto max-w-md">{children}</main>
      {showBottomNav && <BottomNav />}
      <Sidebar />
    </div>
  );
}
