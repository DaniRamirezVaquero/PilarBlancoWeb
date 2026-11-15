import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Piloto «EN EL AIRE» de estudio de radio: el aro está siempre y la luz lo rellena mientras suena algo.
 * El estado se lee por la forma (aro vacío o lleno), no por el color del acento. Es decorativo: el estado
 * real lo anuncian los botones de cada pista.
 */
@Component({
  selector: 'app-on-air-pilot',
  standalone: true,
  template: `<span class="lamp"><span class="lamp-light"></span></span><span class="pilot-label">En el aire</span>`,
  styleUrl: './on-air-pilot.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.is-live]': 'live()',
  },
})
export class OnAirPilotComponent {
  /** true mientras suena una pista. */
  readonly live = input(false);
}
