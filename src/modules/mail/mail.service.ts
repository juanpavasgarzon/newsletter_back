import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import mailConfigLoader from '../../config/mail.config';
import type { MailConfig, SendMailOptions } from './contracts';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor(
    @Inject(mailConfigLoader.KEY)
    private mailConfig: MailConfig,
  ) {
    const smtp = mailConfig?.smtp;
    if (smtp?.host && smtp?.user && smtp?.pass) {
      this.transporter = nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.secure,
        auth: { user: smtp.user, pass: smtp.pass },
      });
    }
  }

  async send(options: SendMailOptions): Promise<void> {
    if (!this.transporter) {
      return;
    }
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      console.error(error);
    }
  }
}
