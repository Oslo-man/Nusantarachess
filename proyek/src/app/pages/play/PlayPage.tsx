import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { DashboardPage } from "./DashboardPage";
import { MatchmakingPage } from "./MatchmakingPage";
import { SavedGamesPage } from "./SavedGamesPage";
import { ReplayPage } from "./ReplayPage";
import { GamePage } from "./GamePage";
import { DashboardSettingsModal } from "./DashboardSettingsModal";

export function PlayPage() {
  return (
    <>
      <AuthGateOverlay />
      <DashboardPage />
      <MatchmakingPage />
      <SavedGamesPage />
      <ReplayPage />
      <GamePage />
      <DashboardSettingsModal />
    </>
  );
}
