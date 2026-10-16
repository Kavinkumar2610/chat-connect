import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular'; // Import Storage service
import { ActionSheetController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

interface CountryCode {
  name: string;
  code: string;
}

@Component({
  selector: 'app-whatsapp',
  templateUrl: './whatsapp.page.html',
  styleUrls: ['./whatsapp.page.scss'],
  standalone: false
})
export class WhatsappPage implements OnInit {
  countryCodes: CountryCode[] = [];
  selectedCountryCode: CountryCode = { name: '', code: '' };
  phoneNumber: string = '';
  customMessage: string = '';
  messageHistory: { phoneNumber: string, customMessage: string }[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage, // Inject Storage service
    private actionSheetController: ActionSheetController
  ) { }

  async ngOnInit() {
    this.getCountryCodes();
    await this.storage.create();
    this.loadMessageHistory();
  }

  getCountryCodes() {
    const url = 'https://restcountries.com/v3.1/all';
    this.http.get<any[]>(url).subscribe(
      data => {
        this.countryCodes = data.map(country => ({
          name: country.name.common,
          code: country.idd?.root + (country.idd?.suffixes && country.idd?.suffixes.length > 0 ? country.idd.suffixes[0] : '') || 'NA'
        }));
  
        // Find the index of Malaysia in the countryCodes array
        const malaysiaIndex = this.countryCodes.findIndex(country => country.name === 'Malaysia');
        // If Malaysia is found, move it to the beginning of the array
        if (malaysiaIndex !== -1) {
          const malaysiaCountry = this.countryCodes.splice(malaysiaIndex, 1)[0];
          this.countryCodes.unshift(malaysiaCountry);
        }
  
        // Set the first country code as default
        this.selectedCountryCode = this.countryCodes[0];
      },
      error => {
        console.error('Error fetching country codes', error);
        // Set a default country code in case of error
        this.countryCodes = [{ name: 'Malaysia', code: '+60' }];
        this.selectedCountryCode = this.countryCodes[0]; // Set the first country code as default
      }
    );
  }

  async startChat() {
    if (!this.phoneNumber) {
      console.error('Phone number is required');
      return;
    }

    let whatsappLink = `https://wa.me/${this.selectedCountryCode.code}${this.phoneNumber}`;
    if (this.customMessage) {
      whatsappLink += `?text=${encodeURIComponent(this.customMessage)}`;
    }
    console.log('Opening WhatsApp link:', whatsappLink);

    if (Browser) {
      await Browser['open']({ url: whatsappLink });
    } else {
      window.open(whatsappLink, '_blank');
    }

    // Save message to history
    this.messageHistory.unshift({ phoneNumber: this.phoneNumber, customMessage: this.customMessage });
    // Save to storage
    await this.storage.set('messageHistory', this.messageHistory);
    // Reset input fields
    this.phoneNumber = '';
    this.customMessage = '';
  }

  validatePhoneNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowedKeys.includes(event.key) && isNaN(Number(event.key))) {
      event.preventDefault();
    }
  }

  async showMessage(customMessage: string) {
    const actionSheet = await this.actionSheetController.create({
      header: customMessage,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }
      ]
    });
  
    await actionSheet.present();
  }

  async clearHistory() {
    // Clear message history
    this.messageHistory = [];
    // Clear storage
    await this.storage.remove('messageHistory');
  }

  async loadMessageHistory() {
    const storedHistory = await this.storage.get('messageHistory');
    if (storedHistory) {
      this.messageHistory = storedHistory;
    }
  }

  async reMessage(phoneNumber: string) {
    // Autofill the phone number when re-messaging
    this.phoneNumber = phoneNumber;
  }
  
}
