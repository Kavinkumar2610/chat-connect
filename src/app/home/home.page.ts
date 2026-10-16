import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router module


@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: false
})
export class HomePage {
  greeting: string = ''; // Add the greeting property
  

  constructor(private router: Router) {
    this.setGreeting();
  }

  setGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.greeting = 'Good Morning';
    } else if (hour < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  openApp(platform: string) {
    switch(platform) {
      case 'whatsapp':
        this.router.navigateByUrl('/whatsapp');
        break;
      case 'telegram':
        this.router.navigateByUrl('/telegram');
        break;
      case 'wechat':
        this.router.navigateByUrl('/wechat');
        break;
      case 'call-dialer':
        this.router.navigateByUrl('/call-dialer');
        break;
      default:
        console.error('Unsupported chat platform');
    }
  }
}
