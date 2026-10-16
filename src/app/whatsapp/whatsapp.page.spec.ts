import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular/lazy';
import { IonicStorageModule } from '@ionic/storage-angular';
import { WhatsappPage } from './whatsapp.page';
import { COUNTRY_CODES, matchesCountry, toWhatsAppNumber } from './country-codes';

describe('WhatsappPage', () => {
  let component: WhatsappPage;
  let fixture: ComponentFixture<WhatsappPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WhatsappPage],
      imports: [FormsModule, IonicModule.forRoot(), IonicStorageModule.forRoot()],
    });
    fixture = TestBed.createComponent(WhatsappPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to Malaysia', () => {
    expect(component.selectedCountryCode.region).toBe('MY');
  });
});

describe('toWhatsAppNumber', () => {
  it('prepends the dial code and drops the trunk 0', () => {
    expect(toWhatsAppNumber('012-345 6789', '+60')).toBe('60123456789');
    expect(toWhatsAppNumber('(415) 555-0100', '+1')).toBe('14155550100');
  });

  it('keeps full international numbers as-is', () => {
    expect(toWhatsAppNumber('+65 9876 5432', '+60')).toBe('6598765432');
  });
});

describe('COUNTRY_CODES', () => {
  it('has unique regions with + codes and readable names', () => {
    expect(new Set(COUNTRY_CODES.map(c => c.region)).size).toBe(COUNTRY_CODES.length);
    expect(COUNTRY_CODES.find(c => c.region === 'US')).toEqual({ region: 'US', name: 'United States', code: '+1', flag: '🇺🇸' });
    expect(COUNTRY_CODES.every(c => /^\+\d{1,3}$/.test(c.code))).toBeTrue();
  });
});

describe('matchesCountry', () => {
  const find = (q: string) => COUNTRY_CODES.filter(c => matchesCountry(c, q)).map(c => c.region);

  it('matches by name, ignoring case and accents', () => {
    expect(find('malay')).toEqual(['MY']);
    expect(find('aland')).toContain('AX');
  });

  it('matches by region and dial code', () => {
    expect(find('my')).toContain('MY');
    expect(find('+60')).toEqual(['MY']);
    expect(find('60')).toEqual(['MY']);
  });

  it('matches everything for an empty query', () => {
    expect(find('  ').length).toBe(COUNTRY_CODES.length);
  });
});
