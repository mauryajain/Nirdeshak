export const API_BASE = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export interface BankAccount {
  id: string;
  bankName: string;
  balance: number;
  earningRate: number;
  type: 'savings' | 'fd';
}

export interface FDOption {
  id: string;
  bankName: string;
  interestRate: number;
  tenures: number[];
  minAmount: number;
}

export interface FDRecord {
  id: string;
  userId: string;
  goalId: string | null;
  bankName: string;
  amount: number;
  interestRate: number;
  tenure: number;
  maturityDate: string;
  maturityAmount: number;
  status: 'active' | 'matured' | 'credited' | 'reinvested';
  createdAt: string;
}

export interface GoalRecord {
  id: string;
  userId: string;
  name: string;
  icon: string;
  targetAmount: number;
  jamaHua: number;
  deadline: string;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  activeFDs: FDRecord[];
  idleMaturedMoney: number;
  completedAt?: string | null;
}

export interface ChatSessionSummary {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export interface ChatMessagePayload {
  id: string;
  sessionId: string;
  role: 'bot' | 'user';
  content: string;
  cardType?: string;
  cardData?: any;
  createdAt: string;
}

export interface ChatSessionDetail {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  messages: ChatMessagePayload[];
}

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  amount: number;
  cta: string;
  type: 'idle' | 'rate-increase' | 'deadline' | 'maturity';
  isRead: boolean;
  createdAt: string;
}

export interface SurplusPayload {
  totalSavings: number;
  emergencyFund: number;
  upcomingExpenses: number;
  alreadyCommittedToActiveFDs: number;
  investableSurplus: number;
  reasoning: string;
}

async function handleResponse(response: Response) {
  const text = await response.text();
  const json = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(json?.message || response.statusText || 'API error');
  }
  return json;
}

export async function getGoals() {
  const res = await fetch(`${API_BASE}/goals`);
  return handleResponse(res) as Promise<GoalRecord[]>;
}

export async function updateGoal(id: string, data: Partial<Pick<GoalRecord, 'deadline' | 'status' | 'completedAt'>>) {
  const res = await fetch(`${API_BASE}/goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res) as Promise<GoalRecord>;
}

export async function getFds() {
  const res = await fetch(`${API_BASE}/fds`);
  return handleResponse(res) as Promise<FDRecord[]>;
}

export async function getFdOptions() {
  const res = await fetch(`${API_BASE}/fd-options`);
  return handleResponse(res) as Promise<FDOption[]>;
}

export async function createFd(payload: {
  userId: string;
  goalId: string;
  bankName: string;
  amount: number;
  interestRate: number;
  tenure: number;
  investedFromIdle?: number;
}) {
  const res = await fetch(`${API_BASE}/fds`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res) as Promise<{ surplus: SurplusPayload; goal: GoalRecord; fd: FDRecord }>;
}

export async function getFd(id: string) {
  const res = await fetch(`${API_BASE}/fds/${id}`);
  return handleResponse(res) as Promise<FDRecord>;
}

export async function getReceipt(fdId: string) {
  const res = await fetch(`${API_BASE}/receipts/${fdId}/pdf`);
  if (!res.ok) {
    throw new Error(`Unable to download receipt`);
  }
  return res.blob();
}

export async function listChatSessions() {
  const res = await fetch(`${API_BASE}/chats`);
  return handleResponse(res) as Promise<ChatSessionSummary[]>;
}

export async function createChatSession(payload: {
  userId: string;
  firstUserMessage?: string;
  goalName?: string;
  amount?: number;
}) {
  const res = await fetch(`${API_BASE}/chats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse(res) as Promise<ChatSessionDetail>;
}

export async function getChatSession(id: string) {
  const res = await fetch(`${API_BASE}/chats/${id}`);
  return handleResponse(res) as Promise<ChatSessionDetail>;
}

export async function appendChatMessages(sessionId: string, messages: Array<{
  role: 'bot' | 'user';
  content: string;
  cardType?: string;
  cardData?: any;
}>) {
  const res = await fetch(`${API_BASE}/chats/${sessionId}/messages`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  return handleResponse(res) as Promise<ChatSessionDetail>;
}

export async function getSurplus() {
  const res = await fetch(`${API_BASE}/surplus`);
  return handleResponse(res) as Promise<SurplusPayload>;
}

export async function getUser(id: string) {
  const res = await fetch(`${API_BASE}/user/${id}`);
  return handleResponse(res) as Promise<{ id: string; name: string; bankAccounts: BankAccount[] }>;
}

export async function getNotifications(unreadOnly = false) {
  const query = unreadOnly ? '?unread=true' : '';
  const res = await fetch(`${API_BASE}/notifications${query}`);
  return handleResponse(res) as Promise<NotificationRecord[]>;
}

export async function markNotificationRead(notificationId: string) {
  const res = await fetch(`${API_BASE}/notifications/${notificationId}/read`, {
    method: 'PUT',
  });
  return handleResponse(res) as Promise<NotificationRecord>;
}
