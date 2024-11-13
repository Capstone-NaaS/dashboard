export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_seen: string;
  last_notified: string;
}

export interface Log {
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
}

export interface EmailNotificationLog extends Log {
  subject: string;
  receiver_email: string;
  channel: "email";
}
