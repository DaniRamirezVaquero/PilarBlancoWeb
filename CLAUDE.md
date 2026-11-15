# CLAUDE.md

Web de la actriz Pilar Blanco: Angular 20 + Tailwind/DaisyUI con prerender estático, desplegada en Vercel.

## Comandos
- `npm start` — servidor de desarrollo en http://localhost:4200 (no sirve `/api`)
- `npm run build` — build + prerender a `dist/pilar-blanco-web`
- `npm test -- --watch=false --browsers=ChromeHeadless` — Karma/Jasmine
- `npx tsc -p tsconfig.app.json --noEmit` — tipos

## Estética
Solo tokens DaisyUI (`--p`, `--s`, `--a`, `--n`, `--bc`), Lato + Playfair Display y los temas `mytheme` / `mytheme-portada`, que alternan con la portada del hero (`HeroThemeService` y el script de `index.html`). Sin colores hex nuevos. **Única excepción:** el negro de pantalla de cine del Reel, `--film-black` en `:root` de `styles.css` (bandas panorámicas, tira de película y la mezcla de la sala a oscuras). No lo uses para nada más.

**Nada que recuerde a una esquela** (lo pidió la actriz): ni retratos dentro de losas o marcos negros, ni rótulos centrados en mayúsculas espaciadas con un año sobre fondo oscuro.

## Home (`/home`)
Hero a pantalla completa y debajo un scroll de secciones con ancla: `#reel`, `#fotos`, `#voz`, `#trayectoria` y `#contacto`. La navegación es una barra superior fija (`app-site-nav`), sin menú lateral. Contiene el nombre, las anclas (`/home#voz`…), «CV» (`/curriculum`) y las redes en texto (Instagram · Vimeo · Email). Es transparente sobre el hero y pasa a cristal al dejarlo atrás y en las páginas internas. Por debajo de 1024 px, un botón «Menú» abre un panel a pantalla completa (diálogo con foco atrapado y Esc). En la home, las anclas son `<a href>` nativos que maneja `goTo()`: con `RouterLink` el router lanzaba un segundo scroll. La sección visible se marca con `NavService.activeSection` y `aria-current`. El footer se muestra en todas las rutas.

- `#reel`, «se apagan las luces»: la capa `.house-lights` (`--s` mezclado al 55 % con `--film-black`, L≈0.18–0.22, a 0.95) solo cambia de opacidad mientras `NavService.activeSection() === 'reel'`. Con movimiento reducido también se oscurece, pero sin transición. El rótulo va a la izquierda, alineado con la pantalla («REEL» en Playfair y el año en Lato fina). Las bandas negras van en el `padding` de `.reel-screen` (espacio siempre reservado) y «Más escenas» es `app-film-strip`, con los rótulos fuera del negro. El estado oculto previo a la entrada (`is-armed`) solo lo pone el JS en el navegador, sin movimiento reducido y sin hash de sección. La entrada (`is-shown`, una sola vez) la dispara un `IntersectionObserver` propio del reel (15 %) o el foco dentro de él; mientras tanto la tira es `inert`.
- `#fotos`: `app-contact-sheet`, hoja de papel claro (`--n`, tinta `--s`) con marcas de recorte en las esquinas y el borde de la película numerado por fila («▸ 1 ▸ 2 400TX ▸ 3…»). Es estática y sin nada interactivo. El carrusel solo vive en `/gallery`; las fotos están en `data/photos.data.ts` (`BOOK_PHOTOS`).
- `#voz`: banda de monitor `.voz-monitor` entre el título y las pistas, con `app-on-air-pilot`, el nombre de la demo y `app-on-air-wave` de la demo activa. Se alimenta desde `voice-strip` con `viewChild` + `computed`. No lleva onda de fondo.

## Botones
Un único estilo global, `.btn-line` en `styles.css`: borde fino, sin relleno, Lato en mayúsculas con tracking y relleno invertido al pasar el ratón. Sobre el papel blanco del CV se usa `.btn-line-paper`. Las descargas son `<a download>` con el icono de descarga y sin el peso del archivo. No uses `btn-accent` ni `btn-primary` de DaisyUI.

## Datos y utilidades
- `src/app/data/portfolio.data.ts`: `REEL`, `SCENES`, `DUBBING`, `VOICE` (con los `peaks` de cada MP3), `HIGHLIGHT_CREDITS`, `CONTACT`.
- `src/app/utils/vimeo-thumbnail.ts` (puro; `api/vimeo-poster.mjs` replica su validación porque no puede importarlo) y `src/app/utils/waveform.ts` (`resampleBars`, `layoutBars`), con sus `.spec.ts`.

## Locución (`voice-strip`)
Sustituye al antiguo cassette (ya no existe). La onda se dibuja a escala 1:1: el viewBox es el tamaño real de la pista en px, con barras de 2 px cada ~6 px y sin tope.

## En el aire (`components/on-air`)
Reutilizables para `/voice` (hito 3), sin nada propio de la home.
- `on-air-wave` (`peaks`, `progress`, `live`): onda a escala 1:1 con `layoutBars` (barras de 4 px cada ~12) que llena su contenedor; el contenedor decide tamaño y posición. Colores y máscara opcionales con `--air-rest-fill`, `--air-played-fill` y `--air-mask`. El avance anima solo `transform` con doble `translateX`. Al hidratar no oculta las barras del servidor; si nace en el navegador, aparece con un fundido tras la primera medida. Es `aria-hidden`.
- `on-air-pilot` (`live`): aro `bc` siempre visible que la luz de acento rellena; en reposo, la etiqueta queda a 0.6. El estado no depende del color del acento y también es `aria-hidden`.

## Carátulas de Vimeo (`api/vimeo-poster.mjs`)
La función es JavaScript ESM autocontenido (`.mjs`). El `package.json` no declara `"type": "module"`, así que una función `.ts` que importe de `src/` se carga como CommonJS y falla en Vercel con `FUNCTION_INVOCATION_FAILED`.
Función de Vercel `GET /api/vimeo-poster?id=&h=&w=`: consulta oEmbed y responde 302 a `i.vimeocdn.com` en 640/1280/1920 px, con `s-maxage=3600, stale-while-revalidate=86400`. Valida id y hash y fija el host de destino. `vimeo-facade` pide el póster ahí (con `srcset`), crea el iframe solo al pulsar y usa `fallbackPoster` si falla. En `ng serve` no hay `/api`, así que en local se ven los pósters de respaldo; para probar la función, `npx vercel dev` o un preview de Vercel.

## Idioma
Textos de la interfaz y comentarios en español.
