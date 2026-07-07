export type StatsPeriod = "week" | "month" | "year" | "all";

export interface StatsSummary {
  percentCompleted: number;
  completedFards: number;
  totalFards: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StatsDaily {
  date: string;
  total: number;
  completed: number;
}

export interface StatsPrayer {
  name: string;
  total: number;
  completed: number;
  percent: number;
}

export interface StatsResponse {
  period: StatsPeriod;
  range: { from: string; to: string };
  summary: StatsSummary;
  daily: StatsDaily[];
  byPrayer: StatsPrayer[];
}
