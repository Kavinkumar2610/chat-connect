import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import the Router module
import { AdMobFree, AdMobFreeBannerConfig } from '@ionic-native/admob-free/ngx'; // Make sure to use '/ngx' at the end


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  greeting: string = ''; // Add the greeting property
  

  constructor(
    private router: Router,
    private admobFree: AdMobFree

  ) { // Inject the Router module
    this.setGreeting();
  }

  ngOnInit() {
    this.showBannerAd(); // Call showBannerAd() method here
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
      default:
        console.error('Unsupported chat platform');
    }
  }
  showBannerAd() {
    const bannerConfig: AdMobFreeBannerConfig = {
      id: 'ca-app-pub-0000000000000000/0000000000',
      autoShow: true
    };
    this.admobFree.banner.config(bannerConfig);
    this.admobFree.banner.prepare().then(() => {
      // Banner Ad is ready
    }).catch((error: any) => console.error(error));
  }

  initializeAdMob() {
    this.admobFree.interstitial.config({
      id: 'ca-app-pub-0000000000000000~0000000000',
      autoShow: true
    });
    this.admobFree.interstitial.prepare().then(() => {
      // interstitial ad is ready
    }).catch(err => console.error('AdMob interstitial error:', err));
  }
  
}
