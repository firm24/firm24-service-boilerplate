import { ConfigService } from './../config/config.service';
import { Injectable, Inject } from '@nestjs/common';
import { RECAPTCHA } from '../../constants';
import recaptcha2 from 'recaptcha2';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class CaptchaService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(RECAPTCHA) private readonly recaptcha: typeof recaptcha2,
  ) {
    this.logger = this.logger.build(CaptchaService.name)
  }

  isEnabled(): boolean {
    const config = this.config.getCaptcha();
    return Boolean(config.enabled);
  }

  getCaptcha(): recaptcha2 | undefined {
    if (!this.isEnabled()) {
      return undefined;
    }

    const config = this.config.getCaptcha();

    return new this.recaptcha({
      secretKey: config.secret_key,
      siteKey: config.site_key,
    });
  }

  async validate(response: string): Promise<{ success: boolean, errors: string[] }> {
    const result = { success: true, errors: [] };

    if (!this.isEnabled()) {
      return result;
    }

    const captcha = await this.getCaptcha();

    try {
      await captcha.validate(response);
    } catch (e) {
      const errors = captcha.translateErrors(e);
      this.logger.warn(`Failed captcha ${errors}`);
      result.success = false;
      result.errors = typeof errors === 'string' ? [errors] : errors;
    }

    return result;
  }
}
