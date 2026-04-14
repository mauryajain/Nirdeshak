# 🏦 Nirdeshak — निर्देशक

> *Your trusted, Hindi-first Fixed Deposit investment advisor for Bharat.*

Nirdeshak (meaning "guide" in Hindi) is a full-stack conversational financial advisor PWA built for Tier 2/3 Indian users. It simplifies Fixed Deposit (FD) investing through a friendly, chat-based interface available in **Hindi (हि)**, **Bhojpuri (Bho)**, and **Bengali (বাং)** — no English jargon required.

---

## ✨ Features

### 💬 1. Conversational FD Booking (Chat Tab)

The heart of Nirdeshak is a **guided, chat-based FD booking experience** that feels like talking to a trusted family advisor — not filling out a bank form.

**Two entry points:**
- **From the Goals Tab** — Click "FD में लगाएं" on any goal card. The flow starts pre-filled with the goal's recommended amount and tenure, so the user barely has to think.
- **From the Chat Tab** — Click "नया FD करें" for a free-form flow where you pick your own amount and tenure from scratch.

**The 7-step booking flow:**

| Step | What happens |
|------|-------------|
| 1. Confirm Amount | Bot confirms how much you want to invest |
| 2. Suggest Tenure | Recommends a tenure based on your goal deadline; you can accept or enter a custom one |
| 3. FD Recommendation | Shows a rich card: bank name, interest rate, maturity amount & maturity date |
| 4. Source Confirmation | Breaks down exactly which accounts (savings + matured FDs) the money will come from |
| 5. KYC Check | Confirms Aadhaar + PAN are ready before proceeding |
| 6. Summary | Full pre-booking summary with goal impact projection (how % complete your goal becomes) |
| 7. Success 🎉 | FD is confirmed — confetti animation plays, maturity value shown, PDF receipt available |

**Chips & quick replies:** Every step shows clickable chip buttons so users never have to type — they just tap. Manual text input is also supported.

**Step progress indicator:** A numbered progress bar (1/7 → 7/7) is visible during the flow so users always know where they are.

**Jargon tooltips:** Financial terms like *p.a.* appear with an underline — hovering/tapping explains them in plain Hindi. Users never need to Google a banking term.

**State machine:** Each step is powered by a robust string-based state machine (`bookingStep`). Every step handles both affirmative and alternative responses — the flow never gets stuck or hits a dead end. Saying "different tenure" loops you back to tenure selection; saying "different bank" gracefully acknowledges and continues.

---

### 🎯 2. Goal-Based Financial Tracking (Goals Tab)

Users see all their financial goals on a single screen, each with deep real-time analysis.

**Per-goal breakdown:**
- 📊 **Circular progress bar** showing % of the target amount achieved
- 💸 **4-layer wealth stack** — a clear breakdown of where the money stands:
  1. Already saved (जमा हुआ)
  2. Active FDs that will mature before the deadline
  3. Idle matured FD money sitting unused in savings
  4. Safe investable surplus (after emergency fund deduction)
- 🏦 **Active FD cards** for each linked FD — shows bank name, principal amount, tenure, maturity date, and projected maturity amount
- 📅 **Goal deadline** prominently shown

**Smart projection engine:**
Every goal card shows a live projection: *"If you invest ₹X today at 7.5% for Y months, you'll have ₹Z on your deadline — covering 87% of your goal."* If it still falls short, it tells you exactly how much extra per month you'd need.

**Late FD warnings ⚠️:**
If a linked FD's maturity date falls *after* your goal deadline, the app highlights it with an orange warning card: "This FD matures after your deadline — choose a shorter tenure."

**Unachievable goal detection:**
If investing *everything* available still can't reach your target by the deadline, a red card appears honestly saying the goal won't be met — along with the exact shortfall.

**3 investment options per goal:**
| Option | What it uses | Best for |
|--------|-------------|---------|
| Option 1 | Matured FD money only | Safest — uses existing idle FD corpus |
| Option 2 | Matured FD + safe surplus | Balanced — adds savings above emergency fund |
| Option 3 | Full available surplus | Maximum growth — invests everything safe |

Tapping an option pre-fills the amount in the FD booking flow and jumps to the chat.

**Deadline extension slider:**
For goals that can't be achieved before their current deadline even with full investment, an interactive **slider** lets users drag the deadline forward and see exactly how much more achievable it becomes with extra time.

**Investable surplus calculation:**
Before showing what you can invest, the app automatically reserves:
- **5× monthly expenses** as your emergency fund (~₹75,000)
- **Upcoming committed expenses** (~₹12,000)
- **Already committed FD principal**

Only *truly free money* is shown as investable — the app never puts your financial safety at risk.

**Goal status tags:**
- ✅ **On Track** — projected to complete by deadline with current FDs
- ⚠️ **At Risk** — deadline close, needs immediate action
- 🔴 **Behind** — needs extra investment or a deadline extension
- 🏆 **Completed** — shown in a separate section with a completion celebration

---

### 📈 3. FD Rates Comparison (FD Rates Tab)

A clean, card-based view of live FD interest rates across multiple Indian banks:

- **Sortable** by highest interest rate or shortest available tenure
- Each card shows: bank name, interest rate %, available tenures, and the **earnings on a sample ₹50,000 investment over 12 months** — so rates are instantly meaningful
- Minimum deposit amount displayed per bank
- Clicking any FD card takes you directly into the booking chat with that bank pre-selected

---

### 🔔 4. Smart Proactive Notifications

Nirdeshak doesn't wait for you to act — it nudges you proactively when something needs attention:

| Notification Type | Example |
|------------------|----|
| **FD Maturity** | "Your HDFC FD has matured! ₹54,250 is now in your savings — reinvest it" |
| **Idle Money Alert** | "₹54,250 has been sitting idle for 5 days — put it back to work" |
| **Deadline Warning** | "Your नया स्कूटर goal is just 4 months away — invest ₹23,000 now to stay on track" |
| **Rate Increase** | "Yes Bank raised FD rates to 7.75% — you could earn ₹3,500 more per year" |

All notifications are accessible via the **bell 🔔 icon** in the Chat tab header. An unread count badge shows pending actions. Tapping a notification's CTA links directly to the relevant action (e.g., open FD booking for the matured amount).

---

### 🌐 5. True Multilingual Support

Nirdeshak is built **language-first** for users who are more comfortable in their mother tongue:

| Code | Language | Script | Region |
|------|----------|--------|--------|
| `हि` | Hindi | Devanagari | Pan-India |
| `Bho` | Bhojpuri | Devanagari | UP, Bihar, Jharkhand |
| `বাং` | Bengali | Bengali script | West Bengal, Bangladesh |

Language is selected via the globe 🌐 icon in the Chat tab header. It's stored in `localStorage` and synced globally using **React Context** (`LanguageContext`) — switching language instantly updates **every tab, every card, every toast, every button label** across the entire app without a reload. No partial translations, no English fallbacks.

---

### 💾 6. Persistent Chat History

- Every FD booking conversation is automatically saved as a **chat session** in the backend
- Sessions are listed with title and message count via the **clock icon 🕐** in the Chat tab header
- You can open and review any past conversation (read-only mode, clearly labelled)
- New sessions are auto-created at the start of each booking flow — no user action needed

---

### 🧾 7. PDF Receipt Generation

After a successful FD booking, the success card shows a **"Download Receipt"** button:
- Generates a properly formatted PDF with: investor name, bank, principal, interest rate, tenure, maturity date, and projected maturity amount
- Powered by `pdf-lib` on the backend — fully self-hosted, no third-party PDF service
- Available for every FD ID via `/api/receipt/:fdId`

---

### 🏦 8. Connected Bank Accounts View (Goals Tab)

At the top of the Goals tab, users see a snapshot of all linked accounts:
- Savings accounts (SBI, ICICI) with current balances
- FD accounts listed separately
- **Total investable surplus** displayed in large text with a plain-language explanation: *"After keeping ₹75,000 for emergencies and ₹12,000 for upcoming expenses, you can safely invest ₹X."*

---

### 🛡️ 9. Resilient Error Handling

- **ErrorBoundary** component wraps the entire app — one component crashing doesn't take down the whole screen
- Backend API failures show friendly toast notifications in the user's chosen language
- If the backend is unreachable, the Goals tab falls back to calculating surplus directly from bank account data
- The FD booking flow has explicit handlers for every possible user response — it can never hang on an unrecognized chip click

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 6 |
| **Styling** | Tailwind CSS v4, Radix UI primitives |
| **State** | React Context (`LanguageContext`), local `useState` |
| **Animations** | Motion (Framer), canvas-confetti |
| **Backend** | Node.js + Express (ESM, `server.mjs`) |
| **Database** | In-memory (goals, FDs, notifications, chat sessions stored as JS arrays at runtime) |
| **PDF** | pdf-lib |
| **Toasts** | Sonner |
| **Icons** | Lucide React, MUI Icons |
| **Charts** | Recharts |

---

## 📁 Project Structure

```
lasttt/
├── server.mjs                  # Express API server (port 3001)
├── index.html                  # Vite entry point
├── src/
│   ├── main.tsx                # App root — wraps with LanguageProvider & ErrorBoundary
│   ├── styles/index.css        # Global styles
│   └── app/
│       ├── App.tsx             # Root component — tab routing, state, API calls
│       ├── lib/
│       │   ├── types.ts        # Shared TypeScript interfaces (Goal, ActiveFD, etc.)
│       │   ├── api.ts          # API client functions (fetch wrappers for backend)
│       │   ├── LanguageContext.tsx  # Global language state (हि / Bho / বাং)
│       │   └── i18n.ts         # Translation strings
│       ├── utils/
│       │   └── format.ts       # formatIndianRupee, calculateMaturityAmount, formatDate
│       ├── data/               # Static seed data (bank rates etc.)
│       └── components/
│           ├── tabs/
│           │   ├── chat-tab-v2.tsx    # Main chat tab — booking state machine
│           │   ├── goals-tab.tsx      # Goals tracking & investment planning
│           │   └── fd-rates-tab.tsx   # FD rate comparison tab
│           ├── chat/
│           │   ├── chat-bubble.tsx            # Message bubble (user/bot)
│           │   ├── quick-reply-chips.tsx      # Clickable option chips
│           │   ├── quick-action-pills.tsx     # Homepage action buttons
│           │   ├── greeting-card.tsx          # Welcome card with idle money
│           │   ├── context-card.tsx           # Active booking context banner
│           │   ├── fd-recommendation-card.tsx # FD option card
│           │   ├── source-confirmation-card.tsx
│           │   ├── fd-summary-card.tsx        # Pre-booking summary
│           │   ├── fd-booking-success-card.tsx # Success + confetti + receipt
│           │   ├── step-counter.tsx           # Progress indicator (1–7)
│           │   ├── jargon-tooltip.tsx         # Inline financial term explainer
│           │   └── typing-indicator.tsx       # Animated "bot is typing"
│           ├── bottom-nav.tsx          # Tab navigation bar
│           ├── notifications.tsx       # Notification panel
│           └── ErrorBoundary.tsx
```

---

## 🔄 FD Booking Flow — State Machine

The chat tab uses a string-based state machine (`bookingStep`) to drive the conversation:

```
idle
  │
  ├─ [Goals tab CTA] ──→ confirm-amount → suggest-tenure ─┐
  │                                                        │
  └─ [Chat "नया FD"] → ask-amount-free → ask-tenure-free ─┤
                                                           │
                                                    show-fd-option
                                                           │
                                                    confirm-source
                                                           │
                                                       kyc-check
                                                           │
                                                     show-summary
                                                           │
                                                       processing
                                                           │
                                                        success
```

At **every step**, both affirmative and alternative responses are handled — no dead ends.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or above
- **npm** (comes with Node.js)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Backend API Server

The backend runs on **port 3001** and serves goals, FDs, notifications, chat sessions, and PDF receipts.

```bash
npm start
```

You should see:
```
API server listening on http://localhost:3001
```

> ⚠️ If you get `EADDRINUSE` error, another process is already using port 3001. Run:
> ```bash
> # Windows
> netstat -ano | findstr "LISTENING" | findstr ":3001"
> taskkill /PID <PID> /F
> ```

### 3. Start the Frontend Dev Server

Open a **second terminal** and run:

```bash
npm run dev
```

Vite will start on **port 5173** (or the next available port if 5173 is busy):
```
VITE v6.3.5  ready in 566ms
➜  Local: http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Serve it with any static file server.

---

## 🌐 API Endpoints (port 3001)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/user` | Get user profile |
| `GET` | `/api/goals` | Get all goals with linked FDs |
| `GET` | `/api/surplus` | Get idle money analysis |
| `GET` | `/api/notifications` | Get all notifications |
| `POST` | `/api/notifications/:id/read` | Mark notification as read |
| `POST` | `/api/goals/:goalId/fds` | Book a new FD under a goal |
| `PATCH` | `/api/goals/:goalId/deadline` | Update a goal's deadline |
| `POST` | `/api/chat/sessions` | Create a new chat session |
| `GET` | `/api/chat/sessions` | List all chat sessions |
| `GET` | `/api/chat/sessions/:id` | Get a session with messages |
| `POST` | `/api/chat/sessions/:id/messages` | Append messages to a session |
| `GET` | `/api/receipt/:fdId` | Download PDF receipt for an FD |

> **Note:** The backend uses in-memory storage. Data resets every time `npm start` is run.

---

## 🎨 Design Principles

- **Trust-first**: Conversational tone, no intimidating financial jargon (terms explained via tooltips)
- **Mobile-first**: Fixed 390px max-width phone shell layout
- **Vernacular-native**: Every string localized — no English-only fallbacks
- **Progressive disclosure**: Information revealed step-by-step, never overwhelming

---

## 👤 Demo User

The app ships with a pre-loaded demo user **Ramesh** and his financial data:

| Account | Bank | Balance |
|---------|------|---------|
| Savings | SBI | ₹2,45,000 |
| FD | HDFC Bank | ₹1,80,000 |
| Savings | ICICI Bank | ₹1,25,000 |

| Goal | Target | Saved | Status |
|------|--------|-------|--------|
| बेटी की शादी 💍 | ₹5,00,000 | ₹2,55,000 | On Track ✅ |
| नया स्कूटर 🛵 | ₹85,000 | ₹48,500 | At Risk ⚠️ |
| घर का रेनोवेशन 🏠 | ₹3,00,000 | ₹60,000 | Behind 🔴 |
| बेटे की पढ़ाई 📚 | ₹8,00,000 | ₹1,25,000 | Behind 🔴 |

---

## 📄 License

Private project. All rights reserved.