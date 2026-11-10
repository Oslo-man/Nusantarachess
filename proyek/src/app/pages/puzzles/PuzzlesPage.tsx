import { AuthGateOverlay } from "../../components/AuthGateOverlay";
import { SetupScreen } from "./SetupScreen";
import { PuzzleGameScreen } from "./PuzzleGameScreen";
import { GameOverOverlay } from "./GameOverOverlay";
import { DailyResultOverlay } from "./DailyResultOverlay";
import { PromotionDialog } from "./PromotionDialog";
import { ReviewScreen } from "./ReviewScreen";
import { ReviewDetailOverlay } from "./ReviewDetailOverlay";

export function PuzzlesPage() {
  return (
    <>
      <AuthGateOverlay />
      <SetupScreen />
      <PuzzleGameScreen />
      <GameOverOverlay />
      <DailyResultOverlay />
      <PromotionDialog />
      <ReviewScreen />
      <ReviewDetailOverlay />
    </>
  );
}
