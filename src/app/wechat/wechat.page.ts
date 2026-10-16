import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.page.html',
  styleUrls: ['./wechat.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WechatPage {
  wechatId: string = '';

  startChat() {
    let weChatLink = `weixin://dl/chat?wechatid=${this.wechatId}`;
    console.log('Opening WeChat link:', weChatLink);
    window.open(weChatLink, '_system');
  }
}
