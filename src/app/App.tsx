import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BottomNav } from './components/bottom-nav';
import { ChatTab } from './components/tabs/chat-tab-v2';
import { FDRatesTab } from './components/tabs/fd-rates-tab';
import { GoalsTab } from './components/tabs/goals-tab';
import { Notifications } from './components/notifications';
import type { Goal, ActiveFD } from './lib/types';
import type { BankAccount, FDOption, FDRecord, NotificationRecord, SurplusPayload } from './lib/api';
import * as api from './lib/api';

interface SelectedInvestment {
  goalName: string;
  amount: number;
  bankName?: string;
  interestRate?: number;
  tenure?: number;
}

interface UserInfo {
  id: string;
  name: string;
  bankAccounts: BankAccount[];
}

const normalizeGoal = (raw: any): Goal => ({
  id: raw.id,
  name: raw.name,
  icon: raw.icon,
  targetAmount: raw.targetAmount,
  jamaHua: raw.jamaHua,
  deadline: new Date(raw.deadline),
  status: raw.status,
  completedAt: raw.completedAt ? new Date(raw.completedAt) : null,
  idleMaturedMoney: raw.idleMaturedMoney,
  activeFDs: raw.activeFDs.map((fd: any) => ({
    bankName: fd.bankName,
    amount: fd.amount,
    maturityDate: new Date(fd.maturityDate),
    maturityAmount: fd.maturityAmount,
    tenure: fd.tenure,
  })),
});

export default function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'rates' | 'goals'>('chat');
  const [user, setUser] = useState<UserInfo | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [surplus, setSurplus] = useState<SurplusPayload | null>(null);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<SelectedInvestment | null>(null);
  const [highlightedGoalId, setHighlightedGoalId] = useState<string | null>(null);
  const [scrollPositions, setScrollPositions] = useState({ chat: 0, rates: 0, goals: 0 });

  const refreshGoals = useCallback(async () => {
    try {
      const goalRecords = await api.getGoals();
      setGoals(goalRecords.map(normalizeGoal));
    } catch (error) {
      toast.error('Goals लोड नहीं हो पाए');
      console.error(error);
    }
  }, []);

  const refreshSurplus = useCallback(async () => {
    try {
      const nextSurplus = await api.getSurplus();
      setSurplus(nextSurplus);
    } catch (error) {
      toast.error('Surplus लोड नहीं हो पाया');
      console.error(error);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const nextNotifications = await api.getNotifications();
      setNotifications(nextNotifications);
      setUnreadCount(nextNotifications.filter((item) => !item.isRead).length);
    } catch (error) {
      toast.error('सूचनाएँ लोड नहीं हो सकीं');
      console.error(error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await api.getUser('1');
      setUser(currentUser);
    } catch (error) {
      toast.error('यूजर डेटा लोड नहीं हो पाया');
      console.error(error);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([refreshUser(), refreshGoals(), refreshSurplus(), refreshNotifications()]);
  }, [refreshGoals, refreshNotifications, refreshSurplus, refreshUser]);

  useEffect(() => {
    void refreshAll();
  }, [refreshAll]);

  const handleSelectFD = (fd: FDOption) => {
    const priorityGoal = goals.find((goal) => goal.status === 'behind' || goal.status === 'at-risk') || goals[0];
    if (!priorityGoal) {
      toast.error('कोई goal उपलब्ध नहीं है');
      return;
    }

    setSelectedInvestment({
      goalName: priorityGoal.name,
      amount: Math.max(fd.minAmount, priorityGoal.idleMaturedMoney || fd.minAmount),
      bankName: fd.bankName,
      interestRate: fd.interestRate,
      tenure: fd.tenures[0] || 12,
    });
    setActiveTab('chat');
  };

  const handleGoalCTA = (goalName: string, amount: number, bankName?: string, interestRate?: number, tenure?: number) => {
    setSelectedInvestment({ goalName, amount, bankName, interestRate, tenure });
    setActiveTab('chat');
  };

  const handleSwitchToGoals = () => {
    setActiveTab('goals');
  };

  const handleAddFD = async (goalName: string, newFD: ActiveFD): Promise<FDRecord | null> => {
    const goal = goals.find((item) => item.name === goalName);
    if (!goal) {
      toast.error('Goal नहीं मिला');
      return null;
    }

    try {
      const investedFromIdle = Math.min(goal.idleMaturedMoney, newFD.amount);
      const payload = {
        userId: '1',
        goalId: goal.id,
        bankName: newFD.bankName,
        amount: newFD.amount,
        interestRate: newFD.interestRate || 7.5,
        tenure: newFD.tenure || 12,
        investedFromIdle,
      };
      const result = await api.createFd(payload);
      await refreshGoals();
      await refreshSurplus();
      setGoals((prevGoals) =>
        prevGoals.map((item) => (item.id === result.goal.id ? normalizeGoal(result.goal) : item))
      );
      setSurplus(result.surplus);
      toast.success('FD सफलतापूर्वक बुक किया गया');
      return result.fd;
    } catch (error) {
      toast.error('FD बुकिंग में समस्या आई');
      console.error(error);
      return null;
    }
  };

  const handleUpdateGoalDeadline = async (goalId: string, newDeadline: string) => {
    try {
      await api.updateGoal(goalId, { deadline: newDeadline });
      await refreshGoals();
      toast.success('Deadline updated');
    } catch (error) {
      toast.error('Deadline update failed');
      console.error(error);
    }
  };

  const handleNotificationCTA = async (notification: NotificationRecord) => {
    try {
      if (notification.type === 'rate-increase') {
        setActiveTab('rates');
      } else if (notification.type === 'deadline') {
        setActiveTab('goals');
      } else {
        const priorityGoal = goals.find((goal) => goal.status === 'behind' || goal.status === 'at-risk') || goals[0];
        if (priorityGoal) {
          handleGoalCTA(priorityGoal.name, notification.amount);
        }
      }

      await api.markNotificationRead(notification.id);
      setNotifications((prev) => prev.map((item) => (item.id === notification.id ? { ...item, isRead: true } : item)));
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setIsNotificationsOpen(false);
    } catch (error) {
      toast.error('कृपया दोबारा प्रयास करें');
      console.error(error);
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {/* Mobile Container */}
      <div className="relative w-full max-w-[390px] h-full bg-white shadow-2xl overflow-hidden">
        {/* Tab Content */}
        <div className="h-full">
          {activeTab === 'chat' && (
            <ChatTab
              onNotificationClick={() => setIsNotificationsOpen(true)}
              onSwitchToGoals={handleSwitchToGoals}
              onSwitchToRates={() => setActiveTab('rates')}
              onAddFD={handleAddFD}
              onGoalCTAClick={handleGoalCTA}
              goals={goals}
              selectedInvestment={selectedInvestment}
              onClearInvestment={() => setSelectedInvestment(null)}
              unreadNotifications={unreadCount}
              savedScroll={scrollPositions.chat}
              onSaveScroll={(pos) => setScrollPositions((prev) => ({ ...prev, chat: pos }))}
            />
          )}
          {activeTab === 'rates' && (
            <FDRatesTab
              onSelectFD={handleSelectFD}
              savedScroll={scrollPositions.rates}
              onSaveScroll={(pos) => setScrollPositions((prev) => ({ ...prev, rates: pos }))}
            />
          )}
          {activeTab === 'goals' && (
            <GoalsTab
              onGoalCTAClick={handleGoalCTA}
              onUpdateGoalDeadline={handleUpdateGoalDeadline}
              goals={goals}
              bankAccounts={user?.bankAccounts ?? []}
              surplus={surplus}
              highlightedGoalId={null}
              savedScroll={scrollPositions.goals}
              onSaveScroll={(pos) => setScrollPositions((prev) => ({ ...prev, goals: pos }))}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Notifications Panel */}
        <Notifications
          isOpen={isNotificationsOpen}
          notifications={notifications}
          onClose={() => setIsNotificationsOpen(false)}
          onNotificationCTA={handleNotificationCTA}
        />
      </div>
    </div>
  );
}