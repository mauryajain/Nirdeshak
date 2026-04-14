You are a senior product designer and frontend engineer. Build a complete, production-ready mobile-first React app called Nirdeshak — a conversational FD advisor for Tier 2/3 Indian users.

Core philosophy
This is not a banking app. It is a trust-first, Hindi-first financial co-pilot. The user is from a small city, has low financial confidence, and makes emotional decisions about money. Every design choice must reduce fear and build confidence. The app should feel like a helpful friend who understands money — not a bank portal.
The entire experience is conversational. Nothing is form-based. Every interaction happens through chat.

Tech stack
React with Next.js, Tailwind CSS, component-based architecture, dummy data only, no backend required.

App structure
Single mobile container (max-width 390px, centered on desktop with a neutral outer background). Bottom tab navigation with three tabs: Chat, FD Rates, Goals. Chat is the default tab.

Tab 1 — Chat
A WhatsApp-style chat interface. This is the entire product experience.
Shell: Fixed top bar with app name, language toggle (हि / Bho / বাং), and profile icon. Scrollable chat area in the middle. Fixed input bar at the bottom with a text field and a mic button.
Onboarding flow: The AI opens with three sequential questions rendered as chat bubbles — how much money the user has, when they need it, and whether they might need it urgently. Each question comes with selectable quick-reply chips so the user never has to type. Only after all three answers does the AI proceed.
Inline jargon tooltips: When the AI mentions a financial term, render it with a subtle underline. Tapping it expands an inline tooltip with a plain Hindi explanation. Example: "8.5% p.a." expands to "matlab har saal ₹8.50 milega har ₹100 pe."
Idle money alert card: An amber card that appears inline in the chat. Shows the idle amount, the current earnings at savings rate, and the extra amount achievable via FD — in rupees. A single CTA button at the bottom of the card.
FD comparison cards: Three cards rendered inline in the chat, stacked vertically. Each shows bank name, tenure, and maturity amount prominently. The best option has a distinct highlighted border and a "Sabse Behtar" badge. Below the other two cards show the rupee difference versus the best option.
Risk warning: If the user indicated possible early need, render a soft warning card in the chat in plain Hindi showing the penalty amount in rupees and a suggestion for shorter tenor or laddering.
FD laddering card: A visual showing the user's money split across three FDs — 6 months, 1 year, 2 years — with the maturity amount for each shown clearly.
Booking flow: Seven steps that feel like natural conversation, not a form. Each step is a bot message asking one thing, with the user responding via chips or short text. Show a subtle step counter (e.g. "Step 3 of 7") at the top of the chat area during booking. Steps are: confirm amount, confirm tenure with exact maturity date in plain Hindi, KYC document check, full summary card, final yes/no, loading state while API call happens, success screen.
Success screen: Rendered as a bold chat card. Shows the full transaction summary in one Hindi sentence, the exact maturity date, and the maturity amount large and prominent.
Voice input: The mic button shows a pulsing red dot animation while recording. On completion it populates the text field.

Tab 2 — FD Rates
A passive browsing screen. No chat here.
A scrollable list of FD cards. Each card shows bank name, interest rate, available tenures, and a maturity preview calculated for a default amount of ₹50,000. Two sort options at the top: highest return and shortest tenure. Tapping any card switches to the Chat tab and starts a pre-filled booking flow for that FD — do not open a detail modal.

Tab 3 — Goals
The intelligence layer. Two sections stacked vertically.
Accounts section: Shows all connected bank accounts as a horizontal scroll of small cards. Each card shows the bank name, current balance, and what it is currently earning (e.g. "3% savings rate" or "FD at 7.5%"). A subtle total idle money figure is shown above the row.
Goals section: Each goal is a card showing the goal name, target amount, deadline, and a progress bar. Below the progress bar is the smart recommendation — a highlighted insight block that tells the user in one Hindi sentence exactly how much they would get if they invested today toward this goal, and what percentage of the goal that covers. If the available FD tenure would cause maturity after the goal deadline, show a deadline mismatch warning with a suggestion for a shorter tenor. Each goal card ends with a single CTA button that switches to Chat with a pre-filled flow for that goal.

Notifications (in-app preview only)
Build a notification center accessible from the top bar. Show a list of notification cards in Hindi. Each notification must contain a rupee value and a single-tap CTA. Include these types: idle money alert, rate increase alert, goal deadline warning, FD maturity reminder. These are UI only — no actual push implementation needed.

Design language
Warm and human, not corporate. Soft off-white background, not pure white. One primary color (your choice of a trustworthy green or blue), amber for alerts, green for success. Rounded cards with soft shadows. Large readable font sizes throughout. No dense text anywhere. Chat bubbles exactly like WhatsApp in shape and behavior. Quick-reply chips are pill-shaped and tappable. All amounts in Indian rupee format with comma separators (₹1,23,000).

Dummy data
Include realistic dummy data for: three connected bank accounts with varying balances, four saved goals at different progress levels, eight FD options across different banks and tenures, a full pre-written chat conversation demonstrating the complete onboarding to booking flow, and five notification examples.

What to avoid
No complex charts or graphs. No multi-column dashboards. No tables. No forms outside the chat flow. No English financial jargon without immediate Hindi explanation. No feature that requires the user to navigate away from chat to complete a transaction.