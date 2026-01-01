
export enum ViewType {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  MATRIX = 'MATRIX',
  INSIGHTS = 'INSIGHTS',
  SYNC = 'SYNC'
}

export type UrgencyLevel = 1 | 2 | 3 | 4 | 5;
export type ImportanceLevel = 1 | 2 | 3 | 4 | 5;

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string YYYY-MM-DD
  estimatedTime: number; // in minutes
  urgency: UrgencyLevel;
  importance: ImportanceLevel;
  completed: boolean;
  priorityScore: number; // urgency * importance
  // AI Metrics
  actualTime?: number;
  onTime?: boolean;
}

export type SortField = 'urgency' | 'importance' | 'estimatedTime' | 'priorityScore' | 'title';
export type SortOrder = 'asc' | 'desc';

export interface CalendarState {
  currentDate: Date;
  view: ViewType;
  tasks: Task[];
}
