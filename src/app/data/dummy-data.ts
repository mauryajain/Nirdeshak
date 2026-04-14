export interface BankAccount {
  id: string;
  bankName: string;
  balance: number;
  earningRate: number;
  type: 'savings' | 'fd';
}

export interface ActiveFD {
  bankName: string;
  amount: number;
  maturityDate: Date;
  maturityAmount: number;
  tenure?: number;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  jamaHua: number; // Total maturity payouts credited to this goal
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  activeFDs: ActiveFD[]; // Currently running FDs
  idleMaturedMoney: number; // Matured FD money sitting in savings
  completedAt?: Date | null;
  actionCTA?: string; // Specific action to fix the problem
}

export interface FDOption {
  id: string;
  bankName: string;
  interestRate: number;
  tenures: number[];
  minAmount: number;
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  cardType?: 'idle-alert' | 'fd-comparison' | 'risk-warning' | 'laddering' | 'success';
  cardData?: any;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  amount: number;
  cta: string;
  timestamp: Date;
  type: 'idle' | 'rate-increase' | 'deadline' | 'maturity';
}

export const bankAccounts: BankAccount[] = [
  {
    id: '1',
    bankName: 'SBI',
    balance: 245000,
    earningRate: 3.0,
    type: 'savings',
  },
  {
    id: '2',
    bankName: 'HDFC Bank',
    balance: 180000,
    earningRate: 7.5,
    type: 'fd',
  },
  {
    id: '3',
    bankName: 'ICICI Bank',
    balance: 125000,
    earningRate: 3.5,
    type: 'savings',
  },
];

export const goals: Goal[] = [
  {
    id: '1',
    name: 'बेटी की शादी',
    icon: '💍',
    targetAmount: 500000,
    jamaHua: 255000, // Total credited from matured FDs
    deadline: new Date('2027-12-15'),
    status: 'on-track',
    activeFDs: [
      {
        bankName: 'HDFC Bank',
        amount: 100000,
        maturityDate: new Date('2026-10-15'),
        maturityAmount: 107500,
      },
    ],
    idleMaturedMoney: 54250, // Last FD matured, sitting in savings
    actionCTA: '₹54,250 दोबारा लगाएं →',
  },
  {
    id: '2',
    name: 'नया स्कूटर',
    icon: '🛵',
    targetAmount: 85000,
    jamaHua: 48500,
    deadline: new Date('2026-08-01'),
    status: 'at-risk',
    activeFDs: [
      {
        bankName: 'SBI',
        amount: 40000,
        maturityDate: new Date('2026-09-20'),
        maturityAmount: 42130,
      },
    ],
    idleMaturedMoney: 0,
    actionCTA: 'SBI FD को ठीक करो →',
  },
  {
    id: '3',
    name: 'घर का रेनोवेशन',
    icon: '🏠',
    targetAmount: 300000,
    jamaHua: 60000,
    deadline: new Date('2028-03-01'),
    status: 'behind',
    activeFDs: [],
    idleMaturedMoney: 18750, // Previous FD matured
    actionCTA: 'नई FD शुरू करें →',
  },
  {
    id: '4',
    name: 'बेटे की पढ़ाई',
    icon: '📚',
    targetAmount: 800000,
    jamaHua: 125000,
    deadline: new Date('2026-07-01'), // Very soon - only 2-3 months away
    status: 'behind',
    activeFDs: [
      {
        bankName: 'ICICI Bank',
        amount: 80000,
        maturityDate: new Date('2026-06-15'),
        maturityAmount: 82400,
      },
    ],
    idleMaturedMoney: 0,
    actionCTA: 'Deadline बढ़ाएं →',
  },
];

export const fdOptions: FDOption[] = [
  {
    id: '1',
    bankName: 'SBI',
    interestRate: 7.1,
    tenures: [6, 12, 24, 36],
    minAmount: 1000,
  },
  {
    id: '2',
    bankName: 'HDFC Bank',
    interestRate: 7.5,
    tenures: [6, 12, 18, 24, 36],
    minAmount: 5000,
  },
  {
    id: '3',
    bankName: 'ICICI Bank',
    interestRate: 7.3,
    tenures: [6, 12, 24, 36, 60],
    minAmount: 5000,
  },
  {
    id: '4',
    bankName: 'Axis Bank',
    interestRate: 7.4,
    tenures: [12, 24, 36],
    minAmount: 5000,
  },
  {
    id: '5',
    bankName: 'Punjab National Bank',
    interestRate: 7.0,
    tenures: [6, 12, 24, 36],
    minAmount: 1000,
  },
  {
    id: '6',
    bankName: 'Bank of Baroda',
    interestRate: 6.85,
    tenures: [6, 12, 18, 24, 36],
    minAmount: 1000,
  },
  {
    id: '7',
    bankName: 'Kotak Mahindra',
    interestRate: 7.2,
    tenures: [6, 12, 24, 36],
    minAmount: 5000,
  },
  {
    id: '8',
    bankName: 'Yes Bank',
    interestRate: 7.75,
    tenures: [12, 18, 24, 36],
    minAmount: 10000,
  },
];

export const notifications: Notification[] = [
  {
    id: '1',
    title: 'FD mature हो गई!',
    message: 'आपकी HDFC की FD mature हो गई! ₹54,250 आपके "बेटी की शादी" goal में जमा हो गया। Goal अब 51% complete है। इसे वापस FD में लगाएं →',
    amount: 54250,
    cta: 'दोबारा निवेश करें',
    timestamp: new Date('2026-04-11'),
    type: 'maturity',
  },
  {
    id: '2',
    title: 'दोबारा निवेश करें',
    message: 'आपकी पिछली FD का ₹54,250 बचत खाते में बेकार पड़ा है। इसे फिर से FD में लगाकर goal तेज़ी से पूरा करें।',
    amount: 54250,
    cta: 'FD शुरू करें',
    timestamp: new Date('2026-04-10'),
    type: 'idle',
  },
  {
    id: '3',
    title: 'Goal deadline नज़दीक',
    message: 'आपका "नया स्कूटर" goal 4 महीने में है। अभी ₹23,000 FD में डालें वरना goal पूरा नहीं होगा।',
    amount: 23000,
    cta: 'तुरंत निवेश करें',
    timestamp: new Date('2026-04-09'),
    type: 'deadline',
  },
  {
    id: '4',
    title: 'ब्याज दर बढ़ी',
    message: 'Yes Bank ने FD दर 7.5% से बढ़ाकर 7.75% कर दी। आप अब हर साल ₹3,500 ज्यादा कमा सकते हैं।',
    amount: 3500,
    cta: 'नई दर देखें',
    timestamp: new Date('2026-04-07'),
    type: 'rate-increase',
  },
  {
    id: '5',
    title: 'खाली पैसा मिला',
    message: 'आपके बचत खाते में ₹23,000 safely निवेश किया जा सकता है। Emergency fund सुरक्षित रखते हुए FD में लगाएं।',
    amount: 23000,
    cta: 'FD शुरू करें',
    timestamp: new Date('2026-04-05'),
    type: 'idle',
  },
];

export const calculateMaturityAmount = (
  principal: number,
  rate: number,
  tenure: number
): number => {
  const r = rate / 100;
  const t = tenure / 12;
  const maturity = principal * (1 + r * t);
  return Math.round(maturity);
};

// Idle surplus calculation
export interface IdleSurplus {
  totalBalance: number;
  emergencyFund: number;
  upcomingExpenses: number;
  liquidityReserve: number;
  investableSurplus: number;
  reasoning: string;
}

export const calculateIdleSurplus = (accounts: BankAccount[]): IdleSurplus => {
  const savingsAccounts = accounts.filter((acc) => acc.type === 'savings');
  const totalBalance = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Estimate monthly expenses based on account activity
  const estimatedMonthlyExpenses = 15000; // Dummy estimate
  const emergencyFund = estimatedMonthlyExpenses * 5; // 5 months buffer
  const upcomingExpenses = 12000; // Detected upcoming payments
  const liquidityReserve = 0; // User didn't flag emergency risk

  const investableSurplus = Math.max(
    0,
    totalBalance - emergencyFund - upcomingExpenses - liquidityReserve
  );

  const reasoning = `आपके ₹${totalBalance.toLocaleString('en-IN')} में से ₹${emergencyFund.toLocaleString('en-IN')} emergency के लिए ज़रूरी है, ₹${upcomingExpenses.toLocaleString('en-IN')} अगले महीने के खर्चे के लिए। सिर्फ ₹${investableSurplus.toLocaleString('en-IN')} safely FD में लगा सकते हो।`;

  return {
    totalBalance,
    emergencyFund,
    upcomingExpenses,
    liquidityReserve,
    investableSurplus,
    reasoning,
  };
};