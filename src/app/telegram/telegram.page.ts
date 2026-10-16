import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-telegram',
    templateUrl: './telegram.page.html',
    styleUrls: ['./telegram.page.scss'],
    standalone: false
})
export class TelegramPage implements OnInit {
  username: string = '';
  phoneNumber: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  startChat() {
    let telegramLink = `https://t.me/${this.username || this.phoneNumber}`;
    console.log('Opening Telegram link:', telegramLink);
    window.open(telegramLink, '_system');
  }
}
