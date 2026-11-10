import type { PageProps } from "../../ssr/types";
import { LessonsMain } from "./LessonsMain";

export function LessonsPage({ ssr }: PageProps) {
  return <LessonsMain data={ssr && ssr.kind === "lessons" ? ssr : undefined} />;
}
