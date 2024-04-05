import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WechatPage } from './wechat.page';

describe('WechatPage', () => {
  let component: WechatPage;
  let fixture: ComponentFixture<WechatPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WechatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
