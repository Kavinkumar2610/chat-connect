import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';

@Component({
  selector: 'app-call-dialer',
  templateUrl: './call-dialer.page.html',
  styleUrls: ['./call-dialer.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class CallDialerPage {
  phoneNumbers: string[] = [];
  callHistory: string[] = [];
  uploadedFileName: string | null = null;
  calling = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController
  ) {
    const storedFileName = localStorage.getItem('uploadedFileName');
    if (storedFileName) {
      this.uploadedFileName = storedFileName;
      const storedFile = localStorage.getItem('uploadedFile');
      if (storedFile) {
        this.extractPhoneNumbers(storedFile);
      }
    }

    const storedHistory = localStorage.getItem('callHistory');
    if (storedHistory) {
      this.callHistory = JSON.parse(storedHistory);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.uploadedFileName = file.name;
      localStorage.setItem('uploadedFileName', this.uploadedFileName);
      const reader = new FileReader();
      reader.onload = () => {
        const csvData: string = reader.result as string;
        this.extractPhoneNumbers(csvData);
        localStorage.setItem('uploadedFile', csvData);
      };
      reader.readAsText(file);
    }
    // Allow picking the same file again after removing it
    input.value = '';
  }

  extractPhoneNumbers(csvData: string) {
    this.phoneNumbers = [];
    const lines: string[] = csvData.split('\n');

    // Find the index of the column named "phone" in the first row
    const headerRowColumns: string[] = lines[0].split(',');
    const phoneNumberColumnIndex = headerRowColumns.findIndex(column => column.trim().toLowerCase() === 'phone');

    if (phoneNumberColumnIndex !== -1) {
      // Iterate over the rows starting from the second row
      for (let i = 1; i < lines.length; i++) {
        const columns: string[] = lines[i].split(',');
        if (columns.length > phoneNumberColumnIndex) {
          const phoneNumber: string = columns[phoneNumberColumnIndex].trim();
          if (phoneNumber !== '') {
            this.phoneNumbers.push(phoneNumber);
          }
        }
      }
    } else {
      this.showAlert('No phone column found', 'The first row of the CSV needs a column named "phone". Download the template to see the format.');
    }
  }

  callNumber(number: string) {
    window.location.href = `tel:${number}`;
  }

  downloadTemplate() {
    const templateFilePath = 'assets/phone_numbers_template.csv';
    this.http.get(templateFilePath, { responseType: 'blob' })
      .subscribe((blob: Blob) => {
        const anchor = document.createElement('a');
        anchor.href = window.URL.createObjectURL(blob);
        anchor.download = 'phone_numbers.csv';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      }, (error) => {
        console.error('Failed to download template file:', error);
      });
  }

  async confirmClear() {
    const alert = await this.alertController.create({
      header: 'Remove this file?',
      message: 'This clears the imported numbers and your call history.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Remove', role: 'destructive', handler: () => this.clearPhoneNumbers() },
      ],
    });
    await alert.present();
  }

  clearPhoneNumbers() {
    this.stopCall();
    this.phoneNumbers = [];
    this.callHistory = [];
    this.uploadedFileName = null;
    localStorage.removeItem('uploadedFileName');
    localStorage.removeItem('uploadedFile');
    localStorage.removeItem('callHistory');
  }

  startCall() {
    this.calling = true;
    this.callNextNumber(0);
  }

  stopCall() {
    this.calling = false;
  }

  callNextNumber(index: number) {
    // Pending timers from an earlier call land here after Stop; drop them
    if (!this.calling) {
      return;
    }
    if (index < this.phoneNumbers.length) {
      const number = this.phoneNumbers[index];
      const callWindow = window.open(`tel:${number}`, '_blank');

      const callAcceptedTimeout = 30000;
      const checkInterval = 1000;
      let callAccepted = false;

      const checkCallAccepted = setInterval(() => {
        if (!callWindow || callWindow.closed) {
          clearInterval(checkCallAccepted);
          if (!callAccepted) {
            this.callNextNumber(index + 1);
          }
        }
      }, checkInterval);

      setTimeout(() => {
        if (!callAccepted) {
          clearInterval(checkCallAccepted);
          if (callWindow && !callWindow.closed) {
            callWindow.close();
          }
          this.callNextNumber(index + 1);
        }
      }, callAcceptedTimeout);

      window.addEventListener('beforeunload', () => {
        callAccepted = true;
        clearInterval(checkCallAccepted);
        this.addToCallHistory(number);
      });
    } else {
      this.calling = false;
    }
  }

  addToCallHistory(number: string) {
    this.callHistory.push(number);
    localStorage.setItem('callHistory', JSON.stringify(this.callHistory));
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
