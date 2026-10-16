import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.page.html',
  styleUrls: ['./telegram.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class TelegramPage {
  username: string = '';
  phoneNumber: string = '';

  startChat() {
    let telegramLink = `https://t.me/${this.username || this.phoneNumber}`;
    console.log('Opening Telegram link:', telegramLink);
    window.open(telegramLink, '_system');
  }
}
