export interface Log {
  channel: string;
  created_at: string;
  log_id: string;
  message: string;
  notification_id: string;
  status: string;
  ttl: number;
  user_id: string;
}

export type Logs = Log[];

export type DateValues = Record<string, number>;

type parseDates = (arr: Logs, dateObj: DateValues) => Array<number>;

export interface ChartProps {
  logs: Logs;
  chartLabels: Array<string>;
  parseDates: parseDates;
  datesObj: DateValues;
}
