import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnAirPilotComponent } from './on-air-pilot.component';

describe('OnAirPilotComponent', () => {
  let fixture: ComponentFixture<OnAirPilotComponent>;
  let host: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [OnAirPilotComponent] }).compileComponents();
    fixture = TestBed.createComponent(OnAirPilotComponent);
    host = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('muestra siempre el rótulo «En el aire»', () => {
    expect(host.textContent).toContain('En el aire');
  });

  it('se enciende y se apaga con live', () => {
    expect(host.classList.contains('is-live')).toBeFalse();
    fixture.componentRef.setInput('live', true);
    fixture.detectChanges();
    expect(host.classList.contains('is-live')).toBeTrue();
    expect(host.textContent).toContain('En el aire');
  });

  it('es decorativo para el lector de pantalla', () => {
    expect(host.getAttribute('aria-hidden')).toBe('true');
  });
});
