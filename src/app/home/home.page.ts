import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ThemeService } from '../theme.service';

interface Channel {
  name: string;
  description: string;
  icon: string;
  route?: string; // unset = not available yet
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HomePage {
  readonly version = '3.0.0';
  readonly greeting = this.getGreeting();

  readonly channels: Channel[] = [
    { name: 'WhatsApp', description: 'Message any number without saving it', icon: 'assets/whatsapp.png', route: '/whatsapp' },
    { name: 'Call Dialer', description: 'Call a list of numbers from a CSV file', icon: 'assets/dialer.png', route: '/call-dialer' },
    { name: 'Telegram', description: 'Chat by username or number', icon: 'assets/telegram.png' },
    { name: 'WeChat', description: 'Chat by WeChat ID', icon: 'assets/wechat.png' },
  ];

  constructor(public theme: ThemeService) {}

  private getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      return 'Good morning';
    } else if (hour < 18) {
      return 'Good afternoon';
    }
    return 'Good evening';
  }
}
