# Nirdeshak — निर्देशक
### आपका Personal FD Guide

🌐 **[Open Live App → nirdeshak-production.up.railway.app](https://nirdeshak-production.up.railway.app)**

> India's first **proactive** Fixed Deposit advisor for Tier 2/3 users. Not a chatbot with a Hindi skin. Not a rate directory. A financial co-pilot that watches your money across every connected account, detects idle savings in real time, links every rupee to a goal you care about, and guides you from confusion to a confirmed FD booking — in your own language, before you even think to ask.

LIVE DEMO LINK: <nirdeshak-production.up.railway.app>
---

## The Problem We Are Solving

300 million+ Indians in Tier 2 and Tier 3 cities have savings sitting in bank accounts earning 3% a year. They know FDs exist. They know FDs pay more. But they never book one — because the process is intimidating, the language is English, the jargon is impenetrable, and nobody tells them *when* the right moment to act actually is.

The user in Gorakhpur is not confused about what "8.50% p.a." means in English. They are scared of making the wrong decision with money they worked hard to save. The problem is not translation. **The problem is trust and decision confidence.**

Every existing solution either explains FDs in Hindi (a translator) or shows a list of rates (a directory). Nobody watches the user's money and tells them exactly when to invest, how much, for which goal, and why — in a language that feels like a conversation with a trusted friend.

**Nirdeshak solves this.**

---

## What Makes Nirdeshak Different

**Proactive, not reactive.** Every other app waits for the user to ask. Nirdeshak watches money across all connected accounts and comes to the user — with a push notification in plain Hindi, a rupee amount, and a single tap to act.

**Goal-linked intelligence.** Nirdeshak does not just recommend FDs. It connects every investment to a specific goal the user cares about — a daughter's wedding, a new scooter, a home renovation — and shows exactly how one investment today moves them closer to that goal, in rupees, not percentages.

**Honest about money.** Nirdeshak never recommends investing the full savings balance. It calculates a mandatory safety buffer, subtracts committed upcoming expenses, and only surfaces the genuine idle surplus. The reasoning is shown in plain Hindi so the user understands the number. That transparency is itself a trust-building feature.

**Conversational end to end.** From the first question to the final booking confirmation, everything happens in a WhatsApp-style chat. No forms. No dashboards. No navigation anxiety. One conversation, one tap, one confirmed FD.

---

## Features

### 1. Chat Tab — The Entire Product in One Conversation

The Chat tab is the heart of Nirdeshak. Every feature — onboarding, idle money detection, FD comparison, risk assessment, and booking — happens here as natural conversation.

**Personalized default view.** When a returning user opens the app, the chat greets them by name, surfaces the single most important financial insight they should act on right now, and offers three quick-action shortcuts — no clutter, no dashboard, one thing to do.

**Goal-first onboarding.** The advisor always asks three questions before showing any product: how much money the user has, when they need it, and whether they might need it urgently. Products are never shown before the user's situation is understood.

**Automatic jargon translation.** Every financial term is explained inline with tappable tooltips:
- "p.a." → "har saal ka faida"
- "Maturity" → "paisa kab milega"
- "Tenor" → "kitne time ke liye"
- "Compounding" → "faida ke upar bhi faida"
- "Premature withdrawal" → "FD tod dena beech mein"

The user never encounters unexplained English — ever.

**Idle money alert card.** When idle savings are detected, an amber card appears in chat showing the exact rupee amount being lost by not investing. Not a percentage. A number: *"Aapka ₹23,000 sirf 3% kama raha hai. FD mein lagao toh ₹980 extra milega — bina kuch kiye."*

**FD comparison — three cards, one best.** Three FD options appear inline in chat, sorted by maturity amount for the user's exact investment and tenure. The best option is highlighted. The rupee difference from the best is shown on the others.

**Risk personalisation and FD laddering.** If the user might need money early, the advisor warns about penalties in rupees, recommends shorter tenors, and suggests splitting money across three FDs — 6 months, 1 year, 2 years — so some money is always accessible while the rest grows.

**Seven-step guided booking — powered by a state machine.** The entire booking process happens as natural conversation driven by a robust string-based state machine (`bookingStep`). Every step handles both affirmative and alternative responses — the flow never gets stuck or hits a dead end.

| Step | What happens |
|---|---|
| 1 | Confirm amount — with option to change |
| 2 | Suggest tenure based on goal deadline — user can accept or pick custom |
| 3 | Show best FD recommendation card — bank, rate, maturity amount, exact date |
| 4 | Confirm source of funds — breaks down exactly which accounts the money comes from |
| 5 | KYC check — confirms Aadhaar and PAN are ready before proceeding |
| 6 | Full plain-language summary with goal impact projection |
| 7 | Success — confetti, maturity amount, PDF receipt, goal progress updated |

Chips and quick replies at every step mean the user never has to type. A step progress indicator (1/7 → 7/7) is always visible. Saying "different bank" or "different tenure" loops back to that specific step without restarting the flow.

**Plain-language confirmation.** *"Aap ₹50,000, 12 mahine ke liye, Suryoday Bank mein laga rahe ho. ₹54,250 milega. 14 April 2027 ko paisa aayega. Pakka karna chahte ho?"* The user knows exactly what they are doing before they confirm.

**Two entry points into the booking flow:**
- From the Goals tab → pre-filled with the goal's recommended amount and tenure, goal context card pinned at top throughout
- From the Chat tab → free-form flow where the user picks their own parameters

**Voice input.** A mic button with a pulsing red dot supports Hindi and Bhojpuri speech via Sarvam AI or Bhashini API.

**Persistent chat history.** Every booking conversation is saved as a session accessible via the clock icon. New sessions are auto-created at the start of each booking flow.

---

### 2. Goals Tab — "Aapke Sapne"

The intelligence layer. This is where financial goals meet real account data and live FD rates to tell the user exactly when, how much, and for how long to invest.

**Account aggregation.** Connected via Setu or Finvu Account Aggregator with user consent. All bank accounts shown in one place with current balances and what each is earning. A single "total investable surplus" figure is calculated — never the full balance, always after subtracting:
- 5× monthly expenses as a mandatory emergency fund
- Committed upcoming payments from transaction history
- Already committed FD principal

The reasoning is shown in plain Hindi: *"Aapke ₹80,000 mein se ₹45,000 emergency ke liye zaroori hai, ₹12,000 agle mahine ke kharche ke liye. Sirf ₹23,000 safely FD mein laga sakte ho."*

**Four-layer money picture per goal.** Every goal card shows money in four clearly labeled states:

| Layer | What it means |
|---|---|
| **Secured (Jama Hua)** | Credited from past matured FDs. The only number in the progress bar. Foundation of the goal. |
| **Aa Raha Hai** | Locked in active FDs tagged to this goal. Shows maturity date and projected value per FD. |
| **Laga Sakte Ho** | Investable right now — matured idle FD money + safe surplus from all accounts, shown as two separate sub-lines so the user knows exactly where each rupee came from. |
| **Baaki Chahiye** | The gap that remains even after investing everything available today. Honest about what is and is not achievable. |

**Smart goal-FD projection engine.** For each goal the app calculates: if the user invests their full idle surplus today at the best available FD rate for a tenure that matures on or before the goal deadline, what is their total position at the deadline? Shown as one human sentence. Percentages above 100% are never shown — instead the user sees one of three outcomes:
- *"Goal poora ho jayega aur ₹X extra bhi bachega"*
- *"Goal poora ho jayega"*
- *"Goal ke liye ₹X aur chahiye"*

**Deadline alignment intelligence.** If any active FD matures after the goal deadline, the app flags it individually with a specific shorter-tenure suggestion — never a warning without an actionable fix.

**Three structured investment options per goal.** Instead of a single forced CTA, the user chooses:

| Option | What it uses |
|---|---|
| Sirf Matured FD Wapas Lagaein | Matured idle FD money only — lowest anxiety, money was already working |
| Matured FD + Safe Surplus | Full investable amount — maximum impact |
| Apni Marzi Se Chunein | Custom slider — live projection updates in real time as user drags |

**FD lifecycle tracking.** When an FD matures, the bank deposits principal plus interest back into savings. Nirdeshak detects this via Account Aggregator, credits the full maturity amount to the linked goal, updates the progress bar, and immediately sends a reinvestment nudge so matured money never sits idle unnoticed.

**Goals that cannot be met.** For goals where maximum investment still falls short of the deadline, Nirdeshak offers a "Deadline Badhao" option — calculates the exact new deadline at which the goal becomes achievable and lets the user update it with a single tap. The goal is achievable. Just not by this date.

**Goal status tags:**
- ✅ On Track — projected to complete by deadline
- ⚠️ At Risk — deadline close, action needed
- 🔴 Behind — needs investment or deadline extension
- 🏆 Completed — shown separately with celebration

---

### 3. FD Rates Tab — Passive Discovery

A live, sortable list of FD rates from the Blostem FD API across all available banks. Sortable by highest return or shortest tenure. Each card shows bank name, rate, available tenures, minimum deposit, and earnings on a sample ₹50,000 investment so rates are immediately meaningful. Tapping any card opens the Chat tab with that bank pre-selected — one tap from browsing to booking.

---

### 4. Notification System — The App Works Even When You Don't

A background job runs daily checking Blostem FD rates, Account Aggregator balances, goal deadlines, and FD maturity dates. Every notification is in the user's chosen language, contains a rupee amount, and has a single-tap action that goes directly to the relevant screen or starts a pre-filled booking flow.

| Trigger | Example |
|---|---|
| Idle money detected | "Aapke SBI account mein ₹18,000 pichle 45 din se pada hai. FD mein lagao toh ₹1,260 extra milega →" |
| Rate increase | "Suryoday Bank ne rate badhaya — Beti ki Shaadi goal ke liye aaj FD karein toh ₹2,340 extra milega →" |
| FD maturing in 7 days | "Aapki HDFC FD mature hone wali hai — ₹1,08,500 wapas aayega. Reinvest karein? →" |
| Goal deadline approaching | "Naya Scooter goal sirf 4 mahine door hai — ₹23,000 aaj lagaein toh poora milega →" |
| Consistent monthly surplus | "Pichle 2 mahine se ₹8,000 har mahine bach raha hai — SIP jaisi FD shuru karein? →" |

---

### 5. Post-Booking Success Screen

After every confirmed FD, a full celebratory screen shows:
- Transaction in one line: ₹3,37,250 → ₹3,81,514
- Bank, tenure, and exact maturity date
- Goal impact in plain Hindi — not a percentage, a human outcome: *"Beti ki Shaadi goal poora ho jayega aur ₹47,527 extra bhi bachega"*
- "Zaroori Updates" — the three most urgent proactive alerts surfaced immediately so financial momentum continues
- PDF receipt download
- "Goal Dekhein →" which switches to the Goals tab scrolled to the linked goal card, now showing the new active FD in the Aa Raha Hai layer with updated projection

---

### 6. True Multilingual Support

Language selected once, synced globally via React Context across every tab, card, button, toast, and notification — no English fallbacks anywhere.

| Code | Language | Script | Region |
|---|---|---|---|
| हि | Hindi | Devanagari | Pan-India |
| Bho | Bhojpuri | Devanagari | UP, Bihar, Jharkhand |
| বাং | Bengali | Bengali | West Bengal |

---

### 7. PDF Receipt Generation

After a successful booking, a properly formatted PDF receipt is generated with investor name, bank, principal, interest rate, tenure, maturity date, and projected maturity amount — powered by `pdf-lib`, fully self-hosted, no third-party service.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 6 |
| Styling | Tailwind CSS v4, Radix UI |
| State | React Context (LanguageContext), local useState |
| Animations | Framer Motion, canvas-confetti |
| Backend | Node.js + Express (ESM) |
| Database | In-memory (resets on server restart) |
| PDF | pdf-lib |
| AI / Conversational Layer | Claude API |
| FD Rates + Booking | Blostem FD API |
| Bank Account Data | Setu / Finvu Account Aggregator |
| Voice Input | Sarvam AI / Bhashini API |
| Push Notifications | Firebase Cloud Messaging |
| Icons | Lucide React |
| Charts | Recharts |

---

## Project Structure

```
nirdeshak/
├── server.mjs                        # Express API server (port 3001)
├── index.html                        # Vite entry point
├── src/
│   ├── main.tsx                      # App root — LanguageProvider + ErrorBoundary
│   └── app/
│       ├── App.tsx                   # Root — tab routing, state, API calls
│       ├── lib/
│       │   ├── types.ts              # Shared TypeScript interfaces
│       │   ├── api.ts                # API client functions
│       │   ├── LanguageContext.tsx   # Global language state
│       │   └── i18n.ts              # Translation strings
│       ├── utils/
│       │   └── format.ts            # formatIndianRupee, calculateMaturityAmount
│       └── components/
│           ├── tabs/
│           │   ├── chat-tab-v2.tsx  # Chat tab — booking state machine
│           │   ├── goals-tab.tsx    # Goals tracking + investment planning
│           │   └── fd-rates-tab.tsx # FD rate comparison
│           ├── chat/
│           │   ├── chat-bubble.tsx
│           │   ├── quick-reply-chips.tsx
│           │   ├── fd-recommendation-card.tsx
│           │   ├── source-confirmation-card.tsx
│           │   ├── fd-summary-card.tsx
│           │   ├── fd-booking-success-card.tsx
│           │   ├── step-counter.tsx
│           │   ├── jargon-tooltip.tsx
│           │   └── typing-indicator.tsx
│           ├── notifications.tsx
│           └── ErrorBoundary.tsx
```

---

## Getting Started

### Prerequisites
- Node.js v18 or above
- npm

### 1. Install dependencies
```bash
npm install
```

### 2. Start the backend API server
```bash
npm start
# API server listening on http://localhost:3001
```

### 3. Start the frontend dev server
```bash
npm run dev
# Open http://localhost:5173
```

### 4. Build for production
```bash
npm run build
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user` | Get user profile |
| GET | `/api/goals` | Get all goals with linked FDs |
| GET | `/api/surplus` | Get idle money analysis |
| GET | `/api/notifications` | Get all notifications |
| POST | `/api/notifications/:id/read` | Mark notification as read |
| POST | `/api/goals/:goalId/fds` | Book a new FD under a goal |
| PATCH | `/api/goals/:goalId/deadline` | Update a goal's deadline |
| POST | `/api/chat/sessions` | Create a new chat session |
| GET | `/api/chat/sessions` | List all chat sessions |
| GET | `/api/chat/sessions/:id` | Get session with messages |
| POST | `/api/chat/sessions/:id/messages` | Append messages to a session |
| GET | `/api/receipt/:fdId` | Download PDF receipt |

---

## Demo User — Ramesh

The app ships with pre-loaded data demonstrating every feature and every goal state.

**Accounts:**

| Bank | Type | Balance |
|---|---|---|
| SBI | Savings | ₹2,45,000 |
| HDFC Bank | FD | ₹1,80,000 |
| ICICI Bank | Savings | ₹1,25,000 |

**Goals:**

| Goal | Target | Saved | Status |
|---|---|---|---|
| बेटी की शादी 💍 | ₹5,00,000 | ₹2,55,000 | ✅ On Track |
| नया स्कूटर 🛵 | ₹85,000 | ₹48,500 | ⚠️ At Risk |
| घर का रेनोवेशन 🏠 | ₹3,00,000 | ₹60,000 | 🔴 Behind |
| बेटे की पढ़ाई 📚 | ₹8,00,000 | ₹1,25,000 | 🔴 Behind |

---

## Who This Is For

Nirdeshak is built for the 300 million+ Indians in Tier 2 and Tier 3 cities who have savings accounts, know about FDs, but have never booked one — because the process felt too complicated, too English, and too risky to get wrong.

A school teacher in Gorakhpur saving for her daughter's wedding. A small shop owner in Patna building toward a new scooter. A government employee in Ranchi trying to renovate his home.

For these users every rupee matters and every financial decision carries emotional weight. The right tool does not just show them information — it earns their trust, speaks their language, watches their money, and tells them exactly what to do.

**That is Nirdeshak.**

---

## Hackathon Track

**Track 01 — Blostem AI Builder Hackathon 2026**

Nirdeshak directly addresses all three judging themes: multilingual accessibility for underserved users, intelligent FD discovery and comparison, and end-to-end booking via Blostem FD API — unified into a single proactive, goal-linked, conversational experience that works for the user even when they are not actively using it.

---

*"Nirdeshak — Samjhao, Sikao, Invest Karo."*
