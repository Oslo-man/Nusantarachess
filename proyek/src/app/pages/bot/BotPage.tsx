import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { OpponentSelectScreen } from "./OpponentSelectScreen";
import { BotGameArea } from "./BotGameArea";
import { BotSettingsModal } from "./BotSettingsModal";
import { BotGameOverModal } from "./BotGameOverModal";

export function BotPage() {
  return (
    <>
      <AuthGateOverlay />
      <OpponentSelectScreen />
      <BotGameArea />
      <BotSettingsModal />
      <BotGameOverModal />
    </>
  );
}
