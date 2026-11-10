import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import type { PageProps } from "../../ssr/types";
import { LeaderboardMain } from "./LeaderboardMain";

export function LeaderboardPage({ ssr }: PageProps) {
  return (
    <>
      <AuthGateOverlay hidden />
      <LeaderboardMain data={ssr && ssr.kind === "leaderboard" ? ssr : undefined} />
    </>
  );
}
