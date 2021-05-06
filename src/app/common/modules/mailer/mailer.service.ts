import { LoggerService } from './../logger/logger.service';
import { ConfigService } from './../config/config.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { boolean } from 'boolean';

@Injectable()
export class MailerService implements OnModuleInit {
  // @note: uses lazyloading: do not use directly, instead use getTransporter()
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
  ) { }

  async onModuleInit() {
  }

  getConfig() {
    const config = this.config.getMailer();
    config.test = boolean(config.test);
    config.options.secure = boolean(config.options.secure);

    return config;
  }

  async getTransporter(): Promise<nodemailer.Transporter> {
    const config = this.getConfig();
    this.transporter =  config.test ?
      this.transporter || await this.createTestAccount() :
      await this.createAccount(config.options);

    return this.transporter;
  }

  async createAccount(options: nodemailer.TransportOptions): Promise<nodemailer.Transporter> {
    return nodemailer.createTransport(options);
  }

  async createTestAccount(): Promise<nodemailer.Transporter> {
    this.logger.debug(`mailer-service: Creating mail test account`);
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
  }

  async sendMail(options: nodemailer.SendMailOptions) {
    const info = await (await this.getTransporter()).sendMail(options);

    this.logger.debug(`mailer-service: send mail from: ${options.from} to: ${options.to} got result: ${info.response}`);

    if (this.getConfig().test) {
      this.logger.debug(`mailer-service: sent mail ${info.messageId} ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  }
}
