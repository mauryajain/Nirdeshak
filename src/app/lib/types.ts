import type { FDRecord } from './api';

export interface ActiveFD {
  bankName: string;
  amount: number;
  maturityDate: Date;
  maturityAmount: number;
  tenure: number;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  icon: string;
  targetAmount: number;
  jamaHua: number;
  deadline: Date;
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  activeFDs: ActiveFD[];
  idleMaturedMoney: number;
  completedAt: Date | null;
}
