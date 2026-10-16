import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AlertController } from '@ionic/angular';

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
  checkCallAccepted: any;
  callAccepted: boolean = false; // Declare callAccepted property and initialize it to false

  constructor(
    private http: HttpClient,
    private alertController: AlertController // Inject AlertController
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

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
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
  }

  extractPhoneNumbers(csvData: string) {
    const lines: string[] = csvData.split('\n');
    
    // Find the index of the column named "phone-number" in the first row
    const headerRowColumns: string[] = lines[0].split(',');
    const phoneNumberColumnIndex = headerRowColumns.findIndex(column => column.trim().toLowerCase() === 'phone' || column.trim() === 'phone');
  
    if (phoneNumberColumnIndex !== -1) {
      // Iterate over the rows starting from the second row
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const columns: string[] = line.split(',');
        if (columns.length > phoneNumberColumnIndex) { // Check if column index is within bounds
          const phoneNumber: string = columns[phoneNumberColumnIndex].trim(); // Use the found column index
          if (phoneNumber !== '') {
            this.phoneNumbers.push(phoneNumber);
          }
        }
      }
      console.log('Extracted phone numbers:', this.phoneNumbers);
    } else {
      // Display alert if phone-number column is not found
      this.showAlert('Error', 'Phone number column not found in CSV header row.');
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

  clearPhoneNumbers() {
    this.phoneNumbers = [];
    this.callHistory = [];
    this.uploadedFileName = null;
    localStorage.removeItem('uploadedFileName');
    localStorage.removeItem('uploadedFile');
    localStorage.removeItem('callHistory');
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput.value = '';
  }

  startCall() {
    this.callNextNumber(0);
  }

  stopCall() {
    clearInterval(this.checkCallAccepted); // Clear the interval immediately
    console.log('Calls stopped.');
    this.callAccepted = true; // Set callAccepted flag to true
  }
  
  callNextNumber(index: number) {
    if (index < this.phoneNumbers.length) {
      const number = this.phoneNumbers[index];
      console.log('Calling:', number);
      const callWindow = window.open(`tel:${number}`, '_blank');

      const callAcceptedTimeout = 30000;
      const checkInterval = 1000;
      let callAccepted = false;

      const checkCallAccepted = setInterval(() => {
        if (!callWindow || callWindow.closed) {
          clearInterval(checkCallAccepted);
          if (!callAccepted) {
            console.log('Call not accepted. Proceeding to the next number.');
            this.callNextNumber(index + 1);
          }
        }
      }, checkInterval);

      setTimeout(() => {
        if (!callAccepted) {
          console.log('30 seconds passed. Proceeding to the next number.');
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
        console.log('Call accepted. Waiting for the call to end before calling the next person.');
        this.addToCallHistory(number);
      });
    } else {
      console.log('All numbers called.');
    }
  }

  addToCallHistory(number: string) {
    this.callHistory.push(number);
    localStorage.setItem('callHistory', JSON.stringify(this.callHistory));
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [{
        text: 'OK',
        cssClass: 'ok-button',
      }],
    });
    await alert.present();
  }
  
}
