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
import { useLanguage } from './lib/LanguageContext';
import { formatIndianRupee } from './utils/format';

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

export default function App() {
  const { lang, language } = useLanguage();

  const normalizeGoal = useCallback((raw: any): Goal => {
    // Attempt translation of Goal names if they match server known strings
    const matchedTranslation = lang.goalNames[raw.name as keyof typeof lang.goalNames];
    
    return {
      id: raw.id,
      userId: raw.userId,
      name: matchedTranslation || raw.name,
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
    };
  }, [lang]);
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
      toast.error(language === 'हि' ? 'Goals लोड नहीं हो पाए' : language === 'Bho' ? 'लक्ष्य लोड ना हो पावल' : 'লক্ষ্য লোড হতে ব্যর্থ');
      console.error(error);
    }
  }, [normalizeGoal, language]);

  const refreshSurplus = useCallback(async () => {
    try {
      const data = await api.getSurplus();
      const localizedReasoning = lang.goalsTab.surplusReasoning(
        formatIndianRupee(data.savingsTotal),
        formatIndianRupee(data.emergencyFund),
        formatIndianRupee(data.upcomingExpenses),
        formatIndianRupee(data.investedTotal)
      );
      setSurplus({ ...data, reasoning: localizedReasoning });
    } catch (error) {
      toast.error(language === 'हि' ? 'Surplus लोड नहीं हो पाया' : language === 'Bho' ? 'Surplus लोड ना हो पावल' : 'সারপ্লাস লোড হতে ব্যর্থ');
      console.error(error);
    }
  }, [lang, language]);

  const refreshNotifications = useCallback(async () => {
    try {
      const nextNotifications = await api.getNotifications();
      setNotifications(nextNotifications);
      setUnreadCount(nextNotifications.filter((item) => !item.isRead).length);
    } catch (error) {
      toast.error(language === 'हि' ? 'सूचनाएँ लोड नहीं हो सकीं' : language === 'Bho' ? 'सूचना लोड ना हो सकल' : 'বিজ্ঞপ্তি লোড হতে ব্যর্থ');
      console.error(error);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await api.getUser('1');
      setUser(currentUser);
    } catch (error) {
      toast.error(language === 'हि' ? 'यूजर डेटा लोड नहीं हो पाया' : language === 'Bho' ? 'यूजर डेटा लोड ना हो पावल' : 'ইউজার ডেটা লোড হতে ব্যর্থ');
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
      toast.error(language === 'हि' ? 'कोई लक्ष्य उपलब्ध नहीं है' : language === 'Bho' ? 'कवनो लक्ष्य नईखे' : 'কোনো লক্ষ্য উপলব্ধ নেই');
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
      toast.error(language === 'हि' ? 'Goal नहीं मिला' : language === 'Bho' ? 'लक्ष्य ना मिलल' : 'লক্ষ্য পাওয়া যায়নি');
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
      
      const nextSurplus = result.surplus;
      const localizedReasoning = lang.goalsTab.surplusReasoning(
        formatIndianRupee(nextSurplus.savingsTotal),
        formatIndianRupee(nextSurplus.emergencyFund),
        formatIndianRupee(nextSurplus.upcomingExpenses),
        formatIndianRupee(nextSurplus.investedTotal)
      );
      setSurplus({ ...nextSurplus, reasoning: localizedReasoning });

      toast.success(language === 'हि' ? 'FD सफलतापूर्वक बुक किया गया' : language === 'Bho' ? 'FD सफलतापूर्वक बुक हो गइल' : 'FD সফলভাবে বুক করা হয়েছে');
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
      toast.success(language === 'हि' ? 'तारीख अपडेट हो गई' : language === 'Bho' ? 'तारीख अपडेट हो गइल' : 'সময়সীমা আপডেট করা হয়েছে');
    } catch (error) {
      toast.error(language === 'हि' ? 'अपडेट फेल हो गया' : language === 'Bho' ? 'अपडेट फेल हो गइल' : 'আপডেট ব্যর্থ হয়েছে');
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
      toast.error(language === 'हि' ? 'कृपया दोबारा प्रयास करें' : language === 'Bho' ? 'कृपया दोबारा कोशिश करीं' : 'অনুগ্রহ করে আবার চেষ্টা করুন');
      console.error(error);
    }
  };

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {/* Mobile Container */}
      <div className="relative w-full max-w-[390px] h-full bg-white shadow-2xl overflow-hidden">
        {/* Tab Content */}
        <div className="h-full pb-16">
          {activeTab === 'chat' && (
            <ChatTab
              onNotificationClick={() => setIsNotificationsOpen(true)}
              onSwitchToGoals={handleSwitchToGoals}
              onSwitchToRates={() => setActiveTab('rates')}
              onAddFD={handleAddFD}
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
            <>
              {/* BUG B6 FIX: was hardcoded as null — state was never passed down, feature always disabled */}
              <GoalsTab
                onGoalCTAClick={handleGoalCTA}
                onUpdateGoalDeadline={handleUpdateGoalDeadline}
                goals={goals}
                bankAccounts={user?.bankAccounts ?? []}
                surplus={surplus}
                highlightedGoalId={highlightedGoalId}
                savedScroll={scrollPositions.goals}
                onSaveScroll={(pos) => setScrollPositions((prev) => ({ ...prev, goals: pos }))}
              />
            </>
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