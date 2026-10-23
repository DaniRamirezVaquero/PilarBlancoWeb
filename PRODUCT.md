# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Directores de casting y productoras que evalúan a Pilar Blanco para un papel o proyecto. Llegan con prisa, comparan con otros perfiles y necesitan ver rápido showreel, fotos, voz, CV y cómo contactar. Otras audiencias (agentes, público general) no están confirmadas.

## Product Purpose
Portfolio profesional de Pilar Blanco, actriz. Reúne showreel (Vimeo), galería de fotos, demos de voz, biografía y CV, con contacto directo por correo. Éxito: que un profesional del casting se haga una idea clara de su rango y la contacte.

## Positioning
Según la propia petición: hay pocas actrices de su edad, con su aspecto y con su versatilidad. La web debe mostrar ese rango (imagen, interpretación y voz) en lugar de afirmarlo en abstracto.

## Operating Context
Se consulta en escritorio y móvil, normalmente en una visita corta de revisión. Los materiales descargables (CV en PDF, fotos de la galería en zip) forman parte del flujo de los profesionales. La web se está rediseñando (rama `rediseno-web`).

## Capabilities and Constraints
- Angular 17.3 (con SSR) + Tailwind/DaisyUI, desplegado en Vercel. Ya no hay formulario de contacto ni backend: el contacto es un popover de correo (copiar dirección o redactar en Gmail) y el correo que figura en el CV.
- Rutas existentes: `/home`, `/video`, `/gallery`, `/voice`, `/bio`, `/curriculum`.
- Contenido, textos y mensajes de usuario en español.
- Biografía y CV son HTML real (con retrato, créditos enlazados a vídeos y botón de descarga del PDF), no imágenes.
- El inicio tiene una única portada y la web una única paleta (ver DESIGN.md); se retiró la alternancia de portadas y temas.
- Pilar ya no trabaja con OK Agencia: no mostrar su logo, enlace ni email. Hoy no hay representación confirmada; el contacto es directo.
- Sin decidir: si se añade idioma alternativo.

## Brand Commitments
Nombre: "Pilar Blanco", profesión "Actriz". Perfiles sociales vigentes: Instagram `pilarblanco.actriz` y Vimeo. Ningún compromiso visual vinculante declarado.

## Evidence on Hand
- Reel 2026 en Vimeo (id 1208363473), demos de doblaje en Vimeo y fotos propias (portada del inicio, collage, carrusel).
- Demos de locución en MP3 (`src/assets/tapes`).
- CV en PDF descargable y pack de fotos en zip.
- Créditos del CV con enlaces a vídeos de los proyectos que Pilar ha pasado.
- No hay testimonios ni premios de la propia Pilar más allá de lo escrito en su bio y CV: no inventarlos.

## Product Principles
1. Los materiales mandan: showreel, fotos y voz se ven y escuchan antes que cualquier adorno.
2. Cada página responde a una pregunta de casting (quién es, cómo se ve, cómo suena, qué ha hecho, cómo la contacto).
3. Mostrar versatilidad con material real, nunca con adjetivos.
4. Contactar y descargar CV y fotos debe ser inmediato desde cualquier punto.
5. Español primero; cero relleno que no se pueda respaldar con contenido real.

## Accessibility & Inclusion
Sin requisito específico declarado. Base razonable: contraste legible sobre fotografía, controles de audio/vídeo operables por teclado.
