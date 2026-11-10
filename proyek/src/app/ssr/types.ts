export interface SsrLessonCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface SsrLessonSummary {
  id: string;
  category: string;
  title: string;
  summary: string;
}

export interface SsrLessonDetail {
  id: string;
  title: string;
  learn: string;
  fenCaption: string;
  side: "Putih" | "Hitam";
}

export type SsrLeaderboardCategory = "bullet" | "blitz" | "rapid" | "puzzle";

export interface SsrLeaderboardRow {
  rank: number;
  username: string;
  rating: number;
  gamesPlayed: number | null;
}

export interface SsrSearchResult {
  username: string;
  eloBlitz: number;
}

export interface SsrPublicUser {
  username: string;
  createdAt: number | string | null;
  eloBullet: number;
  eloBlitz: number;
  eloRapid: number;
  puzzleRating: number;
  wins: number;
  draws: number;
  losses: number;
  puzzleSolved: number;
  profilePhoto: string;
  photoInDom?: boolean;
}

export interface SsrRecentGame {
  id?: number;
  opponentName: string;
  opponentElo: number;
  category: string;
  result: string;
  eloChange: number;
  playedAt: number;
}

export type SsrPageData =
  | { kind: "home"; topPlayers: SsrLeaderboardRow[] }
  | { kind: "lessons"; categories: SsrLessonCategory[]; lessons: SsrLessonSummary[] }
  | { kind: "leaderboard"; category: SsrLeaderboardCategory; rows: SsrLeaderboardRow[]; searchQuery: string; searchResults: SsrSearchResult[] | null }
  | { kind: "public-profile"; user: SsrPublicUser; recentGames: SsrRecentGame[]; totalGames: number }
  | { kind: "profile-not-found"; username: string }
  | { kind: "lesson"; lesson: SsrLessonDetail; prevId: string | null; nextId: string | null }
  | { kind: "lesson-not-found"; id: string };

export interface PageProps {
  ssr?: SsrPageData;
}
