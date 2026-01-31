---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - doc-bmad/planning-artifacts/prd.md
  - doc-bmad/planning-artifacts/ux-design-specification.md
workflowType: 'architecture'
project_name: 'bronx'
user_name: 'Max Allegri'
date: '2026-01-31T11:19:01+01:00'
lastStep: 8
status: 'complete'
completedAt: '2026-01-31T11:46:00+01:00'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## 2. Project Context Analysis

### Requirements Overview

**Functional Requirements:**
L'architettura deve supportare un flusso transazionale ultra-veloce ("Scan to Drink"). I punti cardine sono il caricamento dinamico del catalogo tramite QR Code e l'integrazione di PayPal come gateway di pagamento primario. La distinzione tra ruoli Socio e Guest è fondamentale per la logica di pricing e accesso.

**Non-Functional Requirements:**
*   **Performance Critica:** Obiettivo di < 5 secondi per completare l'acquisto. Richiede Optimistic UI e caricamento asincrono degli asset.
*   **Resilienza:** Gestione di zone con scarsa connettività (cantine/box) tramite service workers e caching locale.
*   **Estetica Premium:** Supporto tecnico per animazioni fluide (Framer Motion) e effetti bokeh dinamici definiti nella specifica UX.

**Scale & Complexity:**
*   **Primary domain:** Web PWA / Serverless Backend.
*   **Complexity level:** High (integrazione real-time + gateway di pagamento + bot ecosystem).
*   **Estimated architectural components:** 4 (Frontend PWA, API Layer/Supabase, PayPal Integration, Telegram Bot).

### Technical Constraints & Dependencies
*   **Provider Backend:** Supabase (Auth, DB, Storage).
*   **Gateway:** PayPal SDK.
*   **Social:** Telegram Bot API.

### Cross-Cutting Concerns Identified
*   **Real-time Stock Sync:** Sincronizzazione atomica dello stato del frigo tra tutti gli utenti.
*   **Social Feedback Loop:** Notifiche automatiche al bot Telegram post-transazione.
*   **AI Butler Error Handling:** Sistema centralizzato per la gestione degli errori con tono sarcastico.

## 3. Starter Template Evaluation

### Primary Technology Domain
Web PWA ad alte prestazioni con integrazione Serverless (Supabase).

### Starter Options Considered
1. **Create Vite App:** La scelta più pulita e performante. Offre controllo totale sui componenti Zenith e un bundle size minimo.
2. **Next.js (T3 Stack):** Potente per SEO e SSR, ma potenzialmente sovradimensionato per una PWA focalizzata sulla velocità di acquisto "One-Tap".
3. **Supabase Bootstrap:** Eccellente per il setup rapido del backend, ma richiede un'integrazione manuale per la UX d'élite richiesta.

### Selected Starter: Vite + React + TypeScript
**Rationale for Selection:**
Massima velocità di caricamento (< 2s), setup nativo per PWA e compatibilità perfetta con Framer Motion (per sostenere la UX Zenith Cinematic). TypeScript garantisce un codice "Elite" e privo di errori logici comuni.

**Initialization Command:**
```bash
npx create-vite@latest bronx-app --template react-ts
```

**Architectural Decisions Provided by Starter:**
*   **Language & Runtime:** TypeScript con configurazione rigorosa.
*   **Styling Solution:** Tailwind CSS (Utility-first per implementare lo stile Zenith).
*   **Build Tooling:** Vite (per HMR istantaneo e build veloci).
*   **PWA Support:** `vite-plugin-pwa` per caching offline e installabilità.
*   **Testing:** Vitest + React Testing Library.

**Note:** L'inizializzazione del progetto tramite questo comando sarà la prima story di implementazione ("Sprint 0").

## 4. Core Architectural Decisions

### Data Architecture (Supabase)
*   **Database:** PostgreSQL (gestito via Supabase) con modellazione relazionale per Utenti, Prodotti, Frigo e Transazioni.
*   **Real-time:** Abilitazione dei canali **Supabase Realtime** per la sincronizzazione istantanea dello stock tra tutti i client connessi.
*   **Security:** Implementazione di **Row Level Security (RLS)** per isolare i dati dei Guest e proteggere le configurazioni degli admin/soci.

### Authentication & Security
*   **Provider:** Supabase Auth.
*   **Strategy:** 
    *   **Soci:** Autenticazione persistente (Email/Password).
    *   **Guest:** Protocollo ad accesso rapido tramite sessioni anonime o link temporanei (Magic Links) per minimizzare la frizione.
*   **Authorization:** Ruoli distinti nel DB (`role: socio | guest | admin`) per gestire i prezzi dinamici e i permessi di accesso.

### API & Communication Patterns
*   **Client SDK:** Utilizzo nativo di `@supabase/supabase-js` per interazioni dirette con il DB e l'Auth.
*   **Edge Functions:** Utilizzo delle **Supabase Edge Functions** (Deno deploy) per gestire la logica server-side protetta:
    *   Integrazione Webhooks PayPal per la conferma dei pagamenti.
    *   Dispatch di notifiche al Bot Telegram.
    *   Sarcasmo programmato dell'AI Butler per la gestione errori.

### Frontend Architecture
*   **State Management:** **Zustand** per la gestione dello stato locale (carrello, UI states, cache stock) grazie alla sua leggerezza e compatibilità con React.
*   **Media/Assets:** Immagini dei prodotti caricate tramite Supabase Storage con ottimizzazione automatica.

### Infrastructure & Deployment
*   **Hosting:** Vercel (ottimizzato per PWA e Vite).
*   **CI/CD:** GitHub Actions per build automatiche e test (Vitest).
*   **Environment:** Gestione sicura delle API Keys (Supabase/PayPal/Telegram) tramite environment variables.

## 5. Implementation Patterns & Consistency Rules

### Naming Patterns
*   **Database (Supabase):**
    *   Tabelle: `snake_case` plurale (es. `products`, `members`, `transactions`).
    *   Colonne: `snake_case` (es. `price_socio`, `stock_quantity`).
*   **Codice (React/TS):**
    *   Componenti: `PascalCase` (es. `ZenithButton.tsx`, `EliteList.tsx`).
    *   Funzioni/Variabili: `camelCase` (es. `handleCheckout`, `isSocio`).
    *   File Utility: `kebab-case` (es. `supabase-client.ts`, `auth-helper.ts`).

### Structure Patterns
*   **Feature-Based Organization:** Il codice sarà organizzato per feature (es. `features/catalog`, `features/payment`, `features/admin`).
*   **State Management (Zustand):** Store atomici per dominio (es. `useCatalogStore.ts`, `useAuthStore.ts`).
*   **Edge Functions:** Tutte le logiche server-side risiederanno in `supabase/functions/` seguendo la struttura standard di Supabase.

### Format Patterns
*   **API Response:** Pattern standard Supabase `{ data, error }`.
*   **AI Butler Error Handling:** Ogni catch block deve utilizzare una utility `formatButlerError(error)` per formattare il messaggio con il tono sarcastico previsto dalla specifica.
*   **Date:** ISO 8601 (UTC) per il database; formattazione locale nel client.

### Process & Feedback Patterns
*   **Optimistic UI:** Ogni interazione transazionale deve fornire un feedback visivo immediato (es. cambio stato del pulsante "Buy") prima della conferma effettiva dal DB.
*   **Social Feedback Loop:** Ogni transazione completata deve attivare il trigger per la notifica automatica al bot Telegram.

### Enforcement Guidelines
**Tutti gli agenti AI operanti su bronx DEVONO:**
1.  Utilizzare esclusivamente **Tailwind CSS** per lo styling e **Framer Motion** per le animazioni.
2.  Assicurarsi che ogni nuovo componente rispetti i criteri di accessibilità **Zenith Protocol AA**.
3.  Non bypassare mai la **Row Level Security (RLS)** di Supabase nelle query client-side.

## 6. Project Structure & Boundaries

### Complete Project Directory Structure

```text
bronx-app/
├── public/                 # Asset statici (icona PWA, manifest)
├── supabase/
│   ├── functions/          # Edge Functions (PayPal, Bot Telegram)
│   └── migrations/         # Schema DB (Tables, RLS, Functions)
├── src/
│   ├── api/                # Client Supabase e definizioni RPC
│   ├── components/
│   │   ├── ui/             # Zenith Base Components (Buttons, Inputs)
│   │   ├── layout/         # Zenith Containers, Cinematic Overlays
│   │   └── shared/         # Componenti riutilizzabili cross-feature
│   ├── features/           # Logica di business divisa per dominio
│   │   ├── auth/           # Login Socio/Guest, Supabase Auth
│   │   ├── catalog/        # Elite List, QR Logic, Stock Real-time
│   │   ├── payment/        # PayPal Checkout, Transaction Trigger
│   │   └── admin/          # Dashboard Stock & Logs
│   ├── hooks/              # Custom hooks (es. useStock, useAuth)
│   ├── store/              # Zustand Store (Cart, User, UI)
│   ├── styles/             # Tailwind Config & Global CSS (Zenith Bokeh)
│   ├── types/              # Definizioni TypeScript (Database, App)
│   ├── utils/              # Helper (formatButlerError, date-utils)
│   ├── App.tsx             # Entry point con routing
│   └── main.tsx            # Setup Vite
├── tests/                  # Unit e Integration tests (Vitest)
├── .env.example            # Template variabili d'ambiente
├── package.json
└── tailwind.config.ts      # Customization Zenith Theme
```

### Architectural Boundaries

**Data Boundary:**
Nessun componente UI può scrivere direttamente nel database. Ogni mutazione deve passare attraverso uno store Zustand o un hook custom che incapsula la logica client di Supabase, garantendo la validazione dei dati.

**Security Boundary:**
La logica di conferma del pagamento e la gestione delle chiavi segrete risiedono esclusivamente nelle **Supabase Edge Functions**. Il frontend interagisce con questi flussi solo come consumatore di stati finali.

**Communication Patterns:**
L'integrazione con il Bot Telegram avviene in modo asincrono tramite trigger del database o chiamate dirette dalle Edge Functions, isolando la logica social dal core transazionale della PWA.

### Requirements to Structure Mapping

*   **Epic: Catalog & Stock:** Lives in `features/catalog` and `api/supabase-client.ts`.
*   **Epic: Payments:** Lives in `features/payment` and `supabase/functions/paypal-webhook`.
*   **Epic: Social Feed:** Lives in `supabase/functions/telegram-notify`.
*   **AI Butler Integration:** Global utilities in `utils/formatButlerError.ts` and middleware in `store/`.

## 7. Architecture Validation Results

### Coherence Validation ✅
*   **Decision Compatibility:** L'integrazione tra React (Frontend) e Supabase (Backend/Auth) è nativa e garantisce performance ottimali.
*   **Pattern Consistency:** Le convenzioni di naming e struttura sono state verificate per evitare collisioni tra gli agenti AI.
*   **Structure Alignment:** La cartella `features/` permette uno sviluppo parallelo e isolato di diverse funzionalità (Catalog, Payment, Admin).

### Requirements Coverage Validation ✅
*   **Functional Coverage:** Il flusso "Scan to Drink" è interamente coperto dalla combinazione di Supabase Realtime ed Edge Functions per PayPal.
*   **NFR Coverage:** La performance è garantita dall'uso di Vite e PWA; la sicurezza è blindata tramite Row Level Security (RLS) di PostgreSQL.

### Architecture Completeness Checklist
*   [x] Analisi del contesto completata.
*   [x] Stack tecnologico (Vite, Tailwind, Supabase) definito.
*   [x] Pattern di implementazione e consistenza stabiliti.
*   [x] Struttura delle directory e mapping dei requisiti definiti.

### Architecture Readiness Assessment
**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** HIGH

**Key Strengths:**
*   **Velocità:** Stack ultra-leggero orientato alle performance.
*   **Scalabilità:** Organizzazione feature-based che facilita l'aggiunta di nuovi frigo o prodotti.
*   **UX Premium:** Architettura pronta ad ospitare animazioni complesse senza degrado delle prestazioni.

### Implementation Handoff
Il primo passo di implementazione (Sprint 0) sarà l'inizializzazione del progetto tramite il comando definito nella sezione 3.
