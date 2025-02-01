import { Injectable } from '@nestjs/common';
import * as webpush from 'web-push';

@Injectable()
export class PushNotificationService {
  constructor() {
    webpush.setVapidDetails(
      "mailto:vatafo7905@modotso.com", // TODO Update this email with ali email
      `BERWzt4y5o1_QFOHVlsx9Z349LbzneNhOBSCtKH4OhLSNuvi0PIB3vaMXKOechTMStm3HoUF9zhYp9C2CSsy-yU`,
      `PkowlVd-zRqhyXyPYqh-IiTlN13WW2oEM7Lm_fjKN9s`
    );
  }

  async sendNotification(subscription, payload) {
    return webpush.sendNotification(subscription, payload);
  }
}
