---
name: Pilar Blanco, actriz
description: Portfolio de actriz con una paleta única, verde salvia y cobalto, que prolonga la fotografía en lugar de competir con ella.
colors:
  primary-sage: "#80A59E"
  secondary-umber: "#4A4542"
  accent-cobalt: "#2f76ba"
  neutral-fog: "#E4E8EC"
  base-steel: "#4E565E"
  page-from-slate: "#A4ADB6"
  page-via-slate: "#727C88"
  page-to-slate: "#59646F"
  paper-white: "#ffffff"
  paper-zinc: "#d4d4d8"
  ink: "#171717"
  footer-ink: "#18181b"
typography:
  display:
    fontFamily: "Lato, sans-serif"
    fontSize: "6rem"
    fontWeight: 300
    lineHeight: 1.25
    letterSpacing: "0.025em"
  headline:
    fontFamily: "Playfair Display, serif"
    fontSize: "clamp(2rem, 4.2vw, 3.15rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Lato, sans-serif"
    fontSize: "clamp(1.05rem, 1.7vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.05em"
  body:
    fontFamily: "Lato, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Lato, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.33
    letterSpacing: "0.025em"
rounded:
  none: "0px"
  sm: "0.5rem"
  pill: "9999px"
spacing:
  gap-sm: "24px"
  gap-md: "32px"
  gap-lg: "40px"
  panel-sm: "32px"
  panel-md: "40px"
  panel-lg: "48px"
  page-y: "96px"
  page-y-lg: "144px"
components:
  button-download:
    backgroundColor: "{colors.accent-cobalt}"
    textColor: "{colors.paper-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-download-hover:
    backgroundColor: "{colors.accent-cobalt}"
  chip-label:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  panel-paper:
    backgroundColor: "{colors.paper-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-lg}"
  panel-accent:
    backgroundColor: "{colors.accent-cobalt}"
    textColor: "{colors.paper-white}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-lg}"
  panel-zinc:
    backgroundColor: "{colors.paper-zinc}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.panel-md}"
  social-circle:
    textColor: "{colors.paper-white}"
    rounded: "{rounded.pill}"
    size: "48px"
  footer:
    backgroundColor: "{colors.footer-ink}"
    textColor: "{colors.neutral-fog}"
    height: "128px"
---

# Design System: Pilar Blanco, actriz

## Overview

**Creative North Star: "El Dosier sobre Pizarra"**

La web de Pilar tiene una sola paleta y una sola portada. La paleta nace de esa fotografía: verde salvia de apoyo, un acento cobalto y un degradado de pizarras azuladas que hace de mesa para las páginas interiores. Sobre esa mesa se colocan las piezas del dosier (hojas de papel, vídeos, fotos) y la interfaz se aparta para que manden. Quien compara perfiles en una visita corta reconoce siempre la misma casa.

El resto del sistema se aparta para dejar mandar al material. Las páginas interiores son un fondo grisáceo en degradado sobre el que se apoyan «hojas» de papel blanco o zinc, de esquinas rectas, con sombra suave, como cartulinas de un dosier sobre una mesa. Los títulos son serif editorial (Playfair Display) con un guion corto de acento debajo; el cuerpo, Lato, claro y sin adornos. Lo más expresivo (cristal esmerilado, brillo del nombre que sigue al ratón, casete de voz) queda en el inicio, el menú y la sección de voz.

El carácter de los componentes es suave y cercano: botones en píldora, círculos de cristal para las redes, transiciones largas y amables. Aún no se ha confirmado ninguna anti-referencia visual.

**Key Characteristics:**
- Una sola paleta, expuesta como tokens del tema (`accent`, `primary`, `.bg-page`); los componentes no usan hexadecimales.
- Hojas de papel de esquinas rectas sobre un degradado gris azulado de página.
- Playfair Display solo para títulos de página y nombres grandes; Lato para todo lo demás.
- Movimiento de entrada escalonado (slide/fade-in-up) y transiciones de color largas (1,2 s).
- Cristal esmerilado reservado a superficies flotantes (menú lateral, redes, popover de correo).

## Colors

Una paleta fría y contenida, tomada de la portada, con un único acento: un color de apoyo claro (primary), uno oscuro (secondary), un acento que firma, un degradado de página y neutros azulados.

### Primary
- **Verde Salvia** (#80A59E): color de apoyo. Anillo y resplandor del botón de reproducir, hover de enlaces del menú, borde del pie.

### Secondary
- **Pardo Umbra** (#4A4542): tinta de apoyo profunda.

### Tertiary (acento)
- **Cobalto** (#2f76ba): línea bajo el nombre del inicio, guion de los títulos, botón de descarga, panel derecho de «Sobre mí», enlace activo del menú. Con texto blanco da unos 4,8:1 de contraste.

### Neutral
- **Niebla** (#E4E8EC): neutro del tema; fondo del menú en móvil.
- **Acero** (#4E565E): `base-100`, fondo base del tema.
- **Degradado de página**: de pizarra clara (#A4ADB6) a (#727C88) a (#59646F), en diagonal de abajo-izquierda a arriba-derecha.
- **Papel Blanco** (#ffffff) y **Papel Zinc** (#d4d4d8): hojas y paneles sobre el degradado; texto en **Tinta** (#171717).
- **Tinta de Pie** (#18181b): fondo del pie, con degradado hacia zinc-800.

### Named Rules
**The Single Key Rule.** Ningún componente nombra un color de tema por su hexadecimal: usa `accent`, `primary`, `info` o `.bg-page`. Así, retocar el acento es cambiar un solo valor. Los hex fijos (hoy, el casete de voz) son deuda, no precedente.

**The One Signature Rule.** El acento aparece una vez por zona: un subrayado, un botón o un panel, no varios a la vez.

## Typography

**Display Font:** Lato (con sans-serif)
**Headline Font:** Playfair Display (con serif)
**Body Font:** Lato (con sans-serif)

**Character:** Un serif editorial contenido para los títulos y un sans humanista cálido para leer; el contraste entre ambos da el aire de un dosier cuidado sin solemnidad.

### Hierarchy
- **Display** (Lato 300, 6rem en escritorio / 3.75rem en móvil, interlineado 1,25, tracking amplio): nombre «PILAR BLANCO» del inicio, siempre en blanco sobre foto.
- **Headline** (Playfair Display 500, clamp(2rem, 4.2vw, 3.15rem), 1,12, -0,025em): `.page-title`, título de cada página interior. En las hojas de «Sobre mí», «Pilar» y «Blanco» llegan a 4,5rem.
- **Title** (Lato 400, clamp(1.05rem, 1.7vw, 1.35rem), 0,05em): `.section-title`, apartados («Largometrajes», «Doblaje»); en mayúsculas dentro del CV.
- **Body** (Lato 400, 0.875rem móvil / 1rem escritorio, interlineado 1,625): texto corrido de bio y CV; sin límite de ancho fijado, la hoja lo acota.
- **Label** (Lato 700, 0.75rem, mayúsculas, 0,025em): chips de apartado del CV; en la cinta «ACTRIZ», Lato 600 en 1.25–1.5rem con tracking 0,3em.

### Named Rules
**The Serif Is Rare Rule.** Playfair solo en títulos de página y nombres de hoja; nunca en cuerpo, botones ni navegación.

## Layout

Cada página interior es un lienzo `.bg-page` de ancho completo con una columna de contenido a sangre variable: gutter lateral 32 → 64 → 128 → 256 px (por defecto, `sm`, `lg`, `xl`) y aire vertical de 96 px (144 px desde `lg`). Los bloques se separan 24–40 px.

El contenido son «artículos» de una sola hoja que se parten en rejilla desde `lg`: 2 columnas en «Sobre mí», 3 en el CV (retrato + datos / trayectoria a dos columnas). Las hojas llevan un relleno de 32 → 40 → 48 px. Vídeos y galería usan rejillas de 1 o 2 columnas con huecos amplios (hasta 80 px) para que cada pieza respire.

El inicio es una sola pantalla (`h-dvh`) con la fotografía de portada a sangre, el nombre y la línea de acento hacia el borde izquierdo y el botón de reproducir al pie. El menú es un cajón lateral de 460 px que empuja el contenido del inicio. La navegación es una sola capa, sin cabecera fija.

## Elevation & Depth

Híbrido: la profundidad de contenido es tonal y plana, con sombras casi ausentes; la de las superficies flotantes es de cristal.

Las hojas descansan con una sombra suave (`shadow-md`) sobre el degradado; las fotografías dentro de ellas llevan `shadow-sm`. El menú, los círculos de redes y el popover de correo usan cristal esmerilado. Sobre las portadas se aplica un velo `black/30 → transparente → black/20` para dar contraste al texto.

### Shadow Vocabulary
- **Hoja** (`box-shadow` de Tailwind `shadow-md`): artículos y vídeos sobre el degradado.
- **Foto en hoja** (`shadow-sm`): retratos e imágenes dentro de una hoja.
- **Cristal** (`background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37)`): menú lateral, círculos de redes, popover de correo.
- **Elevación al pasar** (`-translate-y-px` + `shadow-md`, brillo +10 %): botón de descarga.

### Named Rules
**The Glass Is Afloat Rule.** El cristal es solo para lo que flota sobre otra cosa; nunca una hoja de contenido.

## Shapes

Dos gramáticas conviven y no se mezclan: lo editorial es rectangular y lo interactivo es redondo.

Hojas, paneles, chips y fotos son rectos (radio 0), como papel cortado. Botones de acción y círculos de redes son píldoras o círculos completos (9999 px). Los botones DaisyUI de galería usan el radio por defecto del tema (0,5 rem). El único adorno de forma es el guion de 3 rem × 2 px bajo cada `page-title`, en el acento.

## Components

### Buttons
- **Shape:** píldora completa (9999 px).
- **Primary (descarga):** fondo de acento, texto blanco Lato 700 0,875rem, relleno 10 × 20 px, icono a la derecha.
- **Hover / Focus:** sube 1 px, sombra media, brillo +10 %; el icono baja 2 px. Foco visible con contorno blanco de 2 px, desplazado 2 px.
- **Galería (`btn-accent`):** botón DaisyUI relleno de acento, sin borde, texto blanco.

### Chips
- **Style:** fondo blanco, tinta oscura, esquinas rectas, Lato 700 mayúsculas 0,75rem, con sombra mínima.
- **State:** estático; son rótulos de apartado del CV (Medidas, Contacto, Formación, Idiomas).

### Cards / Containers
- **Corner Style:** recto.
- **Background:** papel blanco, papel zinc (#d4d4d8) o el acento (panel derecho de «Sobre mí»).
- **Shadow Strategy:** `shadow-md` en el artículo completo; las hojas internas no se sombrean por separado.
- **Border:** ninguno.
- **Internal Padding:** 32 / 40 / 48 px según ancho.

### Inputs / Fields
Hoy no hay formularios en el sitio. El único campo es la dirección copiable del popover de correo, dentro de cristal.

### Navigation
Botón de hamburguesa SVG animado (arriba a la izquierda) que abre un cajón de 460 px con cristal en escritorio y fondo opaco bruma en móvil. Enlaces en Lato 400, `text-xl → text-3xl`, tinta oscura; al pasar, color primary y 105 % de escala; el enlace activo va en acento, negrita, con una barra vertical a su izquierda. Lleva partículas decorativas muy tenues.

### Botón de reproducir (firma del inicio)
Anillo y símbolo de play SVG de 62 px en blanco, con un anillo `animate-ping` en primary y resplandor difuminado al pasar; el texto «Ver reel» aparece al lado. Flota en bucle de 3 s.

### Casete de voz (firma de la página de voz)
Casete dibujado en SVG, azul empolvado con franja naranja, que gira sus bobinas al reproducir; barra de progreso, controles fantasma y volumen. Es un objeto narrativo, no un patrón reutilizable, y hoy lleva sus colores en hexadecimal (ver The Single Key Rule).

### Redes y contacto
Círculos de 48 px de cristal con icono blanco que adopta un color propio al pasar (rosa en Instagram, `info` en Vimeo, acento en correo). El correo abre un popover de cristal con la dirección, botón de copiar y acción «Redactar en Gmail».

## Do's and Don'ts

### Do:
- **Do** colorear con tokens de tema (`bg-accent`, `text-primary`, `.bg-page`) para que un retoque de paleta llegue a todo el sitio.
- **Do** dejar que la fotografía lleve el peso del inicio: nombre en blanco, velo ligero, un solo acento.
- **Do** apoyar contenido sobre hojas rectas blancas o zinc con `shadow-md` encima del degradado de página.
- **Do** reservar Playfair Display (500) para `page-title` y nombres grandes, y rematar cada título con el guion corto de acento (3 rem × 2 px).
- **Do** usar píldoras o círculos para lo pulsable y esquinas rectas para lo editorial.
- **Do** mantener las transiciones de color en 1,2 s y respetar `prefers-reduced-motion` en nuevos movimientos.

### Don't:
- **Don't** escribir hexadecimales de color en componentes nuevos; el casete de voz es deuda existente.
- **Don't** usar cristal esmerilado en hojas de contenido ni apilar varios acentos en una misma zona.
- **Don't** redondear hojas, chips o fotos (radio > 0) ni usar esquinas rectas en botones.
- **Don't** introducir otras familias tipográficas distintas de Lato y Playfair Display.
