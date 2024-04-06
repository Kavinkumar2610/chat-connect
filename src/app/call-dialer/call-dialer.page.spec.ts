import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CallDialerPage } from './call-dialer.page';

describe('CallDialerPage', () => {
  let component: CallDialerPage;
  let fixture: ComponentFixture<CallDialerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CallDialerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
