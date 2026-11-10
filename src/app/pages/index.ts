import type { ComponentType } from "react";
import type { PageId } from "../routes";
import type { PageProps } from "../ssr/types";
import { HomePage } from "./home/HomePage";
import { PlayPage } from "./play/PlayPage";
import { BotPage } from "./bot/BotPage";
import { PuzzlesPage } from "./puzzles/PuzzlesPage";
import { GameReviewPage } from "./gamereview/GameReviewPage";
import { LessonsPage } from "./lessons/LessonsPage";
import { LessonDetailPage } from "./lessons/LessonDetailPage";
import { LibraryPage } from "./library/LibraryPage";
import { LeaderboardPage } from "./leaderboard/LeaderboardPage";
import { ProfilePage } from "./profile/ProfilePage";
import { PublicProfilePage } from "./profile/PublicProfilePage";

export const PAGES: Record<PageId, ComponentType<PageProps>> = {
  home: HomePage,
  play: PlayPage,
  bot: BotPage,
  puzzles: PuzzlesPage,
  gamereview: GameReviewPage,
  lessons: LessonsPage,
  "lesson-detail": LessonDetailPage,
  library: LibraryPage,
  leaderboard: LeaderboardPage,
  profile: ProfilePage,
  "public-profile": PublicProfilePage
};
