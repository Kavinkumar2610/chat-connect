import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WechatPageRoutingModule } from './wechat-routing.module';

import { WechatPage } from './wechat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WechatPageRoutingModule
  ],
  declarations: [WechatPage]
})
export class WechatPageModule {}
