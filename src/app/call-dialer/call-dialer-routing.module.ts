import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallDialerPage } from './call-dialer.page';

const routes: Routes = [
  {
    path: '',
    component: CallDialerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallDialerPageRoutingModule {}
