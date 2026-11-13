import { Injectable, signal } from '@angular/core';

/** Estado compartido entre la home y la barra superior. */
@Injectable({
  providedIn: 'root'
})
export class NavService {
  /** Id de la sección de la home que está a la vista (null fuera de /home o en el hero). */
  readonly activeSection = signal<string | null>(null);

  /** true cuando el hero de la home ya salió de la pantalla: la barra pasa de transparente a cristal. */
  readonly heroPassed = signal(false);
}
