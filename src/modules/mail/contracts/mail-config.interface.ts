export interface MailSmtpConfig {
  host?: string;
  port: number;
  user?: string;
  pass?: string;
  secure: boolean;
}

export interface MailConfig {
  smtp: MailSmtpConfig;
  from?: string;
  frontendUrl?: string;
}
