import { LandingView } from "./LandingView";
import { AuthModal } from "./AuthModal";
import { LevelSelectModal } from "./LevelSelectModal";
import { HomeDashboard } from "./HomeDashboard";
import type { PageProps } from "../../ssr/types";

export function HomePage({ ssr }: PageProps) {
  return (
    <>
      <LandingView topPlayers={ssr && ssr.kind === "home" ? ssr.topPlayers : undefined} />
      <AuthModal />
      <LevelSelectModal />
      <HomeDashboard />
    </>
  );
}
