import { LandingHeader } from "./LandingHeader";
import { HeroSection } from "./HeroSection";
import { FeatureStrip } from "./FeatureStrip";
import { TopPlayersSection } from "./TopPlayersSection";
import type { SsrLeaderboardRow } from "../../ssr/types";
import { LandingFooter } from "./LandingFooter";

export function LandingView({ topPlayers }: { topPlayers?: SsrLeaderboardRow[] }) {
  return (
    <div id="landing-view">
      <LandingHeader />
      <HeroSection />
      <FeatureStrip />
      <TopPlayersSection players={topPlayers} />
      <LandingFooter />
    </div>
  );
}
