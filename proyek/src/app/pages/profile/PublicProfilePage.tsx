import type { PageProps } from "../../ssr/types";
import { PublicProfileMain, PublicProfileNotFoundMain } from "./PublicProfileMain";

export function PublicProfilePage({ ssr }: PageProps) {
  if (ssr && ssr.kind === "profile-not-found") return <PublicProfileNotFoundMain username={ssr.username} />;
  return <PublicProfileMain data={ssr && ssr.kind === "public-profile" ? ssr : undefined} />;
}
