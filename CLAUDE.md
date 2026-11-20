# CLAUDE.md

Web de la actriz Pilar Blanco: Angular 20 + Tailwind/DaisyUI con prerender estático, desplegada en Vercel.

## Comandos
- `npm start` — servidor de desarrollo en http://localhost:4200 (no sirve `/api`)
- `npm run build` — build + prerender a `dist/pilar-blanco-web`
- `npm test -- --watch=false --browsers=ChromeHeadless` — Karma/Jasmine
- `npx tsc -p tsconfig.app.json --noEmit` — tipos

## Estética
Solo tokens DaisyUI (`--p`, `--s`, `--a`, `--n`, `--bc`), Lato + Playfair Display y los temas `mytheme` / `mytheme-portada`, que alternan con la portada del hero (`HeroThemeService` y el script de `index.html`). Sin colores hex nuevos. **Única excepción:** el negro de pantalla de cine del Reel, `--film-black` en `:root` de `styles.css` (bandas panorámicas, tira de película y la mezcla de la sala a oscuras), en la home y en la pantalla y la sala de `/video`. No lo uses para nada más. La sala (`.house-lights`, `.lights-down > .house-lights`) y las bandas (`.screen-bands`) viven en `styles.css` y las comparten la home y `/video`.

**Animación:** solo `transform`, `opacity` y `clip-path`, con `prefers-reduced-motion` (`utils/motion.ts`) y estados ocultos que solo pone el JS en el navegador (el prerender pinta siempre el estado final). **Única excepción:** `stroke-dashoffset` en la firma de `#contacto` (`app-signature`), aprobada para que la pluma recorra el trazo. No la uses en nada más.

**Nada que recuerde a una esquela** (lo pidió la actriz): ni retratos dentro de losas o marcos negros, ni rótulos centrados en mayúsculas espaciadas con un año sobre fondo oscuro.

## Home (`/home`)
Hero a pantalla completa y debajo un scroll de secciones con ancla: `#reel`, `#fotos`, `#voz`, `#trayectoria` y `#contacto`. La navegación es una barra superior fija (`app-site-nav`), sin menú lateral. Contiene el nombre, las anclas (`/home#voz`…), «CV» (`/curriculum`) y las redes en texto (Instagram · Vimeo · Email). Es transparente sobre el hero y pasa a cristal al dejarlo atrás y en las páginas internas. Por debajo de 1024 px, un botón «Menú» abre un panel a pantalla completa (diálogo con foco atrapado y Esc). En la home, las anclas son `<a href>` nativos que maneja `goTo()`: con `RouterLink` el router lanzaba un segundo scroll. La sección visible se marca con `NavService.activeSection` y `aria-current`.

- `#reel`, «se apagan las luces»: la capa `.house-lights` (`--s` mezclado al 55 % con `--film-black`, L≈0.18–0.22, a 0.95) solo cambia de opacidad mientras `NavService.activeSection() === 'reel'`. Con movimiento reducido también se oscurece, pero sin transición. El rótulo va a la izquierda, alineado con la pantalla («REEL» en Playfair y el año en Lato fina). Las bandas negras van en el `padding` de `.reel-screen screen-bands` (espacio siempre reservado) y «Más escenas» es `app-film-strip`, con los rótulos fuera del negro. El estado oculto previo a la entrada (`is-armed`) solo lo pone el JS en el navegador, sin movimiento reducido y sin hash de sección. La entrada (`is-shown`, una sola vez) la dispara `revealOnce` sobre el reel (15 %) o el foco dentro de él; mientras tanto la tira es `inert`.
- `#fotos`: `app-contact-sheet`, hoja de papel claro (`--n`, tinta `--s`) con marcas de recorte en las esquinas y el borde de la película numerado por fila («▸ 1 ▸ 2 400TX ▸ 3…»). Cada fotograma es un botón que abre `app-photo-viewer`: `<dialog>` modal a pantalla completa sobre papel claro (nunca negro), con anterior/siguiente, flechas, deslizar, contador «3 / 12», Esc y la X; da la vuelta al final y devuelve el foco al fotograma visto. La foto vuela desde su fotograma al abrir y vuelve a él al cerrar (`originOf`, `flightFrom`: `transform` + `clip-path`); el papel es el `::backdrop` y entra con fundido. El scroll se bloquea en `html` (no en `body`) junto con `scrollbar-gutter: stable`, para que la página no salte al aparecer y desaparecer la barra. El carrusel solo vive en `/gallery`; las fotos están en `data/photos.data.ts` (`BOOK_PHOTOS`).
- `#voz`: banda de monitor `.voz-monitor` con `app-on-air-pilot`, el nombre y el tiempo de la demo cargada y `app-on-air-wave`; la onda es además el slider para saltar dentro de la demo (`seek()`/`onKeySeek()` de `voice-strip`). Debajo, `app-voice-strip variant="carts"`: cada demo es un cartucho de emisión (carcasa en el tono base, etiqueta de papel `--n`, ventana de cinta) que sube al cargarse y despliega una pestaña de acento mientras suena. Sin onda por pista en la home. En los cartuchos no se usa `[style.--n]`: pisaría el token del papel.
- `#trayectoria`: a dos columnas desde 1024 px (`.tray-grid`, 7/12 y 5/12). A la izquierda, `app-credits-roll`: cada crédito es el título de la obra (Playfair grande, con enlace si lo hay) y debajo, en Lato pequeña y en una línea, quién y el formato («Paco Izquierdo · Largometraje»). Mayúscula y minúscula, sin años ni filetes. Entran fila a fila una sola vez con `revealOnce` (20 %): el título se descubre de izquierda a derecha (`clip-path` + `transform`) y el secundario le sigue. Debajo, en el borde izquierdo de los créditos, «Currículum completo» y «Descargar CV». A la derecha, «Sobre mí» fijo al hacer scroll (`sticky`): el retrato, el título, `ABOUT_TEASER` (texto propio de la home, no sale de `/bio`) y «Leer la biografía». En móvil va todo en una columna: créditos, botones y «Sobre mí».
- `#contacto`: `app-signature` y, debajo, el correo grande siempre visible. La firma es «Pilar Blanco» como en el lockup del CV: «Pilar» manuscrita y debajo, alineado con su final, «BLANCO» en Lato Light (`<text>` del mismo SVG, con `textLength` para el tracking; datos en `SIGNATURE_SURNAME`). Va en `--bc` pleno, con `role="img"` y `aria-label="Pilar Blanco"`, y reserva su caja con `aspect-ratio`. **Aprobada por Pilar (2026-11-16): `SIGNATURE_VECTOR_APPROVED = true`.** Con `false` (`data/signature.data.ts`) se ve el respaldo estático: `assets/firma-pilar.webp`, la firma recortada del lockup del CV con alfa y usada como máscara. Aprobada, o con `?firma=trazo` para que Pilar la valide, se ve el vector: 5 trazos de la línea central (grosor 8, IoU 0.82 con el original) en SVG inline, que se escriben uno tras otro (el punto de la «i», el último) animando `stroke-dashoffset` (la excepción de arriba) al verse el 60 %; al acabar, «BLANCO» entra solo con `opacity` y `transform`. Los trazos (`data/signature-strokes.data.ts`) los pinta `app-signature-vector` dentro de un `@defer (when vector())`: salen del bundle inicial y, sin aprobar y sin `?firma=trazo`, ni se descargan. Los tiempos (`SIGNATURE_STROKE_TIMINGS`) se quedan en `signature.data.ts` y deben coincidir con los trazos. El respaldo estático se ve hasta que el vector está dibujado.

Botón ▶ del hero: abre `app-reel-modal` (Vimeo a pantalla completa), cargado con `@defer (prefetch on idle)` dentro de `@if (showReel)`: fuera del bundle inicial. El modal bloquea el scroll en `html`, cierra con Esc y la X y pone el foco en la X; al cerrar, la home devuelve el foco a ▶.

## Vídeo (`/video`, «Cartelera»)
- Arriba, una sola pantalla 16:9 con bandas (`.screen-bands`) y debajo «Ahora en pantalla» con el nombre (Lato + Playfair, a la izquierda). Un solo `vimeo-facade`, recreado con `@for (video of [current()]; …)` al cambiar de vídeo; en el prerender es el reel con su póster `priority` (LCP).
- «En cartel»: `app-poster-wall`, un cartel 2:3 por vídeo (el reel y las 3 escenas; 2 columnas y 4 desde 1024 px), con el recorte del póster vivo, `srcset` (el `sizes` es el ancho pintado, no el del cartel) y respaldo `fallbackPoster`. Fondo de reserva `--b1`, sin marcos, título fuera de la foto y a la izquierda; el cartel en pantalla lleva `aria-current` y un filete de acento bajo el título. Cada hueco tiene el `id` con el slug: los enlaces viejos `/video#slug` bajan al cartel.
- Pulsar un cartel lo proyecta: `vimeo-facade` con `startLoaded` (el iframe nace sonando, porque hubo un clic), la página sube a la pantalla (`scrollBehaviorFor`) y el foco pasa al iframe sin scroll. `/video?escena=slug` (lo usa «Más escenas» de la home) pone esa escena con su póster, sin sonar.
- La sala se apaga (`lights-down`) mientras el vídeo suena **y** se ve al menos el 35 % de la pantalla (IntersectionObserver). Lo que suena lo dicen los eventos `play`/`pause`/`ended` de Vimeo por `postMessage` (`utils/vimeo-player-events.ts`, sin SDK, origen `https://player.vimeo.com` y `source` del iframe validados). Tras suscribirse, se pregunta `getPaused` por si `play` llegó antes. Con la sala a oscuras, «En cartel» desaparece (`opacity: 0` + `visibility: hidden`, sin salto de layout y fuera del tabulador; sin transición con movimiento reducido) y solo quedan la pantalla y la sala: ningún retrato sobre negro. Vuelve al pausar, terminar o salir la pantalla de la vista.

## Voz (`/voice`)
- Doblaje, «subtítulo protagonista»: una demo debajo de otra (52rem). El póster se recorta y amplía para ocultar el subtítulo quemado y las bandas: el contenedor pone `--poster-pos` y `--poster-zoom` en el host de `vimeo-facade` (zoom estático, nunca animado). Debajo, la frase doblada en Lato grande, centrada, en mayúscula y minúscula; entra de corte una vez con `revealOnce` (50 %).
- Locución «en el aire»: `app-on-air-pilot` junto al título y `app-on-air-wave` de fondo (la demo cargada, con máscara a los lados) detrás de `app-voice-strip` (`tracks`). Para que la onda se vea, la página aclara el velo de las filas con `--voice-row-bg`, `--voice-row-bg-even` y `--voice-row-blur` (por defecto, el velo de siempre).
- Encuadres y frases en `data/screens.data.ts` (solo lo cargan `/video` y `/voice`). Se midieron sobre los pósters guardados: hay que confirmarlos con los vivos en un preview de Vercel.

## Footer
El footer de siempre (degradado `zinc`, «© 2026 PILAR BLANCO - Todos los derechos reservados»), en todas las rutas. **Nunca** lleva los créditos de Font Awesome.

## Botones
Un único estilo global, `.btn-line` en `styles.css`: borde fino, sin relleno, Lato en mayúsculas con tracking y relleno invertido al pasar el ratón. Sobre el papel blanco del CV se usa `.btn-line-paper`. Las descargas son `<a download>` con el icono de descarga y sin el peso del archivo. No uses `btn-accent` ni `btn-primary` de DaisyUI.

## Datos y utilidades
- `src/app/data/portfolio.data.ts`: `REEL`, `SCENES`, `DUBBING`, `VOICE` (con los `peaks` de cada MP3), `HIGHLIGHT_CREDITS`, `ABOUT_TEASER`, `CONTACT`. `src/app/data/signature.data.ts`: la firma (interruptor, caja y trazos).
- `src/app/utils/vimeo-thumbnail.ts` (puro; `api/vimeo-poster.mjs` replica su validación porque no puede importarlo) y `src/app/utils/waveform.ts` (`resampleBars`, `layoutBars`), con sus `.spec.ts`.
- `src/app/utils/reveal-once.ts`: «armar y mostrar una vez» (reel, créditos y firma). No arma sin IntersectionObserver, con movimiento reducido, con un hash que apunte a un elemento de la página ni si el elemento ya se ve; entra al verse, con el foco dentro o al activarse el movimiento reducido (avisa del motivo).
- `src/app/data/screens.data.ts`: `POSTER_FRAMING` (carteles), `DUBBING_FRAMING` y `DUBBING_LINES`. Fuera del bundle inicial.
- `src/app/utils/vimeo-player-events.ts`: `parseVimeoMessage` y `watchVimeoPlayback` (escucha de `play`/`pause`/`ended` del reproductor por `postMessage`).
- El visor de fotos se carga con `@defer (when …; prefetch on idle)` en `contact-sheet`: no pesa en el bundle inicial (aviso a 500 kB).

## Locución (`voice-strip`)
Sustituye al antiguo cassette (ya no existe). Dos variantes: `tracks` (por defecto, /voice: una fila con su onda por demo) y `carts` (home: cartuchos sin onda, el contenedor pone el monitor). La onda se dibuja a escala 1:1: el viewBox es el tamaño real de la pista en px, con barras de 2 px cada ~6 px y sin tope.

## En el aire (`components/on-air`)
Reutilizables (la home y `/voice`), sin nada propio de ninguna página.
- `on-air-wave` (`peaks`, `progress`, `live`): onda a escala 1:1 con `layoutBars` (barras de 4 px cada ~12) que llena su contenedor; el contenedor decide tamaño y posición. Colores y máscara opcionales con `--air-rest-fill`, `--air-played-fill` y `--air-mask`. El avance anima solo `transform` con doble `translateX`. Al hidratar no oculta las barras del servidor; si nace en el navegador, aparece con un fundido tras la primera medida. Es `aria-hidden`.
- `on-air-pilot` (`live`): aro `bc` siempre visible que la luz de acento rellena; en reposo, la etiqueta queda a 0.6. El estado no depende del color del acento y también es `aria-hidden`.

## Carátulas de Vimeo (`api/vimeo-poster.mjs`)
La función es JavaScript ESM autocontenido (`.mjs`). El `package.json` no declara `"type": "module"`, así que una función `.ts` que importe de `src/` se carga como CommonJS y falla en Vercel con `FUNCTION_INVOCATION_FAILED`.
Función de Vercel `GET /api/vimeo-poster?id=&h=&w=`: consulta oEmbed y responde 302 a `i.vimeocdn.com` en 640/1280/1920 px, con `s-maxage=3600, stale-while-revalidate=86400`. Valida id y hash y fija el host de destino. `vimeo-facade` pide el póster ahí (con `srcset`), crea el iframe solo al pulsar (o al nacer con `startLoaded`, que solo pone un clic en un cartel de `/video`) y usa `fallbackPoster` si falla. En `ng serve` no hay `/api`, así que en local se ven los pósters de respaldo; para probar la función, `npx vercel dev` o un preview de Vercel.

## Idioma
Textos de la interfaz y comentarios en español.
