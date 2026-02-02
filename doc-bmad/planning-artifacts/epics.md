---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - doc-bmad/planning-artifacts/prd.md
  - doc-bmad/planning-artifacts/architecture.md
  - doc-bmad/planning-artifacts/ux-design-specification.md
status: 'complete'
completedAt: '2026-01-31T11:54:32+01:00'
---

# bronx - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bronx, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Autenticazione sicura per Admin e Soci via Supabase Auth.
FR2: Gestione anagrafica Soci e privilegi da parte dell'Admin.
FR3: Generazione di chiavi/link temporanei (3h) per accesso Guest.
FR4: Supporto acquisto Guest senza persistenza account (Sessione temporanea).
FR5: Configurazione catalogo (prodotto, categoria, costo acquisto).
FR6: Aggiornamento real-time delle quantità disponibili.
FR7: Parsing NLP per comandi stock Admin (AI Butler).
FR8: Calcolo dinamico prezzo finale (Socio: Base, Guest: +30%).
FR9: Blocco automatico acquisto per articoli con stock zero.
FR10: Esecuzione transazione via PayPal SDK.
FR11: Riconciliazione transazioni (ID Transazione <-> Utente/Prodotto).
FR12: Logging immutabile di ogni movimento (economico e di stock).
FR13: Supporto offline per navigazione catalogo e accodamento operazioni (PWA).
FR14: Dispatch notifiche acquisto e alert stock su Telegram.
FR15: Supporto animazioni e cursori custom legati allo stato utente/app.

### NonFunctional Requirements

NFR1: Dashboard operativa in < 2 secondi sotto rete 4G instabile.
NFR2: Supporto fino a 50 utenti simultanei senza decremento di precisione nello stock.
NFR3: Crittografia end-to-end (TLS 1.3) per ogni scambio dati.
NFR4: Atomicità Transazione: lo stock viene scalato solo dopo la ricezione del webhook PayPal positivo.
NFR5: Sincronizzazione offline garantita entro 5 secondi dal ritorno della connettività.
NFR6: CSS/JS modulare per consentire la disattivazione centralizzata degli elementi grafici "pesanti" (Easter Eggs).

### Additional Requirements

- **Starter Template**: Vite + React + TypeScript (`npx create-vite@latest bronx-app --template react-ts`). Critical for Epic 1 Story 1.
- **Backend/Infrastructure**: Supabase (DB, Auth, Edge Functions, Realtime, Storage), Vercel, GitHub Actions.
- **Payments**: PayPal SDK integration with Edge Functions for secure webhooks.
- **Social Integration**: Telegram Bot API for real-time notifications and alerts.
- **Tech Stack**: Zustand (State), Framer Motion (Animations), Tailwind CSS (Styling), Vitest (Testing).
- **UX Strategy**: PWA (installable, offline-first), Zenith Cinematic style (bokeh, neon), Mobile-First.
- **Accessibility**: Zenith Protocol AA (High contrast, large touch targets 48px).
- **Core Elements**: Elite List (dense typographic list), Transaction Trigger button, AI Butler (NLP + Sarcasm).
- **Security**: Row Level Security (RLS) for data isolation between roles (Admin, Socio, Guest).

### FR Coverage Map

FR1: Epic 2 - Autenticazione Soci via Supabase
FR2: Epic 2 - Gestione Privilegi Socio/Admin
FR3: Epic 3 - Generazione link Guest temporanei
FR4: Epic 2 - Accesso rapido Guest (Protocollo)
FR5: Epic 3 - Configurazione Catalogo Prodotti
FR6: Epic 3 - Sincronizzazione Stock Real-time
FR7: Epic 3 - Comandi NLP AI Butler (Admin)
FR8: Epic 3 - Calcolo Dinamico Prezzi (+30% Guest)
FR9: Epic 3 - Blocco acquisto stock zero
FR10: Epic 4 - Integrazione PayPal Checkout
FR11: Epic 4 - Riconciliazione Transazioni
FR12: Epic 4 - Audit Log immutabile
FR13: Epic 5 - Supporto PWA & Sync Offline
FR14: Epic 4 - Social Sync: Notifiche Telegram
FR15: Epic 1 - Atmosfera Zenith & Animazioni Bokeh

## Epic List

### Epic 1: Foundations & Elite Shell
Inizializzazione del progetto con lo stack Vite/TS/Tailwind e implementazione dell'identità visiva "Zenith Cinematic". L'utente può visualizzare la struttura base dell'app con performance d'élite.
**FRs covered:** FR15

### Epic 2: Access & Identity Protocol
Implementazione del sistema di autenticazione per Soci e Admin e del protocollo di accesso rapido per i Guest via chiavi temporanee.
**FRs covered:** FR1, FR2, FR4

### Epic 3: The Zenith Catalog & Real-time Inventory
Sviluppo della "Elite List" dei prodotti con aggiornamento real-time e interfaccia di gestione stock per l'Admin tramite AI Butler (NLP).
**FRs covered:** FR3, FR5, FR6, FR7, FR8, FR9

### Epic 4: Transaction & Social Momentum
Integrazione del gateway di pagamento PayPal e attivazione del Social Feedback Loop tramite notifiche automatiche al bot Telegram.
**FRs covered:** FR10, FR11, FR12, FR14

### Epic 5: PWA Resilience & Admin Control
Conversione in Progressive Web App per installazione e uso offline, sincronizzazione dati resiliente e dashboard di controllo Admin completa.
**FRs covered:** FR13

## Epic 1: Foundations, Infrastructure & Elite Shell
**Goal:** Inizializzare l'ecosistema tecnico, configurare l'infrastruttura (DB, Auth) e l'identità visiva d'élite.

### Story 1.1: Project Initialization & Zenith Theme
As a Developer,
I want to initialize the Vite/TS project and configure the Zenith design tokens,
So that I have an "Elite" foundation for development.

**Acceptance Criteria:**
**Given** a clean workspace
**When** I run `npx create-vite` and configure `tailwind.config.ts` with Zenith colors (#050505, #F97316)
**Then** the project should serve a base page with the correct brand colors and typography.

### Story 1.1b: Infrastructure & Schema Setup
As a Developer,
I want to set up the Supabase project and create the necessary database schema,
So that the application has a backend to store users and products.

**Acceptance Criteria:**
**Given** a new Supabase project
**When** I execute the SQL initialization scripts for `users`, `products`, `transactions` tables with RLS policies
**Then** the database should be ready to accept connections and store data securely.

### Story 1.2: Surface Assets & Cinematic Bokeh Background
As a User,
I want to see a cinematic interface with interactive bokeh effects,
So that the app reflects the exclusive and high-end feel of the Box.

**Acceptance Criteria:**
**Given** the configured project
**When** I implement the main layout with Framer Motion radial gradients
**Then** I should see a dynamic, moving bokeh effect in the background and a custom Zenith cursor.

### Story 1.3: Atomic Zenith UI Library
As a Developer,
I want to create reusable components like ZenithButton and UnderlineInput,
So that I can build features consistently and rapidly.

**Acceptance Criteria:**
**Given** the Zenith design tokens
**When** I implement the button with "Solid-to-Orange" hover states and inputs with animated bottom borders
**Then** every instance must match the premium interaction patterns defined in the UX spec.

## Epic 2: Access & Identity Protocol
**Goal:** Gestire in modo sicuro e veloce l'identità di Soci e Guest.

### Story 2.1: Supabase Auth & Member Login
As a Socio,
I want to log in with my credentials,
So that I can benefit from my membership pricing and see my account history.

**Acceptance Criteria:**
**Given** a Socio user in Supabase Auth
**When** I complete the login form within the app
**Then** I should be redirected to the Catalog and my session should persist across visits.

### Story 2.2: Guest Quick-Access Protocol
As a Guest,
I want to access the catalog via a temporary JWT link without registering,
So that I can make an immediate purchase without friction.

**Acceptance Criteria:**
**Given** a temporary JWT token
**When** I access the app via the QR-link
**Then** the system must identify me as a "Guest", apply the +30% dynamic pricing, and allow me to proceed to checkout.

## Epic 3: The Zenith Catalog & Real-time Inventory
**Goal:** Visualizzazione del catalogo e gestione intelligente dello stock.

### Story 3.1: The Elite List Display
As a User,
I want to see the products in a dense, typographic list,
So that I can quickly find what I want to drink.

**Acceptance Criteria:**
**Given** products populated in the database
**When** I view the Catalog page
**Then** I should see a high-contrast monospaced list of products with real-time stock availability and dynamic prices based on my role.

### Story 3.2: AI Butler NLP Stock Management
As an Admin,
I want to update stock by typing natural sentences (e.g., "Add 12 Heineken"),
So that I can restock the fridge without navigating complex forms.

**Acceptance Criteria:**
**Given** the Admin Stock Interface
**When** I input a natural language restock command
**Then** the system should use a parsing utility to identify the product and quantity, updating the database and sending a sarcastic confirmation message.

## Epic 4: Transaction & Social Momentum
**Goal:** Checkout ultra-veloce e feedback sociale nel gruppo.

### Story 4.1: PayPal One-Tap Checkout
As a User,
I want to trigger a payment with a single action leading to PayPal,
So that my purchase is completed in under 5 seconds.

**Acceptance Criteria:**
**Given** a product selection
**When** I click the "Transaction Trigger" button
**Then** the PayPal SDK should launch, and upon confirmation, show the "Cinematic Success" bokeh animation.

### Story 4.2: Social Sync Telegram Feed
As a Group Member,
I want to see real-time alerts in Telegram for every purchase,
So that the social ledger of the box remains public and interactive.

**Acceptance Criteria:**
**Given** a completed payment
**When** the database stock is updated
**Then** a Supabase Edge Function must dispatch a notification to the Telegram Bot including the product name and user identity.

## Epic 5: PWA Resilience & Admin Control
**Goal:** Installabilità e operatività in ogni condizione.

### Story 5.1: PWA Installation & Service Worker
As a User in the Basement,
I want the app to be installable and work offline,
So that I can browse the catalog even when the connection is unstable.

**Acceptance Criteria:**
**Given** a PWA manifest and Service Worker
**When** I visit the site on mobile
**Then** I should be prompted to "Add to Home Screen" and be able to see the cached catalog without a network connection.

## Epic 6: Admin Dashboard & Control
**Goal:** Fornire all'Admin gli strumenti per gestire utenti, catalogo e stock.

### Story 6.1: Admin User Management
As an Admin,
I want to view and manage the list of Soci,
So that I can assign roles and verify active memberships.

**Acceptance Criteria:**
**Given** an authenticated Admin user
**When** I access the "Elite Roster" section
**Then** I should see a list of users and be able to edit their roles or status.

### Story 6.2: Guest Link Generation
As an Admin,
I want to generate temporary access links for Guests,
So that I can allow non-members to purchase from the catalog.

**Acceptance Criteria:**
**Given** the Admin Dashboard
**When** I click "Generate Guest Key"
**Then** the system should produce a unique URL valid for 3 hours that logs a user in as "Guest".

### Story 6.3: Product Management Interface
As an Admin,
I want to add and edit products in the catalog,
So that I can keep the offering up to date without using SQL commands.

**Acceptance Criteria:**
**Given** the Catalog Management view
**When** I submit the "New Artifact" form
**Then** a new product should be created in Supabase and appear immediately in the live catalog.
