import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WechatPage } from './wechat.page';

const routes: Routes = [
  {
    path: '',
    component: WechatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WechatPageRoutingModule {}
