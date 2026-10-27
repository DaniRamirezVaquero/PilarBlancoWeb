---
name: Pilar Blanco, actriz
description: Retrato de estudio sereno sobre marfil: Bodoni Moda y Lato, planos marino para el Reel y la Voz, terracota solo para la acción.
colors:
  accent: "#c4572a"
  accent-deep: "#a2441d"
  ground: "#f3eee5"
  surface: "#f3eee5"
  surface-2: "#e9e2d5"
  ink: "#111c33"
  ink-soft: "#4a5267"
  rule: "rgb(17 28 51 / 0.14)"
  navy: "#111c33"
  navy-soft: "#1d2a47"
  on-navy: "#e6e0d4"
typography:
  display:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "clamp(3.25rem, 1.4rem + 4.6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "clamp(3rem, 1.6rem + 4.6vw, 6.25rem)"
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "clamp(1.4rem, 1.1rem + 0.9vw, 1.9rem)"
    fontWeight: 400
    fontStyle: italic
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  credit:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "clamp(1.3rem, 1rem + 0.9vw, 1.7rem)"
    fontWeight: 400
    lineHeight: 1.15
  voice-label:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "1.65rem"
    fontWeight: 400
    lineHeight: 1.1
  role:
    fontFamily: "Bodoni Moda Variable, Bodoni Moda, Georgia, serif"
    fontSize: "clamp(1.25rem, 1rem + 0.6vw, 1.6rem)"
    fontWeight: 400
    fontStyle: italic
  body:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.7
  button:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.02em"
  note:
    fontFamily: "Lato, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.3
    fontFeature: "'tnum' 1"
rounded:
  none: "0"
  round: "999px"
spacing:
  step: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  gutter: "clamp(1rem, 0.4rem + 3vw, 3.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.6rem"
    height: "3.1rem"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "#ffffff"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.7rem 1.35rem"
    height: "2.875rem"
  button-line-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.4rem 0"
  icon-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.round}"
    size: "2.75rem"
  voice-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "1rem 1.25rem"
  voice-row-alt:
    backgroundColor: "{colors.surface-2}"
  voice-play:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.surface}"
    rounded: "{rounded.round}"
    size: "3.25rem"
  voice-play-active:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
  frame-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.on-navy}"
    padding: "0.75rem"
---

# Design System: Pilar Blanco, actriz

## Overview

**Creative North Star: "El estudio sereno"**

La web es un retrato de estudio: una actriz sobre una pared gris vacía, con luz de revista de cine. El sistema se limita a enmarcar ese retrato. Suelo marfil cálido, tinta marino profunda, dos planos marino a sangre (Reel y Voz) donde el contenido audiovisual «se enciende», y un único terracota —el de su pantalón en la portada— que solo aparece cuando hay que actuar o se está escuchando algo.

La tipografía es la voz editorial: Bodoni Moda, de alto contraste, para el nombre y todos los títulos, a tamaños grandes y en peso 400, con Lato para lo funcional. Las fotos son siempre rectas, limpias, sin margen ni sombra; el marco marino que las agrupa es liso. La maquetación es la de la versión anterior de la web (hoja de contactos): orden de secciones, rejillas, navegación, lupa, pistas de voz en líneas separadas y transiciones entre páginas no cambian; solo el color, la tipografía y los acabados.

Todo el material fotográfico, de vídeo y de audio es el elegido por la actriz; el sistema no añade imágenes propias. Se rechazan la portada con nombre fino, las secciones en tarjetas iguales, los sliders de plantilla y la decoración repartida por todas partes.

**Key Characteristics:**
- Suelo marfil; planos marino a ancho completo para Reel y Voz; marcos marino lisos alrededor de fotos y vídeos.
- Un único terracota, reservado a la acción principal, la pista activa, la parte reproducida de la onda, la selección y el foco.
- Bodoni Moda (peso 400, sin mayúsculas forzadas) para títulos; Lato para texto, botones y notas.
- Esquinas rectas en botones y fotos; lo redondo es solo el disco de reproducción y los botones de icono.
- Interacción firma: lupa sobre las fotos y ampliación en diálogo con fundido suave.

## Colors

Marfil cálido y tinta marino, con una sola nota cálida de acción.

### Primary
- **Terracota** (#c4572a): botón principal, disco de la pista activa, parte reproducida de la onda, selección de texto, anillo de foco y subrayado de la navegación activa o al pasar. Hover: **Terracota profundo** (#a2441d).

### Neutral
- **Marfil** (#f3eee5): suelo de la página, barra superior, menú móvil y filas claras de voz.
- **Marfil 2** (#e9e2d5): segundo tono para filas pares de voz.
- **Tinta marino** (#111c33): texto, contornos de botón, y fondo de los planos y marcos marino.
- **Marino suave** (#1d2a47): fondos de carga de fotos y color de la barra de desplazamiento.
- **Tinta suave** (#4a5267): texto secundario.
- **Filete** (rgb(17 28 51 / 0.14)): líneas divisorias de créditos y CV.
- **Sobre marino** (#e6e0d4): texto dentro de marino.

### Named Rules
**La regla del terracota único.** El terracota nunca decora: si algo es terracota, se puede pulsar, suena o tiene el foco.

**La regla del marino.** El marino es contenedor, no tinte: planos a sangre para Reel y Voz y marcos lisos alrededor de fotos y vídeos. Nunca se mezcla con degradados.

## Typography

**Display y títulos:** Bodoni Moda Variable (ejes opsz y wght; con cursiva), con Georgia de reserva.
**Texto, botones y notas:** Lato (400 y 700).

### Hierarchy
- **Display** (400, clamp(3.25rem → 6rem), interlínea 0.95, tracking -0.015em): el nombre de la portada, en blanco sobre la foto.
- **Headline** (400, clamp(3rem → 6.25rem), interlínea 0.98, tracking -0.025em): título de cada página y sección (`.sheet-title`).
- **Title** (cursiva 400, clamp(1.4rem → 1.9rem), interlínea 1.15): subtítulos (`.sub-title`).
- **Crédito** (400, clamp(1.3rem → 1.7rem)): títulos de la trayectoria; etiqueta de voz a 1.65rem; correo de contacto a gran tamaño; enlaces del menú móvil en clamp(2rem → 2.75rem).
- **Rol** (cursiva 400, clamp(1.25rem → 1.6rem)): «Actriz» en portada y CV.
- **Body / prose** (Lato 400, 1rem y hasta 1.0625rem, interlínea 1.6 y 1.7, máximo 66ch).
- **Botón** (Lato 700, 0.9375rem, tracking 0.02em, sin mayúsculas).
- **Nota** (Lato 400, 0.8125rem, interlínea 1.3, cifras tabulares): pies de foto, títulos de proyecto, etiquetas, tiempo de las pistas.

### Named Rules
**La regla del peso único.** Los títulos van en 400, sin text-transform ni stretch; el contraste lo da la propia Bodoni y el salto de escala.

## Layout

Una sola retícula regida por el paso (`--step`, clamp(1rem → 2rem)): huecos, márgenes de cabecera de hoja (step × 1.5), secciones (step × 3.5 en vertical) y páginas (step × 2.5 arriba, step × 4 abajo) son múltiplos de él. El margen lateral es el gutter (clamp(1rem → 3.5rem)); el contenido se limita a 100rem centrados.

La barra superior es fija (4.25rem), sobre marfil y sin filete. En escritorio (≥1024px) la apertura ocupa el alto de la ventana menos la barra: retrato a la izquierda y columna vertical de 4 fotos a la derecha (clamp(10rem, 13vw, 14rem)) con marco de 4px y 4px entre fotos. Por debajo de 1024px la columna pasa a carril horizontal con desplazamiento y snap; la navegación se pliega en un menú a pantalla completa de enlaces grandes.

Las hojas de fotos de escritorio reparten las fotos en tantas columnas como fija cada tira; en móvil son carriles horizontales de min(62vw, 18rem). Créditos y CV usan columnas asimétricas (1.25fr / 1fr; 1fr / 2.4fr). Los bloques Reel y Voz de la home son planos marino a ancho completo. Puntos de corte observados: 480, 640, 768 y 1024px.

## Elevation & Depth

La profundidad viene del color, no de las sombras: marfil, marino y filetes. Las fotos no llevan sombra ni margen.

### Shadow Vocabulary
- **Lupa** (`0 0 0 1.5px rgb(243 238 229 / 0.85), 0 22px 44px -18px rgb(14 24 41 / 0.55)`): aro marfil fino y sombra amplia; es un objeto flotante sobre las fotos.
- **Tarjeta de contacto** (`0 18px 40px -20px rgb(17 28 51 / 0.35)`): el menú de contacto es un popover y se despega del fondo.

### Named Rules
**La regla plana.** Nada más lleva sombra: ni botones, ni fotos, ni el disco de reproducción.

## Shapes

Botones y fotos rectos (radio 0). Lo redondo se reserva a los discos de reproducción, los botones de icono (menú, contacto, copiar, controles de la ampliación) y la lupa.

### Named Rules
**La regla recta.** Ninguna foto se rota ni se redondea.

## Components

### Buttons
- **Primario** (`.btn-primary`): bloque terracota, texto blanco, Lato 700, padding 0.7rem 1.6rem, alto mínimo 3.1rem; hover a terracota profundo.
- **Secundario** (`.btn-line`): contorno de tinta de 1.5px, transparente; al pasar se rellena de marino con texto marfil. Sobre el plano marino del Reel se invierte (contorno y texto marfil).
- **Enlace** (`.link-quiet`): subrayado fino de tinta al 40%; hover en terracota profundo.

### Cards / Containers
- **Foto** (`.print`): foto limpia, sin margen ni sombra.
- **Marco marino** (`.frame-navy`): fondo marino, 0.75rem de relleno, liso. En la columna de la portada, 4px; alrededor del vídeo del Reel, 0.
- **Tarjeta de contacto**: marfil con sombra de popover.

### Navigation
Barra con nombre en Bodoni 1.6rem y «Actriz» como nota; enlaces en Lato 0.9375rem con subrayado recto de 1.5px en terracota que se revela de izquierda a derecha al pasar y en la página activa. Botón CV y menú de contacto como `.btn-line`. En móvil, botón redondo marino que abre un menú con enlaces en Bodoni (activo en terracota profundo).

### Lupa (signature)
Círculo de 11.5rem que sigue al ratón sobre las fotos y las amplía ×2.6 con su recorte real. Solo con puntero; en táctil, un toque abre la ampliación.

### Ampliación
Diálogo con fondo marino al 94%, foto con fundido suave de opacidad y escala, pie con el título (o «Pilar Blanco») y el contador, controles redondos con cierre en terracota.

### Tira de voz (signature)
Líneas separadas con 6px de hueco, filas marfil alternadas con marfil 2. Disco marino con icono marfil (terracota con icono blanco en la pista activa), etiqueta en Bodoni 1.65rem, tiempo en Lato con cifras tabulares y onda en tinta al 78% cuya parte reproducida es terracota. Se reutiliza en /voice sobre suelo marfil.

### Apertura (signature)
Retrato de estudio (fondo2) con el nombre en Bodoni blanco, «Actriz» en cursiva y el botón primario; fundido desde el gris al cargar, subida escalonada de nombre, rol y botón, y entrada escalonada de la columna de fotos.

### Vídeo
Carátula con disco terracota redondo sin sombra y rótulo «Reproducir» como nota; marco marino liso.

## Do's and Don'ts

### Do:
- **Do** usar terracota solo en acciones, pista activa, onda reproducida, selección y foco.
- **Do** mantener los títulos en Bodoni peso 400 y las notas en Lato 400.
- **Do** dejar las fotos limpias y rectas, con el título del proyecto como pie cuando exista.
- **Do** usar el marino como plano a sangre (Reel y Voz) o como marco liso.
- **Do** conservar la maqueta, la lupa, las pistas de voz en líneas separadas y las transiciones entre páginas.

### Don't:
- **Don't** decorar con terracota ni añadir un segundo color de acento.
- **Don't** poner sombras, márgenes blancos, rotaciones ni radios en las fotos.
- **Don't** forzar mayúsculas ni anchos condensados en los títulos.
- **Don't** añadir marcas, códigos o rótulos de laboratorio sobre las fotos.
- **Don't** mover, añadir o quitar secciones sin que lo pida la actriz.
