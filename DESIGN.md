---
name: Pilar Blanco, actriz
description: La web es la sesión de estudio de su foto de fondo continuo; Pilar posa sobre el gris y sus materiales se cuelgan con la misma luz.
colors:
  studio-lit: "#b9bbbd"
  studio: "#a4a6a9"
  studio-deep: "#8a8c90"
  shade: "#2b2c2e"
  shade-deep: "#17181a"
  ink: "#141517"
  ink-soft: "#26282c"
  platinum: "#ece8e2"
  platinum-soft: "#b5b2ad"
  silk: "#0b0c0d"
  peacock: "#173646"
  cuff: "#9fb6c4"
  damask: "#2f6a8e"
  orange: "#d2683f"
  orange-lit: "#e07c52"
  orange-deep: "#a5462a"
  rule: "rgb(20 21 23 / 0.16)"
  rule-shade: "rgb(236 232 226 / 0.16)"
typography:
  display:
    fontFamily: "Spectral, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(3.5rem, 2.2rem + 5.2vw, 6rem)"
    fontWeight: 200
    lineHeight: 0.95
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Spectral, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.75rem, 1.7rem + 3.6vw, 5.25rem)"
    fontWeight: 200
    lineHeight: 1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Spectral, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.5rem, 1.2rem + 0.9vw, 2rem)"
    fontWeight: 300
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  prose:
    fontFamily: "Spectral, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "'Jost Variable', Jost, Futura, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Jost Variable', Jost, Futura, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.22em"
    fontFeature: "tnum"
  button:
    fontFamily: "'Jost Variable', Jost, Futura, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.2em"
rounded:
  none: "0"
  disc: "999px"
spacing:
  step: "clamp(1rem, 0.6rem + 1.6vw, 2rem)"
  gutter: "clamp(1.25rem, 0.4rem + 3.6vw, 4.5rem)"
  section: "calc(var(--step) * 4.5)"
components:
  button-main:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.6rem"
    height: "3rem"
  button-main-hover:
    backgroundColor: "{colors.orange-lit}"
  button-quiet:
    backgroundColor: "transparent"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.6rem"
    height: "3rem"
  button-ink:
    backgroundColor: "{colors.silk}"
    textColor: "{colors.platinum}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "0.85rem 1.6rem"
    height: "3rem"
  button-ink-hover:
    backgroundColor: "{colors.peacock}"
  button-disc:
    backgroundColor: "transparent"
    textColor: "{colors.platinum}"
    rounded: "{rounded.disc}"
    size: "3rem"
  play-disc:
    backgroundColor: "{colors.orange}"
    textColor: "{colors.ink}"
    rounded: "{rounded.disc}"
    size: "4rem"
  site-bar:
    backgroundColor: "{colors.shade-deep}"
    textColor: "{colors.platinum}"
    height: "4.25rem"
  contact-card:
    backgroundColor: "{colors.studio-lit}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1.25rem"
    width: "20rem"
---

# Design System: Pilar Blanco, actriz

## Overview

**Creative North Star: "Fondo continuo"**

Todo el sistema sale de una sola foto: Pilar en un estudio de fondo continuo gris, con camisa de seda negra con damasco azul pavo real y pantalón naranja (`src/assets/images/hero/fondo2-*.webp`). La web es esa sesión. El gris del papel es el suelo de cada página, iluminado por una luz principal que entra desde arriba a la izquierda y cae hacia la esquina; el negro de seda y el pavo real dan profundidad y subrayan los enlaces; el platino del pelo es el texto sobre la sombra; el naranja del pantalón es la única voz de acción.

El mundo tiene dos suelos del mismo papel: la zona a la luz, para leer (book, trayectoria, biografía, CV, fotos), y la sombra grafito, para mirar y escuchar (barra, portada, reel, vídeo, voz, pie). Los materiales se cuelgan sobre ese papel como copias sin marco, con la sombra blanda de un estudio. La tipografía es elegante y ligera: un serif de alto contraste en su peso más fino para el nombre y los títulos, y un palo seco geométrico espaciado en versalitas para la interfaz. Se rechaza lo que pidió dejar atrás la actriz: el palo seco condensado y pesado, la portada oscura con el nombre gritado, la rejilla de tarjetas.

La densidad es de dosier: secciones amplias, una idea por bloque, filetes de 1px como única estructura. El movimiento firma es la exposición: la foto «se enciende» desde la sombra al cargar y cada copia elegida llega a la luz.

**Key Characteristics:**
- Dos suelos del mismo papel continuo (a la luz y en sombra), con degradado radial desde arriba a la izquierda y grano fino.
- Un único naranja: botón principal, un solo campo entero (Contacto de la portada) y los indicadores de elección.
- Spectral 200/300 para nombre y títulos; Jost Variable espaciado en versalitas para la interfaz.
- Copias sin marco ni radio, con sombra blanda de estudio; filetes de 1px.
- Botones de corte recto; el círculo solo para botones de icono y discos de reproducción.
- Motivo de luz: lo no elegido espera en la sombra (atenuado), lo elegido se expone.

## Colors

Grises neutros algo fríos muestreados del papel de la foto, tinta casi negra, el platino del pelo, el azul del damasco y un solo naranja cálido.

### Primary
- **Naranja del pantalón** (orange): la acción principal de cada pantalla (`Ver reel 2026`, `Descargar CV`, `Descargar las fotos` en /gallery), el campo entero del Contacto en la portada, el disco de reproducción del vídeo, el disco de voz activo, la parte reproducida de la onda, el filete de 2px bajo la copia elegida y el filete de la navegación activa. También es el `accent-color`, la selección de texto y el anillo de foco. Siempre lleva tinta encima, nunca blanco.
- **Naranja a la luz** (orange-lit): el hover del botón principal y el enlace activo del menú móvil sobre sombra.
- **Naranja en sombra** (orange-deep): solo como tinte de la sombra caída del botón principal.

### Secondary
- **Pavo real del damasco** (peacock): color del enlace al pasar sobre el papel claro y hover del botón de seda.
- **Brillo del damasco** (damask, #2f6a8e): el azul que se ve en el estampado de la camisa; subrayado de 1.5px de los enlaces en reposo sobre el papel claro.
- **Puño** (cuff): el pavo real aclarado para la sombra; subraya los enlaces sobre grafito y colorea el hover de los nombres de escena.

### Neutral
- **Papel a la luz** (studio-lit): el centro iluminado del suelo claro y la tarjeta de contacto, que es el gris más claro del estudio.
- **Papel** (studio): fondo base de `html` y `body`; tono medio del degradado claro.
- **Papel hacia la esquina** (studio-deep): borde del degradado claro y fondo de la foto antes de cargar.
- **Grafito** (shade): suelo de sombra, fondo de las copias mientras cargan y continuación lisa de la foto de portada en móvil.
- **Grafito hondo** (shade-deep): barra del sitio, pie y borde del degradado de sombra.
- **Tinta** (ink) y **tinta suave** (ink-soft): texto y texto secundario sobre el papel claro y sobre el naranja.
- **Platino** (platinum) y **platino suave** (platinum-soft): texto y texto secundario sobre la sombra. En `ground-shade`, `ink-soft` se reasigna a platino suave.
- **Seda** (silk): fondo del botón sobre naranja y del marco de vídeo.
- **Filete** (rule / rule-shade): las líneas de 1px de listas, créditos y barra; `ground-shade` reasigna `rule` a la versión clara.

### Named Rules
**La regla del pantalón.** El naranja es la acción principal y nada más: un botón principal por bloque, y un único campo entero en todo el sitio (Contacto de la portada). Sus otros usos son indicadores de estado (elegido, activo, reproducido, foco), nunca decoración.

**La regla de la tinta sobre naranja.** Sobre el naranja el texto es tinta y el botón es de seda negra (`btn-ink`); nunca un segundo botón naranja ni texto blanco.

**La regla del damasco.** Los enlaces en reposo se subrayan con el brillo del damasco sobre la luz y en puño sobre la sombra; al pasar, el texto toma ese color y el filete pasa a `currentColor`.

## Typography

**Display Font:** Spectral (con 'Iowan Old Style', Georgia, serif), pesos 200/300/400/500 y cursivas 300/400 vía @fontsource.
**Body Font:** Jost Variable (con Jost, Futura, system-ui, sans-serif).

**Character:** Un serif de alto contraste en su peso más fino, que habla con voz baja y segura, contra un palo seco geométrico espaciado que hace de rótulo de estudio. El serif lleva el nombre, los títulos, los créditos y la prosa larga; Jost lleva todo lo que es interfaz.

### Hierarchy
- **Display** (Spectral 200, `clamp(3.5rem, 2.2rem + 5.2vw, 6rem)`, 0.95): solo el nombre de la portada; en escritorio, en dos líneas con «Blanco» sangrado 0.55em. El membrete del CV y el correo del Contacto usan la misma voz a su escala.
- **Headline** (Spectral 200, `clamp(2.75rem, 1.7rem + 3.6vw, 5.25rem)`, 1, `text-wrap: balance`): el título de cada sección y de cada página (`title-xl`).
- **Title** (Spectral 300, `clamp(1.5rem, 1.2rem + 0.9vw, 2rem)`, 1.15): subtítulos dentro de página (`sub-title`); los títulos de crédito, nombres de demo y nombres de escena usan Spectral 300 a su tamaño.
- **Prose** (Spectral 400, `clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)`, 1.7, máx. 64ch): biografía y textos largos.
- **Body** (Jost 400, 1rem, 1.6): texto de interfaz, datos del CV, notas.
- **Label** (Jost 500, 0.75rem, 0.22em, versalitas, cifras tabulares): oficio bajo el nombre, pies de foto, contadores, categorías de crédito, navegación.
- **Cursiva** (Spectral 300 italic, 1.125rem): la línea de oficios bajo el nombre de la portada.

### Named Rules
**La regla del peso fino.** El nombre y los títulos van en Spectral 200; nada pesado ni condensado. Si un titular necesita más presencia, crece en tamaño, no en peso.

**La regla sin antetítulo.** Ningún rótulo en versalitas encima de un titular. Los títulos de sección y de página están solos en su `head`; el rótulo de Jost va debajo (oficio bajo el nombre) o al lado, como dato.

## Layout

Contenedor único de hasta 100rem centrado, con márgenes laterales fluidos (`gutter`) y un ritmo vertical basado en `step`: secciones de 4.5 pasos arriba y abajo, cabeceras con 1.75 pasos de aire. Las páginas propias (`page`) abren con 3 pasos y cierran con 4.5. Cabecera de sección: título solo (`head`) o título con una acción o una pista alineada a la base (`head-row`).

Puntos de corte observados: 640px (créditos a dos columnas), 768px (onda de voz en línea, pie a tres columnas), 1024px (escritorio: barra con navegación, portada a sangre, sesión del book a dos columnas, trayectoria con columna de sobre mí, CV con columna lateral).

La portada en escritorio pone la foto a sangre a altura de pantalla menos la barra y el nombre a la izquierda, en el aire gris; en móvil la foto ocupa 66svh, se funde a grafito y el nombre baja a la sombra que la continúa. La portada alterna suelos: sombra (portada, reel), luz (book), sombra (voz), luz (trayectoria), naranja (contacto).

Listas como tablas de estudio: filas separadas por filetes de 1px arriba y abajo, nunca tarjetas.

## Elevation & Depth

La profundidad es luz de estudio, no capas de interfaz. Cada suelo es un degradado radial con el foco arriba a la izquierda (24% 0%) que cae hacia la esquina, más un grano fino de papel al 18% en modo overlay. Sobre ese papel, las copias cuelgan con una sombra blanda en dos tiempos: un contacto corto y una caída larga y difusa hacia abajo. No hay superficies flotantes salvo la tarjeta de contacto y los diálogos de ampliación, que oscurecen el estudio entero.

### Shadow Vocabulary
- **Copia colgada** (`box-shadow: 0 2px 4px rgb(11 12 13 / 0.12), 0 28px 50px -30px rgb(11 12 13 / 0.6)`): fotos y vídeos sobre cualquier suelo.
- **Copia a la luz** (`box-shadow: 0 2px 4px rgb(11 12 13 / 0.14), 0 40px 70px -40px rgb(11 12 13 / 0.75)`): la copia grande del escenario del book.
- **Tarjeta de reflector** (`box-shadow: 0 2px 4px rgb(11 12 13 / 0.2), 0 30px 60px -24px rgb(11 12 13 / 0.7)`): la tarjeta de contacto desplegada.
- **Caída del naranja** (`box-shadow: 0 18px 32px -22px rgb(165 70 42 / 0.9)`): bajo el botón principal.
- **Oscuridad de ampliación** (fondo `rgb(23 24 26 / 0.96)`): telón de los diálogos de foto y reel.

### Named Rules
**La regla de la luz principal.** Toda luz entra desde arriba a la izquierda y cae hacia la esquina. Ningún suelo nuevo se pinta plano ni con la luz por otro lado.

**La regla de la sombra blanda.** Las sombras son difusas y caen hacia abajo; nunca sombras duras desplazadas ni brillos de color salvo la caída del naranja.

## Shapes

Corte recto en todo: copias, botones de texto, tarjeta de contacto y marcos de vídeo con radio 0. El único círculo es funcional: botones de icono (menú, contacto, controles de ampliación, cerrar reel, copiar) y discos de reproducción (vídeo y voz), con filete de 1px de platino al 45% sobre la sombra. Los filetes son de 1px; el único trazo de 2px es el naranja bajo la copia elegida.

## Components

### Buttons
Cortados a escuadra, en versalitas espaciadas, con la flecha o el icono desplazándose 3px al pasar.
- **Shape:** corte recto (radio 0), alto mínimo 3rem.
- **Principal (`btn-main`):** fondo naranja, tinta, filete naranja y caída del naranja; al pasar, naranja a la luz. Uno por bloque.
- **Discreto (`btn-quiet`):** transparente, filete de 1px del color del texto; al pasar, un velo del 9% de ese color. Funciona en luz, sombra y naranja.
- **Seda (`btn-ink`):** fondo seda negra y platino; al pasar, pavo real. Solo sobre el naranja.
- **Barra:** variante compacta (alto 2.5rem, 0.6875rem) de los botones en la barra del sitio.
- **Focus:** anillo de 1.5px naranja con 4px de separación en todo el sitio.

### Enlaces
- **Enlace fino (`link-fine`):** subrayado de 1.5px a 0.3em, en brillo del damasco (luz), puño (sombra) o tinta al 45% (naranja); al pasar, el texto toma el color del filete.
- **Correo del Contacto:** Spectral 200 a escala de titular; el subrayado de tinta se dibuja de izquierda a derecha al pasar.

### Cards / Containers
- **Copia (`print`):** contenedor de foto o vídeo sin marco ni radio, fondo grafito mientras carga, sombra de copia colgada.
- **Tarjeta de contacto:** papel a la luz, 20rem de ancho, sin radio, sombra de reflector; entra cayendo 6px. Contiene la dirección en Spectral, el botón circular de copiar y las redes tras un filete.

### Navigation
- **Barra del sitio:** pegada arriba, grafito hondo, 4.25rem, filete inferior claro. Firma en Spectral 300 (1.6rem) con el oficio en rótulo; navegación en rótulos de 0.6875rem en platino suave; al pasar o en la ruta activa, platino con un filete naranja de 1px que crece desde la izquierda.
- **Móvil (<1024px):** botón circular de menú; el menú es una hoja de sombra a pantalla completa con los destinos en Spectral 200 grande separados por filetes; el activo en naranja a la luz.
- **Pie:** grafito hondo, nombre en Spectral 200, oficio en rótulo y créditos en platino suave.

### Book (componente firma)
Dos disposiciones del mismo material.
- **Sesión:** una copia grande en el escenario y su hilera. Las copias no elegidas esperan en la sombra (brillo 0.6, saturación 0.7) y se iluminan al pasar o al elegirlas; la elegida lleva un filete naranja de 2px debajo que crece desde la izquierda. Al cambiar, la copia nueva entra con la luz (`to-light`, 0.9s). En móvil la hilera se desliza en horizontal y el escenario tiene alto fijo; en escritorio la hilera va al lado en cuatro columnas, a la altura de la copia grande, y la copia se cuelga arriba. Pie con contador en rótulo.
- **Muro:** columnas de copias colgadas con su pie en rótulo; al pasar, la copia crece un 3% y se aclara.
- **Ampliación:** diálogo a pantalla completa sobre la oscuridad de ampliación, con contador, pie y controles circulares.

### Voz
Lista de demos entre filetes: disco de reproducción circular (platino al pasar, naranja cuando suena), nombre en Spectral 300 y duración en rótulo, y una onda dibujada con los picos reales de cada MP3. Las barras sin reproducir son platino al 32%; la parte reproducida, naranja.

### Vídeo
Fachada de Vimeo dentro de una copia: póster al 85% de brillo que se aclara al pasar, velo inferior oscuro y disco naranja de reproducción con el rótulo «Reproducir». El reel abre en un diálogo a pantalla completa.

### Portada
Foto `fondo2` a sangre que se enciende al cargar (`lights-up`, 2.4s: de brillo 0.12 a pleno, con un leve alejamiento del 3%); el nombre, el oficio, los oficios en cursiva y el botón del reel suben en escalera (`rise`, 14px, de 0.8s a 1.4s). Con movimiento reducido todo queda en su sitio al instante.

## Do's and Don'ts

### Do:
- **Do** asignar cada página o sección a un suelo: `ground-lit` para leer, `ground-shade` para mirar y escuchar, con su degradado desde arriba a la izquierda y su grano.
- **Do** reservar el naranja para la acción principal, con tinta encima, y para indicar lo elegido, activo o reproducido.
- **Do** poner sobre el naranja solo tinta, `btn-ink` y `btn-quiet`.
- **Do** escribir nombre y títulos en Spectral 200/300 y la interfaz en Jost 500 espaciado en versalitas.
- **Do** colgar fotos y vídeos como copias sin marco ni radio, con la sombra de copia colgada.
- **Do** separar listas con filetes de 1px (`rule`) en vez de tarjetas.
- **Do** usar el motivo de luz para elegir: lo no elegido atenuado en la sombra, lo elegido a plena luz.
- **Do** respetar `prefers-reduced-motion`: las exposiciones y subidas quedan resueltas al instante.

### Don't:
- **Don't** usar un segundo campo entero de naranja ni un segundo botón naranja en el mismo bloque.
- **Don't** poner texto blanco sobre el naranja.
- **Don't** colocar antetítulos o rótulos en versalitas encima de un titular.
- **Don't** usar palo seco condensado o pesado para titulares, ni Spectral por encima de 300 en títulos.
- **Don't** redondear botones de texto, copias ni tarjetas; el círculo es solo para botones de icono y discos de reproducción.
- **Don't** pintar suelos planos o con la luz desde otra dirección, ni usar sombras duras desplazadas.
- **Don't** montar rejillas de tarjetas con borde y radio.
