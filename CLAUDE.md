# CLAUDE.md

Web de la actriz Pilar Blanco: Angular 20 + Tailwind/DaisyUI con prerender estático, desplegada en Vercel.

## Comandos
- `npm start` — servidor de desarrollo en http://localhost:4200 (no sirve `/api`)
- `npm run build` — build + prerender a `dist/pilar-blanco-web`
- `npm test -- --watch=false --browsers=ChromeHeadless` — Karma/Jasmine
- `npx tsc -p tsconfig.app.json --noEmit` — tipos

## Estética
Solo tokens DaisyUI (`--p`, `--s`, `--a`, `--n`, `--bc`), Lato + Playfair Display y los temas `mytheme` / `mytheme-portada`, que alternan con la portada del hero (`HeroThemeService` y el script de `index.html`). Sin colores hex nuevos.

## Home (`/home`)
Hero a pantalla completa y debajo un scroll de secciones con ancla: `#reel`, `#fotos` (carrusel), `#voz`, `#trayectoria` y `#contacto`. La navegación es una barra superior fija (`app-site-nav`), sin menú lateral. Contiene el nombre, las anclas (`/home#voz`…), «CV» (`/curriculum`) y las redes en texto (Instagram · Vimeo · Email). Es transparente sobre el hero y pasa a cristal al dejarlo atrás y en las páginas internas. Por debajo de 1024 px, un botón «Menú» abre un panel a pantalla completa (diálogo con foco atrapado y Esc). En la home, las anclas son `<a href>` nativos que maneja `goTo()`: con `RouterLink` el router lanzaba un segundo scroll. La sección visible se marca con `NavService.activeSection` y `aria-current`. El footer se muestra en todas las rutas.

## Botones
Un único estilo global, `.btn-line` en `styles.css`: borde fino, sin relleno, Lato en mayúsculas con tracking y relleno invertido al pasar el ratón. Sobre el papel blanco del CV se usa `.btn-line-paper`. Las descargas son `<a download>` con el formato y el peso visibles. No uses `btn-accent` ni `btn-primary` de DaisyUI.

## Datos y utilidades
- `src/app/data/portfolio.data.ts`: `REEL`, `SCENES`, `DUBBING`, `VOICE` (con los `peaks` de cada MP3), `HIGHLIGHT_CREDITS`, `CONTACT`.
- `src/app/utils/vimeo-thumbnail.ts` (puro; `api/vimeo-poster.mjs` replica su validación porque no puede importarlo) y `src/app/utils/waveform.ts` (`resampleBars`), con sus `.spec.ts`.

## Locución (`voice-strip`)
Sustituye al antiguo cassette (ya no existe). La onda se dibuja a escala 1:1: el viewBox es el tamaño real de la pista en px, con barras de 2 px cada ~6 px y sin tope.

## Carátulas de Vimeo (`api/vimeo-poster.mjs`)
La función es JavaScript ESM autocontenido (`.mjs`). El `package.json` no declara `"type": "module"`, así que una función `.ts` que importe de `src/` se carga como CommonJS y falla en Vercel con `FUNCTION_INVOCATION_FAILED`.
Función de Vercel `GET /api/vimeo-poster?id=&h=&w=`: consulta oEmbed y responde 302 a `i.vimeocdn.com` en 640/1280/1920 px, con `s-maxage=3600, stale-while-revalidate=86400`. Valida id y hash y fija el host de destino. `vimeo-facade` pide el póster ahí (con `srcset`), crea el iframe solo al pulsar y usa `fallbackPoster` si falla. En `ng serve` no hay `/api`, así que en local se ven los pósters de respaldo; para probar la función, `npx vercel dev` o un preview de Vercel.

## Idioma
Textos de la interfaz y comentarios en español.
