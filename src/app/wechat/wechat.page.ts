import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wechat',
  templateUrl: './wechat.page.html',
  styleUrls: ['./wechat.page.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WechatPage implements OnInit {
  wechatId: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  startChat() {
    let weChatLink = `weixin://dl/chat?wechatid=${this.wechatId}`;
    console.log('Opening WeChat link:', weChatLink);
    window.open(weChatLink, '_system');
  }
}
