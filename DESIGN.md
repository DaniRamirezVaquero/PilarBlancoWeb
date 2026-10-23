---
name: Pilar Blanco, actriz
description: La web es la hoja de contactos de la que un director de casting elige; el fotograma elegido se rodea en rojo y se amplía.
colors:
  pencil: "#d42a1e"
  pencil-deep: "#ad1d13"
  edge: "#f0a13a"
  paper: "#fafaf8"
  print: "#ffffff"
  ink: "#171513"
  ink-soft: "#5a554f"
  rule: "#dcdad4"
  film: "#151312"
  film-soft: "#2b2725"
  sprocket: "#e9e6df"
typography:
  display:
    fontFamily: "Archivo Variable, Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(4.25rem, 2rem + 9.5vw, 9.5rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  headline:
    fontFamily: "Archivo Variable, Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 1.6rem + 6vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.86
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 62"
  title:
    fontFamily: "Archivo Variable, Archivo, Arial Narrow, sans-serif"
    fontSize: "clamp(1.5rem, 1.1rem + 1.4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.005em"
    fontVariation: "'wdth' 75"
  body:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  prose:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.95rem + 0.2vw, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.7
  role:
    fontFamily: "Archivo Variable, Archivo, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.8rem + 0.6vw, 1.35rem)"
    fontWeight: 600
    letterSpacing: "0.42em"
  button:
    fontFamily: "Archivo Variable, Archivo, Arial Narrow, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    letterSpacing: "0.08em"
    fontVariation: "'wdth' 80"
  label:
    fontFamily: "Martian Mono Variable, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.14em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 75"
  hand:
    fontFamily: "Caveat Brush, Segoe Print, cursive"
    fontWeight: 400
    lineHeight: 1
rounded:
  label: "2px"
  hole: "999px"
spacing:
  step: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  gutter: "clamp(1rem, 0.4rem + 3vw, 3.5rem)"
  perf: "0.875rem"
components:
  button-pencil:
    backgroundColor: "{colors.pencil}"
    textColor: "{colors.print}"
    typography: "{typography.button}"
    rounded: "{rounded.label}"
    padding: "0.7rem 1.35rem"
    height: "2.875rem"
  button-pencil-hover:
    backgroundColor: "{colors.pencil-deep}"
    textColor: "{colors.print}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.label}"
    padding: "0.7rem 1.35rem"
    height: "2.875rem"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0.4rem 0"
  icon-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.print}"
    rounded: "{rounded.hole}"
    size: "2.75rem"
  voice-play:
    backgroundColor: "{colors.print}"
    textColor: "{colors.ink}"
    rounded: "{rounded.hole}"
    size: "3.25rem"
  voice-play-active:
    backgroundColor: "{colors.pencil}"
    textColor: "{colors.print}"
  print:
    backgroundColor: "{colors.print}"
    padding: "clamp(0.5rem, 0.3rem + 0.6vw, 0.875rem)"
  film-strip:
    backgroundColor: "{colors.film}"
    textColor: "{colors.edge}"
    padding: "1.8375rem 0.65625rem"
---

# Design System: Pilar Blanco, actriz

## Overview

**Creative North Star: "La Hoja de Contactos"**

La web es la hoja de contactos de la que un director de casting elige. Cada mirada de Pilar es un fotograma impreso en una tira de negativo; el elegido se rodea con lápiz graso rojo y se amplía en una copia con margen blanco. Todo el sistema sale de ese objeto de laboratorio: papel fotográfico brillante como suelo, tiras casi negras con perforaciones crema, códigos de borde ámbar en monoespaciada condensada, y un solo rojo que marca la elección.

La densidad es la de una hoja de trabajo, no la de una revista: títulos condensados enormes frente a códigos de borde diminutos (el salto de escala es el gesto tipográfico central), retícula regida por un único paso de fotograma, y las fotos siempre rectas, sin radio, como copias reales. El manuscrito rojo existe pero es escaso: pocas palabras factuales, como el «esta» que señala el fotograma 02A en la apertura.

Todo el material fotográfico, de vídeo y de audio es el contenido elegido por la actriz; el sistema no añade imágenes propias. Se rechazan expresamente la portada a sangre con nombre fino, las secciones en tarjetas iguales, la plantilla con slider y las marcas de lápiz repartidas por todas partes.

**Key Characteristics:**
- Papel fotográfico blanco cálido como suelo; copias blancas con sombra suave; tiras de negativo como único plano oscuro.
- Un único rojo de lápiz, reservado a la elección activa y a la acción principal.
- Archivo Variable condensada (eje wdth) en mayúsculas para títulos; Martian Mono condensada para los códigos de borde.
- Etiquetas de corte recto; lo redondo pertenece al trazo de lápiz y a los agujeros/objetos.
- Interacción firma: lupa sobre los fotogramas, círculo rojo que se dibuja y ampliación en diálogo.

## Colors

Paleta de laboratorio fotográfico: neutros cálidos de papel y negativo, un ámbar que solo vive en la película y un rojo de lápiz graso que solo vive donde se elige.

### Primary
- **Rojo Lápiz Graso** (pencil): la elección activa y la acción principal. Anillo del fotograma elegido, subrayado de la navegación activa y al pasar, fondo del botón principal y óvalo de lápiz que lo rodea al señalarlo, porción ya reproducida de la onda de voz, botón de cerrar de los diálogos, selección de texto y anillo de foco.
- **Rojo Lápiz Hundido** (pencil-deep): estado hover del rojo y su versión de texto sobre papel (código del fotograma elegido en pies de foto, enlace al pasar, código de navegación activo), donde el rojo pleno no alcanzaría contraste suficiente a tamaño pequeño.

### Secondary
- **Ámbar de Borde** (edge): los códigos impresos en el margen de la película (números de fotograma, rótulos de las tiras, tiempos de voz) y la onda óptica de las tiras de voz al 55 % de opacidad. También el contorno de foco dentro de la película, donde el rojo se perdería. No sale de la película.

### Neutral
- **Papel Fotográfico** (paper): suelo de todas las páginas, barra superior y menú móvil.
- **Blanco de Copia** (print): margen de ampliación de cada foto, tarjetas emergentes y texto sobre rojo o película.
- **Tinta** (ink): texto, contorno del botón secundario, botón de menú redondo.
- **Tinta Suave** (ink-soft): textos secundarios, códigos de borde sobre papel, notas de crédito.
- **Filete** (rule): líneas divisorias de 1px (barra, listas de créditos, CV) y subrayado de enlace en reposo.
- **Negativo** (film): fondo de las tiras de película, telón de los diálogos (al 94-95 %), aro de la lupa.
- **Negativo Velado** (film-soft): relleno bajo las fotos mientras cargan; barra de desplazamiento.
- **Perforación** (sprocket): los agujeros de arrastre de las tiras, al 92 % de opacidad.

### Named Rules
**The One Red Rule.** El rojo marca solo la elección activa y la acción principal, una vez por zona: el anillo del fotograma, el subrayado de navegación, el óvalo del botón al pasar, la parte reproducida de la onda. Nunca decora rótulos, encabezados ni fondos.

**The Amber Stays On Film Rule.** El ámbar es tinta de película: aparece en tiras de negativo y en su lupa, nunca sobre papel.

## Typography

**Display Font:** Archivo Variable (con Archivo, Arial Narrow), autoalojada vía @fontsource, usando el eje de anchura.
**Body Font:** Archivo Variable (con Archivo, system-ui).
**Label/Mono Font:** Martian Mono Variable (con ui-monospace), también con eje de anchura.
**Hand Font:** Caveat Brush (con Segoe Print, cursive), siempre en rojo lápiz.

**Character:** Una sola familia que se estrecha hasta parecer rotulación de laboratorio en los títulos y se abre en el texto corrido; la monoespaciada condensada hace de tinta impresa en el margen de la película.

### Hierarchy
- **Display** (800, wdth 62, clamp(4.25rem → 9.5rem), 0.86, mayúsculas): el nombre «PILAR BLANCO» en blanco sobre la portada. Una sola vez.
- **Headline** (800, wdth 62, clamp(3rem → 6rem), 0.86, mayúsculas, text-wrap balance): título de cada página y de cada bloque del inicio (Reel 2026, Book, Voz, Trayectoria, Contacto). También el correo de contacto gigante en minúsculas y los enlaces del menú móvil.
- **Title** (700, wdth 75, clamp(1.5rem → 2.25rem), 1, mayúsculas): subtítulos del CV, etiquetas de las tiras de voz, títulos de crédito (variante a clamp(1.35rem → 1.85rem)).
- **Body** (400, 1rem, 1.6): texto general. La prosa de biografía sube a 1.7 y se limita a 66ch.
- **Role** (600, wdth 100, 0.42em de espaciado, mayúsculas): «ACTRIZ» bajo el nombre y en el CV.
- **Label / código de borde** (600, wdth 75, 0.6875rem, 0.14em, mayúsculas, cifras tabulares): números de fotograma, rótulos de tira, tiempos, direcciones de navegación.
- **Hand** (400, ~2.4rem, girado unos -8°): anotación manuscrita roja, pocas palabras factuales.

### Named Rules
**The Edge Code Rule.** Los códigos de fotograma (06A, 02A...) se imprimen solo donde la película los imprime: direcciones de navegación, márgenes de las tiras, pies de foto y pie de la ampliación. Nunca como antetítulo sobre un encabezado.

**The Scale Jump Rule.** La jerarquía se construye con saltos, no con pasos: código de borde de 11px junto a títulos de 6-9.5rem. No hay tamaños intermedios de relleno.

## Layout

Una sola retícula regida por el paso de fotograma (step, clamp(1rem → 2rem)): huecos, márgenes de cabecera de hoja (step × 1.5), secciones (step × 3.5 en vertical) y páginas (step × 2.5 arriba, step × 4 abajo) son múltiplos de él. El margen lateral es el gutter (clamp(1rem → 3.5rem)); el contenido se limita a 100rem centrados.

La barra superior es fija (4.25rem), sobre papel con filete inferior. En escritorio (≥1024px) la apertura ocupa el alto de la ventana menos la barra: ampliación de la portada a la izquierda y tira vertical de 4 fotogramas a la derecha (clamp(10rem, 13vw, 14rem)). Por debajo de 1024px la tira pasa a horizontal con perforaciones arriba y abajo y desplazamiento con snap; la navegación se pliega en un menú a pantalla completa de enlaces gigantes.

Las hojas de contactos de escritorio reparten los fotogramas en tantas columnas como fija cada tira; en móvil son carriles horizontales de min(62vw, 18rem). Créditos y CV usan columnas asimétricas (1.25fr / 1fr; 1fr / 2.4fr). Puntos de corte observados: 480, 640, 768 y 1024px.

## Elevation & Depth

La profundidad es física, no de interfaz: papel apoyado sobre papel. Las copias flotan con una sombra suave y desplazada hacia abajo, algunas ligeramente giradas (-1.5° a 1.25°) como si estuvieran sueltas sobre la mesa. La película no lleva sombra: es el plano oscuro de referencia. Los diálogos (ampliación, reel) oscurecen todo con un telón de negativo casi opaco.

### Shadow Vocabulary
- **Copia** (`box-shadow: 0 1px 1px rgb(23 21 19 / 0.06), 0 18px 40px -24px rgb(23 21 19 / 0.35)`): toda foto con margen blanco y las tarjetas emergentes.
- **Botón rojo** (`box-shadow: 0 10px 24px -14px rgb(173 29 19 / 0.9)`): solo la acción principal.
- **Lupa** (`box-shadow: 0 0 0 6px var(--film), 0 0 0 7px rgb(255 255 255 / 0.25), 0 22px 40px -10px rgb(0 0 0 / 0.55)`): el cuentahílos sobre el fotograma.

### Named Rules
**The Soft Print Rule.** Las sombras son blandas y difusas, como una copia sobre papel. Nada de sombras duras desplazadas.

## Shapes

Mundo de corte recto. Fotos y fotogramas sin radio, como copias guillotinadas. Botones como etiquetas de corte recto (2px). Lo redondo tiene dos dueños: el trazo de lápiz (anillo de elección, óvalo del botón principal, subrayados a mano alzada, todos SVG de trazo irregular con extremos redondeados) y los agujeros u objetos físicos (botones de icono, discos de reproducción, la lupa). Las perforaciones de la película son rectángulos repetidos. Las líneas son filetes de 1px o contornos de tinta de 1.5px.

### Named Rules
**The Square Label Rule.** Los botones son etiquetas de corte recto (2px); la redondez pertenece al trazo de lápiz que las marca. Lo circular queda reservado a agujeros y objetos: botones de icono, discos de reproducción, la lupa.

## Components

### Buttons
Etiquetas de laboratorio, firmes y recortadas, que el lápiz señala.
- **Shape:** corte recto (2px), alto mínimo 2.875rem.
- **Principal (btn-pencil):** fondo rojo lápiz, texto blanco en Archivo 700 condensada al 80 %, mayúsculas, espaciado 0.08em, relleno 0.7rem × 1.35rem, sombra roja difusa. Una por zona («Ver reel 2026», descargas).
- **Hover / Focus:** el fondo baja a rojo hundido y un óvalo de lápiz se dibuja alrededor de la etiqueta (clip-path de izquierda a derecha, 0.5s, ease-out). Foco: contorno rojo de 2px a 3px de distancia.
- **Secundario (btn-line):** transparente, contorno de tinta de 1.5px; al pasar, el lápiz lo subraya con un trazo rojo a mano alzada.
- **Botones de icono:** círculos de 2.75-3rem (menú en tinta, contacto con contorno, cerrar en rojo, controles de la ampliación con contorno blanco sobre negativo).

### Cards / Containers
- **Copia:** fondo blanco de copia, margen clamp(0.5rem → 0.875rem), sin radio, sombra Copia. Es el único contenedor de fotos sobre papel.
- **Tarjeta de contacto:** copia emergente de 19rem bajo el botón Contacto, con correo, botón de copiar circular y redes tras un filete.

### Navigation
- **Escritorio:** enlaces en Archivo 500, 0.9375rem, precedidos por su dirección de fotograma en código de borde (tinta suave). Al pasar y en la ruta activa, un subrayado rojo a mano alzada se dibuja de izquierda a derecha (0.45s); el código activo pasa a rojo hundido. A la derecha, enlace CV con icono de descarga y botón Contacto con contorno.
- **Móvil (<1024px):** botón redondo de tinta que abre una hoja a pantalla completa sobre papel con enlaces en headline gigante (clamp(2.5rem, 12vw, 4rem)) separados por filetes; el activo en rojo hundido.
- **Enlaces de texto:** subrayado de filete de 1.5px que pasa a rojo al pasar, con el texto a rojo hundido. El correo gigante de contacto se subraya en rojo de izquierda a derecha.

### Tira de negativo (signature)
Fondo negativo con perforaciones crema arriba y abajo (horizontal) o a los lados (vertical), paso de perforación 0.875rem. Cada fotograma lleva debajo su código de borde ámbar y su pie. Cada foto se encuadra en su fotograma con object-fit: cover y su propio encuadre (`position` en los datos: la portada apaisada se centra en Pilar, las fotos del book conservan la cabeza). Con ratón, una lupa circular de 11.5rem sigue al cursor y amplía el fotograma reproduciendo ese mismo recorte, sin deformar la foto; al hacer clic, el anillo rojo (un solo trazo que se pasa de su inicio, ceñido a la foto sin tapar el código de borde) se dibuja sobre él y se abre la ampliación: diálogo a pantalla completa con la copia que «revela» (de sobreexpuesta a normal en 0.55s), pie con código en rojo y contador, y controles circulares. En pantallas táctiles no hay lupa; el toque abre la ampliación.

### Anillo de lápiz (signature)
Círculo rojo de dos pasadas irregulares (5.5 y 3.5 de trazo) que se dibuja con stroke-dashoffset en 0.9s más una segunda pasada de 0.35s. Es la única marca roja activa de su zona.

### Tira de voz (signature)
Cada demo de voz es una tira de negativo cuya banda sonora óptica es la onda real del MP3 (picos medidos de los archivos), en barras ámbar al 55 %; la parte reproducida se pinta en rojo lápiz y la pista es clicable para buscar. Disco de reproducción blanco de 3.25rem que pasa a rojo al estar activo; código ámbar, etiqueta en title blanco y tiempo en blanco al 62 %.

### Apertura (signature)
Secuencia única del inicio: la portada se «revela» (1.6s, de lavada a normal), el nombre y la acción suben escalonados (0.25-0.55s), la tira entra fotograma a fotograma (0.12s de escalón) y termina con el anillo rojo cayendo sobre el fotograma 02A y la anotación «esta» a mano. Con movimiento reducido todo queda en su estado final.

### Vídeo
Fachada de Vimeo: miniatura con botón de reproducir que solo carga el reproductor al pulsar; el reel se abre en un diálogo a pantalla completa sobre telón de negativo.

## Do's and Don'ts

### Do:
- **Do** reservar el rojo lápiz para la elección activa y la acción principal, una vez por zona (The One Red Rule).
- **Do** presentar cada foto sobre papel como copia: margen blanco, sin radio, sombra Copia.
- **Do** imprimir los códigos de fotograma solo donde la película los imprime: navegación, márgenes de tira, pies de foto y la ampliación.
- **Do** construir la jerarquía con saltos de escala: headline condensado enorme frente a código de borde de 0.6875rem.
- **Do** medir huecos y márgenes en múltiplos del paso de fotograma (step) y del gutter.
- **Do** usar solo el contenido elegido por la actriz; el sistema no aporta imágenes, vídeos ni audio propios.
- **Do** dejar que la lupa sea solo de ratón y que el toque abra directamente la ampliación.
- **Do** componer el nombre de Pilar con la tipografía de la portada (Archivo condensada, con un único subrayado de lápiz en el membrete del CV), nunca con un logotipo en imagen.

### Don't:
- **Don't** poner un código de fotograma, rótulo o etiqueta en código de borde como antetítulo sobre un encabezado.
- **Don't** usar el rojo para decorar rótulos, encabezados de sección o fondos de zona.
- **Don't** redondear botones o fotos; lo redondo es solo del trazo de lápiz, los agujeros y los objetos (icono, disco, lupa).
- **Don't** repartir marcas de lápiz o manuscrito por todas partes; el manuscrito son pocas palabras factuales.
- **Don't** sacar el ámbar de la película.
- **Don't** usar sombras duras desplazadas ni tarjetas iguales en rejilla.
- **Don't** abrir con la portada a sangre y el nombre en un trazo fino, ni con un slider.
