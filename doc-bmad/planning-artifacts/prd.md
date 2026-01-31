---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
inputDocuments:
  - chat-vision-input
workflowType: 'prd'
classification:
  projectType: Web App / SaaS
  domain: General / Retail / Social
  complexity: Medium
  projectContext: Greenfield
---

# Product Requirements Document - bronx

**Author:** Max Allegri
**Date:** 2026-01-31

## 1. Executive Summary & Vision

*Un portale gestionale "Funny & Rough" progettato per la gestione condivisa di un "box" di amici, focalizzato su stock di snack, bevande e birre.*

### Visione del Prodotto
Trasformare la gestione burocratica di un magazzino condiviso in un'esperienza sociale e divertente. L'obiettivo è garantire precisione nei consumi e nello stock tramite automazioni AI, integrazioni real-time e un'interfaccia irriverente che preservi l'anima del ritrovo tra amici.

## 2. Analisi Strategica (Elicited Insights)

Sintesi dei requisiti chiave emersi per massimizzare il valore del prodotto:

*   **Esperienza Utente (UX):**
    *   **One-Click Buy:** Flusso di acquisto ultra-rapido per i Soci.
    *   **Resilienza Connettività:** Supporto PWA con sincronizzazione offline per ambienti seminterrati o cantine.
    *   **Atmosfera "Funny & Rough":** Implementazione di Easter Eggs (neve, cursori personalizzati) senza compromettere la velocità d'uso.
*   **Gestione Guest:**
    *   **Accesso Instant:** Generazione di link/QR JWT temporanei (3h) per pagamenti immediati senza registrazione.
    *   **Pricing Dinamico:** Ricarico automatico del 30% per gli ospiti rispetto ai prezzi per i Soci.
*   **Intelligenza Artificiale:**
    *   **Stock Butler:** Parsing via linguaggio naturale ("Aggiungi 12 Ichnusa") per semplificare il lavoro dell'Admin.
    *   **Sarcastic AI:** Feedback interattivo e ironico basato sullo stato dello stock e sulle abitudini di consumo.
*   **Integrazione Social:**
    *   **Real-time Feed:** Notifiche su Telegram/WhatsApp per acquisti e avvisi di stock critico.
    *   **Gamification:** Classifiche simboliche (Wall of Fame/Shame) per incentivare la trasparenza.

## 3. Success Criteria (KPI)

### User Success
*   **Checkout Socio:** Acquisto "One-Click" completato in meno di 3 secondi.
*   **Accesso Guest:** Pagamento via QR completato in meno di 60 secondi (zero-registration).
*   **PayPal Flow:** Conferma transazione entro 5 secondi dall'approvazione esterna.
*   **Engagement:** >50% delle transazioni genera una notifica/reazione nel canale Telegram.

### Business & Operational Success
*   **Integrità Magazzino:** Corrispondenza del 100% tra stock fisico e digitale a fine mese.
*   **Margine Operativo:** Il ricarico Guest copre integralmente i costi operativi della piattaforma e del box.
*   **Riconciliazione Finanziaria:** 100% delle transazioni PayPal tracciate e associate nel database.
*   **Produttività Admin:** Aggiornamento stock via AI Butler completato in meno di 2 minuti per operazione.

### Technical Performance
*   **Offline Sync:** Sincronizzazione automatica del 100% delle transazioni offline al ripristino del segnale.
*   **Affidabilità Webhook:** Elaborazione garantita delle conferme PayPal IPN/Webhook.
*   **Uptime Bot:** Notifiche attive 24/7 con latenza minima.

## 4. Product Scope & Roadmap

### MVP - Phase 1 (Core Experience)
*   **Auth & Roles:** Gestione Admin, Socio e Guest (token JWT 3h).
*   **Core Stock:** Catalogo prodotti con gestione quantità e costi.
*   **PayPal Integration:** SDK per pagamenti diretti e gestione webhook.
*   **Telegram Bot:** Canale di gruppo per notifiche acquisti e alert stock.
*   **Irreverent UX/UI:** PWA con cursore personalizzato e sistema di feedback animato.
*   **AI Butler:** Supporto base per l'inserimento stock via testo naturale.

### Phase 2 (Growth & Engagement)
*   **Sarcastic AI Bot:** Chatbot interattivo per battute e suggerimenti.
*   **Wall of Fame/Shame:** Classifiche dinamiche sui consumi.
*   **Simulated Data:** Script per popolamento DB e stress testing del magazzino.

### Phase 3 (Vision & Future)
*   **IoT Fridge:** Sensori fisici per aggiornamento automatico dello stock alla chiusura della porta.
*   **Digital Wallet:** Sistema di credito prepagato per i soci del box.

## 5. User Journeys

### Journey 1: Marco (Socio) - "La sete del venerdì"
Marco vuole una birra velocemente. Apre la PWA (caricata istantaneamente), scansiona il QR sul frigo e clicca sul logo Ichnusa. Grazie al conto PayPal collegato, l'acquisto è immediato. Prende la birra mentre il bot Telegram annuncia la sua mossa al gruppo.

### Journey 2: Luca (Ospite) - "L'amico di passaggio"
Luca non ha l'app. Marco genera un codice Guest. Luca scansiona, atterra sulla landing page, vede i prezzi (maggiorati per ospiti) e paga con PayPal in pochi secondi. Riceve la birra senza dover registrare alcun account.

### Journey 3: Max (Admin) - "Rifornimento rapido"
Max arriva con dei cartoni di rifornimento. Apre l'AI Butler e scrive: "*Aggiungi 48 birre e 5 pacchi di taralli*". L'AI conferma e aggiorna il DB istantaneamente, inviando un feedback di stock ripristinato al gruppo.

## 6. Functional Requirements (Capability Contract)

### Access & User Management
- **FR1:** Autenticazione sicura per Admin e Soci via Supabase Auth.
- **FR2:** Gestione anagrafica Soci e privilegi da parte dell'Admin.
- **FR3:** Generazione di chiavi/link temporanei (3h) per accesso Guest.
- **FR4:** Supporto acquisto Guest senza persistenza account (Sessione temporanea).

### Stock & Pricing
- **FR5:** Configurazione catalogo (prodotto, categoria, costo acquisto).
- **FR6:** Aggiornamento real-time delle quantità disponibili.
- **FR7:** Parsing NLP per comandi stock Admin (AI Butler).
- **FR8:** Calcolo dinamico prezzo finale (Socio: Base, Guest: +30%).
- **FR9:** Blocco automatico acquisto per articoli con stock zero.

### Checkout & Connectivity
- **FR10:** Esecuzione transazione via PayPal SDK.
- **FR11:** Riconciliazione transazioni (ID Transazione <-> Utente/Prodotto).
- **FR12:** Logging immutabile di ogni movimento (economico e di stock).
- **FR13:** Supporto offline per navigazione catalogo e accodamento operazioni (PWA).

### Social & Atmosphere
- **FR14:** Dispatch notifiche acquisto e alert stock su Telegram.
- **FR15:** Supporto animazioni e cursori custom legati allo stato utente/app.

## 7. Non-Functional Requirements (Quality Standards)

### Performance & Scalability
- **NFR1:** Dashboard operativa in < 2 secondi sotto rete 4G instabile.
- **NFR2:** Supporto fino a 50 utenti simultanei senza decremento di precisione nello stock.

### Security & Reliability
- **NFR3:** Crittografia end-to-end (TLS 1.3) per ogni scambio dati.
- **NFR4:** Atomicità Transazione: lo stock viene scalato solo dopo la ricezione del webhook PayPal positivo.
- **NFR5:** Sincronizzazione offline garantita entro 5 secondi dal ritorno della connettività.

### Maintainability
- **NFR6:** CSS/JS modulare per consentire la disattivazione centralizzata degli elementi grafici "pesanti" (Easter Eggs).
