import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelegramPage } from './telegram.page';

describe('TelegramPage', () => {
  let component: TelegramPage;
  let fixture: ComponentFixture<TelegramPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TelegramPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
