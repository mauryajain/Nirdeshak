import express from 'express';
import cors from 'cors';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Allow all ports since Vite may run on 5174 or others
app.use(express.json());

const now = new Date().toISOString();

const user = {
  id: '1',
  name: 'Ramesh',
  createdAt: now,
};

const bankAccounts = [
  { id: '1', userId: '1', bankName: 'SBI', balance: 245000, earningRate: 3.0, type: 'savings' },
  { id: '2', userId: '1', bankName: 'HDFC Bank', balance: 180000, earningRate: 7.5, type: 'fd' },
  { id: '3', userId: '1', bankName: 'ICICI Bank', balance: 125000, earningRate: 3.5, type: 'savings' },
];

const goals = [
  { id: '1', userId: '1', name: 'बेटी की शादी', icon: '💍', targetAmount: 500000, jamaHua: 255000, deadline: '2027-12-15T00:00:00.000Z', status: 'on-track', idleMaturedMoney: 54250, completedAt: null },
  { id: '2', userId: '1', name: 'नया स्कूटर', icon: '🛵', targetAmount: 85000, jamaHua: 48500, deadline: '2026-08-01T00:00:00.000Z', status: 'at-risk', idleMaturedMoney: 0, completedAt: null },
  { id: '3', userId: '1', name: 'घर का रेनोवेशन', icon: '🏠', targetAmount: 300000, jamaHua: 60000, deadline: '2028-03-01T00:00:00.000Z', status: 'behind', idleMaturedMoney: 18750, completedAt: null },
  { id: '4', userId: '1', name: 'बेटे की पढ़ाई', icon: '📚', targetAmount: 800000, jamaHua: 125000, deadline: '2026-07-01T00:00:00.000Z', status: 'behind', idleMaturedMoney: 0, completedAt: null },
];

const fds = [
  { id: '1', userId: '1', goalId: '1', bankName: 'HDFC Bank', amount: 100000, interestRate: 7.5, tenure: 24, maturityDate: '2026-10-15T00:00:00.000Z', maturityAmount: 107500, status: 'active', createdAt: now },
  { id: '2', userId: '1', goalId: '2', bankName: 'SBI', amount: 40000, interestRate: 7.1, tenure: 24, maturityDate: '2026-09-20T00:00:00.000Z', maturityAmount: 42130, status: 'active', createdAt: now },
  { id: '3', userId: '1', goalId: '4', bankName: 'ICICI Bank', amount: 80000, interestRate: 7.3, tenure: 10, maturityDate: '2026-06-15T00:00:00.000Z', maturityAmount: 82400, status: 'active', createdAt: now },
];

const notifications = [
  { id: '1', userId: '1', title: 'FD mature हो गई!', message: 'आपकी HDFC की FD mature हो गई! ₹54,250 आपके "बेटी की शादी" goal में जमा हो गया। Goal अब 51% complete है। इसे वापस FD में लगाएं →', amount: 54250, cta: 'दोबारा निवेश करें', type: 'maturity', isRead: false, createdAt: '2026-04-11T00:00:00.000Z' },
  { id: '2', userId: '1', title: 'दोबारा निवेश करें', message: 'आपकी पिछली FD का ₹54,250 बचत खाते में बेकार पड़ा है। इसे फिर से FD में लगाकर goal तेज़ी से पूरा करें।', amount: 54250, cta: 'FD शुरू करें', type: 'idle', isRead: false, createdAt: '2026-04-10T00:00:00.000Z' },
  { id: '3', userId: '1', title: 'Goal deadline नज़दीक', message: 'आपका "नया स्कूटर" goal 4 महीने में है। अभी ₹23,000 FD में डालें वरना goal पूरा नहीं होगा।', amount: 23000, cta: 'तुरंत निवेश करें', type: 'deadline', isRead: false, createdAt: '2026-04-09T00:00:00.000Z' },
  { id: '4', userId: '1', title: 'ब्याज दर बढ़ी', message: 'Yes Bank ने FD दर 7.5% से बढ़ाकर 7.75% कर दी। आप अब हर साल ₹3,500 ज्यादा कमा सकते हैं।', amount: 3500, cta: 'नई दर देखें', type: 'rate-increase', isRead: false, createdAt: '2026-04-07T00:00:00.000Z' },
  { id: '5', userId: '1', title: 'खाली पैसा मिला', message: 'आपके बचत खाते में ₹23,000 safely निवेश किया जा सकता है। Emergency fund सुरक्षित रखते हुए FD में लगाएं।', amount: 23000, cta: 'FD शुरू करें', type: 'idle', isRead: false, createdAt: '2026-04-05T00:00:00.000Z' },
];

const chatSessions = [];
const chatMessages = [];

const formatIndianRupee = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

const calculateMaturityAmount = (principal, rate, tenure) => {
  const r = rate / 100;
  const t = tenure / 12;
  return Math.round(principal * (1 + r * t));
};

const getSurplusPayload = () => {
  const savings = bankAccounts.filter((account) => account.type === 'savings').reduce((sum, account) => sum + account.balance, 0);
  // BUG B2 FIX: 'committed' was double-subtracting FD amounts.
  // POST /api/fds already does savingsAccount.balance -= amount, so savings already
  // excludes invested money. Subtracting committed again under-reported investableSurplus
  // by the full sum of all active FD principals.
  const emergencyFund = 15000 * 5;
  const upcomingExpenses = 12000;
  const investableSurplus = Math.max(0, savings - emergencyFund - upcomingExpenses);
  const reasoning = `आपके ${formatIndianRupee(savings)} में से ${formatIndianRupee(emergencyFund)} emergency के लिए ज़रूरी है, ${formatIndianRupee(upcomingExpenses)} अगले महीने के खर्चे के लिए। अभी सिर्फ ${formatIndianRupee(investableSurplus)} safely FD में लगा सकते हैं।`;
  return {
    totalSavings: savings,
    emergencyFund,
    upcomingExpenses,
    alreadyCommittedToActiveFDs: 0, // savings balance already accounts for committed FDs
    investableSurplus,
    reasoning,
  };
};

const getGoalData = (goalRow) => {
  const activeFDs = fds.filter((fd) => fd.goalId === goalRow.id && fd.status === 'active');
  return {
    ...goalRow,
    deadline: goalRow.deadline,
    activeFDs,
  };
};

app.get('/api/user/:id', (req, res) => {
  if (req.params.id !== user.id) {
    return res.status(404).json({ message: 'User not found' });
  }
  const accounts = bankAccounts.filter((account) => account.userId === req.params.id);
  res.json({ ...user, bankAccounts: accounts });
});

app.get('/api/goals', (req, res) => {
  res.json(goals.map(getGoalData));
});

app.put('/api/goals/:id', (req, res) => {
  const { deadline, status } = req.body;
  const goal = goals.find((goalItem) => goalItem.id === req.params.id);
  if (!goal) return res.status(404).json({ message: 'Goal not found' });
  if (deadline) goal.deadline = deadline;
  if (status) {
    goal.status = status;
    if (status === 'completed' && !goal.completedAt) {
      goal.completedAt = new Date().toISOString();
    }
  }
  res.json(getGoalData(goal));
});

app.get('/api/fds', (req, res) => {
  res.json(fds);
});

app.get('/api/fds/:id', (req, res) => {
  const fd = fds.find((item) => item.id === req.params.id);
  if (!fd) return res.status(404).json({ message: 'FD not found' });
  res.json(fd);
});

app.get('/api/fd-options', (req, res) => {
  res.json([
    { id: 'hdfc-regular', bankName: 'HDFC Bank', interestRate: 7.5, tenures: [12, 18, 24], minAmount: 25000 },
    { id: 'sbi-flexi', bankName: 'SBI', interestRate: 7.1, tenures: [12, 18, 24], minAmount: 20000 },
    { id: 'icici-turbo', bankName: 'ICICI Bank', interestRate: 7.3, tenures: [10, 12, 24], minAmount: 30000 },
    { id: 'axis-premium', bankName: 'Axis Bank', interestRate: 7.8, tenures: [12, 24], minAmount: 20000 },
  ]);
});

app.post('/api/fds', (req, res) => {
  const { userId, goalId, bankName, amount, interestRate, tenure, investedFromIdle = 0 } = req.body;
  if (!userId || !goalId || !bankName || !amount || !interestRate || !tenure) {
    return res.status(400).json({ message: 'Missing FD booking fields' });
  }
  const savingsAccount = bankAccounts
    .filter((account) => account.userId === userId && account.type === 'savings')
    .sort((a, b) => b.balance - a.balance)[0];
  if (!savingsAccount || savingsAccount.balance < amount) {
    return res.status(400).json({ message: 'Insufficient available savings' });
  }
  savingsAccount.balance -= amount;
  const fdId = `${Date.now()}`;
  const maturityAmount = calculateMaturityAmount(amount, interestRate, tenure);
  const maturityDate = new Date();
  maturityDate.setMonth(maturityDate.getMonth() + tenure);
  const fd = {
    id: fdId,
    userId,
    goalId,
    bankName,
    amount,
    interestRate,
    tenure,
    maturityDate: maturityDate.toISOString(),
    maturityAmount,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  fds.push(fd);
  const goal = goals.find((goalItem) => goalItem.id === goalId);
  if (!goal) {
    return res.status(404).json({ message: 'Goal not found' });
  }
  if (investedFromIdle > 0) {
    goal.idleMaturedMoney = Math.max(0, goal.idleMaturedMoney - investedFromIdle);
  }
  const activeFdTotal = fds.filter((activeFd) => activeFd.goalId === goalId && activeFd.status === 'active')
    .reduce((sum, activeFd) => sum + activeFd.maturityAmount, 0);
  const projectedTotal = goal.jamaHua + activeFdTotal;
  if (projectedTotal >= goal.targetAmount && goal.status !== 'completed') {
    goal.status = 'completed';
    goal.completedAt = new Date().toISOString();
  }
  res.json({ surplus: getSurplusPayload(), goal: getGoalData(goal), fd });
});

app.get('/api/receipts/:fdId/pdf', async (req, res) => {
  const fd = fds.find((item) => item.id === req.params.fdId);
  if (!fd) return res.status(404).json({ message: 'FD not found' });
  const goal = goals.find((item) => item.id === fd.goalId) || null;
  const receiptNo = `NRD-${new Date().toISOString().slice(0,10).replace(/-/g, '')}-${fd.id}`;
  const receiptFileName = `Nirdeshak_Raseed_${receiptNo}.pdf`;
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 792]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const green = rgb(0.086, 0.639, 0.329);
  page.drawRectangle({ x: 0, y: 740, width: 595, height: 52, color: green });
  page.drawText('Nirdeshak', { x: 40, y: 752, size: 22, font, color: rgb(1,1,1) });
  // BUG B1 FIX: Helvetica (WinAnsi) only supports codepoints 0-255.
  // All Devanagari strings replaced with ASCII equivalents to prevent crash.
  page.drawText('Aapka FD Salaahkaar', { x: 40, y: 734, size: 12, font, color: rgb(1,1,1) });
  page.drawText('FD Booking Receipt', { x: 210, y: 702, size: 20, font, color: green });
  // BUG B1 FIX (cont.): formatIndianRupee returns the ₹ symbol (U+20B9) which also
  // crashes WinAnsi encoding. Using a PDF-safe ASCII formatter with "INR" prefix instead.
  // Goal names are Devanagari and also cannot be rendered; showing goal ID instead.
  const formatAmountPDF = (amount) =>
    'INR ' + new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount);

  const rows = [
    ['Receipt No.', receiptNo],
    ['Date & Time', new Date(fd.createdAt).toLocaleString('en-IN')],
    ['Account Holder', user.name],
    ['Bank', fd.bankName],
    ['Principal Amount', formatAmountPDF(fd.amount)],
    ['Tenure', `${fd.tenure} months`],
    ['Interest Rate', `${fd.interestRate}% per annum`],
    ['Maturity Date', new Date(fd.maturityDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
    ['Maturity Amount', formatAmountPDF(fd.maturityAmount)],
    ['Goal ID', goal ? `Goal #${goal.id}` : '-'],
  ];
  let y = 660;
  rows.forEach(([label, value]) => {
    page.drawText(label, { x: 40, y, size: 12, font, color: rgb(0.1,0.1,0.1) });
    page.drawText(String(value), { x: 300, y, size: 12, font, color: rgb(0.06,0.06,0.06) });
    y -= 30;
  });
  // BUG B1 FIX: footer also replaced with ASCII
  page.drawText('Booked via Nirdeshak - This is a prototype receipt', { x: 40, y: 110, size: 10, font, color: rgb(0.4,0.4,0.4) });
  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${receiptFileName}"`);
  res.send(Buffer.from(pdfBytes));
});

app.get('/api/chats', (req, res) => {
  const rows = chatSessions.map((session) => ({
    ...session,
    messageCount: chatMessages.filter((message) => message.sessionId === session.id).length,
  })).sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
  res.json(rows);
});

app.post('/api/chats', (req, res) => {
  const { userId, firstUserMessage, goalName, amount } = req.body;
  const sessionId = `${Date.now()}`;
  const createdAt = new Date().toISOString();
  let title = 'नया Chat';
  if (goalName && amount) {
    title = `${goalName} ke liye FD — ${formatIndianRupee(amount)}`;
  } else if (firstUserMessage) {
    title = firstUserMessage.length > 40 ? `${firstUserMessage.slice(0, 40)}...` : firstUserMessage;
  }
  const session = { id: sessionId, userId, title, createdAt };
  chatSessions.push(session);
  res.json({ ...session, messages: [] });
});

app.get('/api/chats/:id', (req, res) => {
  const session = chatSessions.find((item) => item.id === req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  const messages = chatMessages
    .filter((message) => message.sessionId === req.params.id)
    .sort((a, b) => new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf())
    .map((message) => ({
      ...message,
      cardData: message.cardData ? JSON.parse(message.cardData) : undefined,
    }));
  res.json({ ...session, messages });
});

app.put('/api/chats/:id/messages', (req, res) => {
  const session = chatSessions.find((item) => item.id === req.params.id);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ message: 'No messages to append' });
  }
  const now = new Date().toISOString();
  messages.forEach((message) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    chatMessages.push({
      id,
      sessionId: req.params.id,
      role: message.role,
      content: message.content,
      cardType: message.cardType || null,
      cardData: message.cardData ? JSON.stringify(message.cardData) : null,
      createdAt: now,
    });
  });
  const allMessages = chatMessages
    .filter((message) => message.sessionId === req.params.id)
    .map((message) => ({
      ...message,
      cardData: message.cardData ? JSON.parse(message.cardData) : undefined,
    }));
  res.json({ ...session, messages: allMessages });
});

app.get('/api/surplus', (req, res) => {
  res.json(getSurplusPayload());
});

app.get('/api/notifications', (req, res) => {
  const unreadOnly = req.query.unread === 'true';
  const list = notifications
    .filter((note) => note.userId === '1' && (!unreadOnly || !note.isRead))
    .sort((a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf());
  res.json(list);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const notification = notifications.find((item) => item.id === req.params.id);
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  notification.isRead = true;
  res.json(notification);
});

// Serve built React frontend in production (Render / any static host)
app.use(express.static(join(__dirname, 'dist')));

// Catch-all: send index.html for any non-API route (React Router support)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
