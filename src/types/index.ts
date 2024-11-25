export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_seen: string;
  last_notified: string;
  preferences: {
    email: boolean;
    in_app: boolean;
  };
}

export interface deadLog {
  body: {
    receiver_email?: string;
    subject?: string;
    message: string;
  };
  channel: string;
  notification_id: string;
  user_id: string;
}

export interface Log {
  channel: string;
  user_id: string;
  created_at: string;
  status: string;
  notification_id: string;
  log_id: string;
  ttl: number;
  message: string;
}

export interface InAppNotificationLog extends Log {
  channel: "in_app";
  status:
    | "Notification request received."
    | "In-app notification queued for sending."
    | "Notification not sent - channel disabled by user."
    | "In-app notification sent."
    | "In-app notification read."
    | "In-app notification deleted."
    | "In-app notification unable to be broadcast.";
}

export interface EmailNotificationLog extends Log {
  subject: string;
  receiver_email: string;
  channel: "email";
  status:
    | "Notification request received."
    | "Notification not sent - channel disabled by user."
    | "Email sent."
    | "Error sending email."
    | "Email could not be sent: SES failure.";
}

export interface SlackNotificationLog extends Log {
  channel: "slack";
  status:
    | "Notification request received."
    | "Notification not sent - channel disabled by user."
    | "Slack notification sent."
    | "Slack notification could not be sent."
    | "Error sending Slack notification.";
}

export type DateValues = Record<string, number>;

type parseDates = (arr: Log[], dateObj: DateValues) => Array<number>;

export interface ChartProps {
  logs: Log[];
  chartLabels: Array<string>;
  parseDates: parseDates;
  datesObj: DateValues;
}
