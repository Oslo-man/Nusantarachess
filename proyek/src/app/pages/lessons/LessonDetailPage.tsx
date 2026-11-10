import type { PageProps } from "../../ssr/types";
import { LessonDetailMain, LessonNotFoundMain } from "./LessonDetailMain";

export function LessonDetailPage({ ssr }: PageProps) {
  if (ssr && ssr.kind === "lesson-not-found") return <LessonNotFoundMain id={ssr.id} />;
  return <LessonDetailMain data={ssr && ssr.kind === "lesson" ? ssr : undefined} />;
}
