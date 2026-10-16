import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { AlertController, IonContent, IonModal, IonSearchbar } from '@ionic/angular/lazy';
import { Browser } from '@capacitor/browser';
import { COUNTRY_CODES, CountryCode, matchesCountry, toWhatsAppNumber } from './country-codes';

const MALAYSIA = COUNTRY_CODES.find(c => c.region === 'MY')!;

interface HistoryItem {
  to?: string; // full international number, digits only (missing on entries saved before v3.0)
  phoneNumber: string;
  customMessage: string;
}

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.page.html',
  styleUrls: ['./whatsapp.page.scss'],
  host: { class: 'theme-whatsapp' },
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WhatsappPage implements OnInit {
  @ViewChild('chatForm') chatForm!: NgForm;
  @ViewChild(IonContent) content!: IonContent;
  @ViewChild(IonModal) countryModal!: IonModal;
  @ViewChild(IonSearchbar) countrySearch?: IonSearchbar;

  // Malaysia by default, as most users dial local numbers
  selectedCountryCode: CountryCode = MALAYSIA;
  countryQuery = '';
  phoneNumber = '';
  customMessage = '';
  messageHistory: HistoryItem[] = [];

  constructor(
    private storage: Storage,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.messageHistory = (await this.storage.get('messageHistory')) ?? [];
  }

  async startChat() {
    const to = toWhatsAppNumber(this.phoneNumber, this.selectedCountryCode.code);

    let url = `https://wa.me/${to}`;
    if (this.customMessage) {
      url += `?text=${encodeURIComponent(this.customMessage)}`;
    }
    // Browser.open falls back to window.open on web
    await Browser.open({ url });

    this.messageHistory = [
      { to, phoneNumber: this.phoneNumber, customMessage: this.customMessage },
      ...this.messageHistory.filter(item => item.to !== to),
    ].slice(0, 20);
    await this.storage.set('messageHistory', this.messageHistory);

    this.chatForm.resetForm({ phoneNumber: '', customMessage: '' });
  }

  // ponytail: filters all 245 rows on each change detection; trivial at this size, memoize if the list grows
  get countrySections(): { title: string; items: CountryCode[] }[] {
    if (this.countryQuery.trim()) {
      const items = COUNTRY_CODES.filter(c => matchesCountry(c, this.countryQuery));
      return items.length ? [{ title: items.length === 1 ? '1 result' : `${items.length} results`, items }] : [];
    }
    const suggested = this.selectedCountryCode === MALAYSIA ? [MALAYSIA] : [this.selectedCountryCode, MALAYSIA];
    return [
      { title: 'Suggested', items: suggested },
      { title: 'All countries', items: COUNTRY_CODES },
    ];
  }

  selectCountry(country: CountryCode) {
    this.selectedCountryCode = country;
    this.countryModal.dismiss();
  }

  reuse(item: HistoryItem) {
    this.phoneNumber = item.to ? '+' + item.to : item.phoneNumber;
    this.customMessage = item.customMessage;
    this.content.scrollToTop(300);
  }

  async confirmClear() {
    const alert = await this.alertController.create({
      header: 'Clear recent chats?',
      message: 'This removes all numbers from your recent list.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Clear', role: 'destructive', handler: () => this.clearHistory() },
      ],
    });
    await alert.present();
  }

  async clearHistory() {
    this.messageHistory = [];
    await this.storage.remove('messageHistory');
  }
}
