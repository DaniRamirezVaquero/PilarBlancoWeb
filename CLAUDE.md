# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PilarBlancoWeb is a portfolio website for an actress built with Angular 17.3 and a Node.js/Express backend. The site showcases videos, photos, voice work, biography, CV, and includes a contact form with reCAPTCHA protection.

## Development Commands

### Frontend (Angular)
- `npm start` - Start dev server at http://localhost:4200
- `npm run build` - Production build to `dist/pilar-blanco-web`
- `npm run watch` - Build in watch mode with development configuration
- `npm test` - Run Karma/Jasmine tests

### Backend (Node.js/Express)
- `cd backend && npm start` - Start email server on port 3000 (or PORT from .env)
- Backend requires `.env` file with:
  - `RECAPTCHA_SECRET_KEY` - Google reCAPTCHA v3 secret
  - `MAIL_USER` - Gmail account for sending emails
  - `MAIL_APP_PASS` - Gmail app-specific password
  - `PORT` - Server port (optional, defaults to 3000)

### Running Full Stack
Both frontend and backend must run simultaneously for the contact form to work.

## Architecture

### Frontend Structure
- **Pages** (`src/app/Pages/`): Full-page components for each route
  - `principal` - Home page
  - `video-page` - Video gallery
  - `gallery-page` - Photo gallery with download functionality
  - `voice-page` - Voice work showcase with audio player
  - `bio-page` - Biography with download button
  - `cv-page` - Curriculum Vitae with download button
  - `contact-page` - Contact form with reCAPTCHA

- **Components** (`src/app/components/`): Reusable UI elements
  - `header` - Main navigation header
  - `footer` - Site footer
  - `side-navigation` - Lateral navigation menu
  - `burguer-menu-btn` - Hamburger menu toggle button
  - `carousel` - Image carousel for galleries
  - `cassette` - Audio player with cassette design
  - `collage` - Photo collage layout
  - `captcha` - reCAPTCHA integration wrapper
  - Download buttons: `download-bio-btn`, `download-cv-btn`, `dowload-gallery-btn`
  - Social links: `socials`
  - Media controls: `play-btn`

- **Services** (`src/app/services/`):
  - `seo.service.ts` - Meta tags and SEO optimization
  - `breadcrumb.service.ts` - Breadcrumb navigation state
  - `side-nav.service.ts` - Side navigation open/close state
  - `sitemap.service.ts` - Sitemap generation
  - `performance.service.ts` - Performance monitoring

### Backend Structure
Single Express server (`backend/server.js`) that:
- Handles contact form submissions via POST `/api/send-email`
- Validates reCAPTCHA tokens with Google API
- Rate limits emails by IP (5 minute cooldown between submissions)
- Sends emails via Nodemailer using Gmail SMTP
- Uses CORS for cross-origin requests from Angular dev server

### Routing
All routes defined in `src/app/app.routes.ts`:
- `/home` → Principal (landing page)
- `/video` → Video gallery
- `/gallery` → Photo gallery
- `/voice` → Voice work
- `/bio` → Biography
- `/curriculum` → CV
- `/contact` → Contact form
- `/` → Redirects to `/home`

### Styling
- **Tailwind CSS** (v3.4.7) for utility-first styling
- **DaisyUI** (v4.12.10) for component presets
- Global styles in `src/styles.css`
- Component-specific styles are minimal (app.component.css is empty)

### TypeScript Configuration
- Strict mode enabled (`strict: true`)
- Target: ES2022
- All strict Angular compiler options enabled
- `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature` enforced

### Build Configuration
- Output directory: `dist/pilar-blanco-web`
- Production bundle budgets:
  - Initial: 500kb warning, 1mb error
  - Component styles: 2kb warning, 4kb error
- Static assets: `src/assets`, `favicon.ico`, `robots.txt`, `sitemap.xml`
- Development uses file replacements for environment config

## Key Integration Points

### Contact Form Flow
1. User fills form in `contact-page` component
2. Component validates reCAPTCHA via `ng-recaptcha` library
3. POST request sent to `http://localhost:3000/api/send-email` (backend must be running)
4. Backend validates token with Google, checks rate limit, sends email via Nodemailer
5. Component displays success/error message

### SEO Strategy
- `SeoService` manages meta tags dynamically per route
- Each page component should call `SeoService` methods in `OnInit`
- Static `robots.txt` and `sitemap.xml` in `src/` root

### Asset Management
- Images, videos, audio files stored in `src/assets/`
- Download buttons link to PDF files in assets
- Gallery download creates zip of images client-side

## Testing
- Test framework: Karma + Jasmine
- Test config: `tsconfig.spec.json`
- No custom test scripts beyond `npm test`
- Coverage configuration in `angular.json` karma options

## Language
- UI text and comments are in Spanish
- Error messages and user-facing content should be in Spanish
