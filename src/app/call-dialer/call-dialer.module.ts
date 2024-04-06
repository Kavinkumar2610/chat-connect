import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallDialerPageRoutingModule } from './call-dialer-routing.module';

import { CallDialerPage } from './call-dialer.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallDialerPageRoutingModule,
    HttpClientModule 
  ],
  declarations: [CallDialerPage]
})
export class CallDialerPageModule {}
