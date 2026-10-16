import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { CallDialerPageRoutingModule } from './call-dialer-routing.module';

import { CallDialerPage } from './call-dialer.page';
import { provideHttpClient, withXhr } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallDialerPageRoutingModule
  ],
  declarations: [CallDialerPage],
  providers: [provideHttpClient(withXhr())]
})
export class CallDialerPageModule {}
