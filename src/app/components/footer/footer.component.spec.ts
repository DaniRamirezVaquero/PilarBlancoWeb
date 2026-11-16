import { TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  it('muestra el copyright y nunca los créditos de Font Awesome', () => {
    const fixture = TestBed.createComponent(FooterComponent);
    fixture.detectChanges();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('PILAR BLANCO');
    expect(text).not.toContain('Font Awesome');
  });
});
