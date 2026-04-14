import { Wallet, TrendingUp, AlertCircle, ArrowRight, Calendar, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { BankAccount, SurplusPayload } from '../../lib/api';
import type { Goal } from '../../lib/types';
import { formatIndianRupee, formatDate, calculateMaturityAmount } from '../../utils/format';
import { Progress } from '../ui/progress';
import { Slider } from '../ui/slider';
import { useLanguage } from '../../lib/LanguageContext';

interface GoalsTabProps {
  onGoalCTAClick: (goalName: string, amount: number, bankName?: string, interestRate?: number, tenure?: number) => void;
  onUpdateGoalDeadline: (goalId: string, newDeadline: string) => void;
  goals: Goal[];
  bankAccounts: BankAccount[];
  surplus: SurplusPayload | null;
  highlightedGoalId?: string | null;
  savedScroll: number;
  onSaveScroll: (position: number) => void;
}

export function GoalsTab({ onGoalCTAClick, onUpdateGoalDeadline, goals, bankAccounts, surplus, savedScroll, onSaveScroll }: GoalsTabProps) {
  const { lang, language } = useLanguage();
  const completedGoals = goals.filter((goal) => goal.status === 'completed');
  const activeGoals = goals.filter((goal) => goal.status !== 'completed');
  const savingsTotal = bankAccounts.filter((account) => account.type === 'savings').reduce((sum, account) => sum + account.balance, 0);
  const investedTotal = bankAccounts.filter((account) => account.type === 'fd').reduce((sum, account) => sum + account.balance, 0);
  const fallbackSurplus = Math.max(0, savingsTotal - 15000 * 5 - 12000 - investedTotal);
  const surplusPayload = surplus ?? {
    totalSavings: savingsTotal,
    emergencyFund: 15000 * 5,
    upcomingExpenses: 12000,
    alreadyCommittedToActiveFDs: investedTotal,
    investableSurplus: fallbackSurplus,
    reasoning: lang.goalsTab.refreshToUpdate,
  } as SurplusPayload;
  const [selectedOptions, setSelectedOptions] = useState<{ [goalId: string]: 'option1' | 'option2' | 'option3' }>({});
  const [customAmounts, setCustomAmounts] = useState<{ [goalId: string]: number }>({});
  const [extendedDeadlines, setExtendedDeadlines] = useState<{ [goalId: string]: Date }>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = savedScroll;
    }
  }, [savedScroll]);

  const handleScroll = () => {
    if (scrollRef.current) {
      onSaveScroll(scrollRef.current.scrollTop);
    }
  };

  // Helper to calculate minimum deadline for goal completion
  const calculateMinimumDeadline = (targetAmount: number, projectedTotal: number, currentDeadline: Date): Date => {
    const gap = targetAmount - projectedTotal;
    if (gap <= 0) return currentDeadline;
    
    // Estimate additional months needed based on average monthly growth
    const additionalMonthsNeeded = Math.ceil(gap / 10000); // Rough estimate
    const newDeadline = new Date(currentDeadline);
    newDeadline.setMonth(newDeadline.getMonth() + additionalMonthsNeeded + 6); // Add buffer
    return newDeadline;
  };

  return (
    <div ref={scrollRef} onScroll={handleScroll} className="h-full bg-[#fdfbf7] pb-20 overflow-y-auto">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">{lang.goalsTab.myDreams}</h2>
      </div>

      {/* Accounts Section */}
      <div className="p-4">
        <div className="mb-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border-2 border-blue-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{lang.goalsTab.investableMoney}</h3>
          <p className="text-3xl font-bold text-primary mb-3">
            {formatIndianRupee(surplusPayload.investableSurplus)}
          </p>
          <div className="bg-white/70 rounded-lg p-3">
            <p className="text-xs text-gray-700 leading-relaxed">{surplusPayload.reasoning}</p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">{lang.goalsTab.linkedAccounts}</h3>

        <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="min-w-[160px] bg-white rounded-xl p-4 border border-gray-200 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-primary/10 p-1.5 rounded-lg">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-sm text-gray-800">{account.bankName}</h4>
              </div>
              <p className="text-xs text-gray-500 mb-1">
                {account.type === 'savings' ? 'बचत खाता' : 'FD खाता'}
              </p>
              <p className="text-lg font-bold text-gray-800 mb-1">
                {formatIndianRupee(account.balance)}
              </p>
              <div className="flex items-center gap-1">
                {account.type === 'savings' ? (
                  <span className="text-xs text-orange-600 font-medium">
                    {account.earningRate}% ब्याज
                  </span>
                ) : (
                  <span className="text-xs text-green-600 font-medium">
                    {account.earningRate}% ब्याज
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {completedGoals.length > 0 && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded-3xl p-4 mb-4 border border-green-200 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-green-700">पूरा किए गए लक्ष्य</p>
                <p className="text-xs text-gray-600">आपके सफल निवेश का रिकॉर्ड</p>
              </div>
            </div>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <div key={goal.id} className="rounded-2xl border border-green-100 bg-green-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-gray-800">{goal.icon} {goal.name}</p>
                      <p className="text-xs text-gray-600">पूरा हुआ {formatDate(goal.completedAt || new Date())}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-700">{formatIndianRupee(goal.targetAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Goals Section */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{lang.goalsTab.myGoals}</h3>

        <div className="space-y-4">
          {activeGoals.map((goal) => {
            // Layer 1: Jama Hua (Secured) - already credited
            const layer1_jamaHua = goal.jamaHua;

            // Calculate projection if Layer 3 is invested
            const currentDeadline = extendedDeadlines[goal.id] || goal.deadline;

            // Layer 2: Aa Raha Hai (Incoming) - active FDs
            const layer2_incoming = goal.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0);
            // BUG B7 FIX: was using goal.deadline (original) instead of currentDeadline.
            // After user extends deadline, FDs that now land before the new date were still
            // flagged as "late" — causing a false warning card to appear.
            const lateFDs = goal.activeFDs.filter(fd => fd.maturityDate > currentDeadline);

            // Layer 3: Laga Sakte Ho (Investable)
            const layer3_maturedIdle = goal.idleMaturedMoney;
            const layer3_safeSurplus = surplusPayload.investableSurplus;
            const layer3_total = layer3_maturedIdle + layer3_safeSurplus;

            const tenureInMonths = Math.max(1, Math.round((currentDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
            const bestRate = 8.5;
            const layer3_projectedMaturity = layer3_total > 0
              ? calculateMaturityAmount(layer3_total, bestRate, tenureInMonths)
              : 0;

            // Total projected at deadline
            const totalAtDeadline = layer1_jamaHua + layer2_incoming + layer3_projectedMaturity;

            // Layer 4: Baaki Chahiye (Remaining Gap)
            const layer4_gap = Math.max(0, goal.targetAmount - totalAtDeadline);

            // Determine status based on FULL PROJECTION (not just Jama Hua)
            const isOnTrack = totalAtDeadline >= goal.targetAmount;
            const isUnachievable = layer4_gap > 0 && layer3_total === 0; // No investable money and still a gap
            // BUG B8 FIX: was named 'surplus', shadowing the outer 'surplus' SurplusPayload prop.
            // This made the code misleading: inside this .map() 'surplus' silently meant a number
            // (extra ₹ above goal) while the outer scope used it as SurplusPayload | null.
            const surplusExtra = totalAtDeadline - goal.targetAmount;

            // Progress bar shows only Layer 1
            const progress = (layer1_jamaHua / goal.targetAmount) * 100;

            // Monthly shortfall suggestion
            const monthlyShortfall = layer4_gap > 0 ? Math.ceil(layer4_gap / tenureInMonths) : 0;

            // Investment options state
            const selectedOption = selectedOptions[goal.id] || (layer3_maturedIdle > 0 ? 'option1' : 'option2');
            const customAmount = customAmounts[goal.id] || Math.max(1000, Math.floor(layer3_total / 4));

            // Calculate amounts for each option
            const option1Amount = layer3_maturedIdle;
            const option2Amount = layer3_total;
            const option3Amount = customAmount;

            // Get selected amount based on current option
            const getSelectedAmount = () => {
              if (selectedOption === 'option1') return option1Amount;
              if (selectedOption === 'option2') return option2Amount;
              return option3Amount;
            };

            const selectedAmount = getSelectedAmount();

            // Calculate projection for selected amount
            const selectedMaturity = selectedAmount > 0
              ? calculateMaturityAmount(selectedAmount, bestRate, tenureInMonths)
              : 0;
            const selectedTotalAtDeadline = layer1_jamaHua + layer2_incoming + selectedMaturity;
            const selectedGoalPercentage = Math.round((selectedTotalAtDeadline / goal.targetAmount) * 100);

            // Calculate minimum viable deadline
            const minViableDeadline = calculateMinimumDeadline(goal.targetAmount, totalAtDeadline, goal.deadline);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl p-5 shadow-md border border-gray-200"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{goal.icon}</div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-800">{goal.name}</h4>
                      <p className="text-xs text-gray-500">
                        Deadline: {formatDate(currentDeadline)}
                      </p>
                    </div>
                  </div>
                  {isUnachievable ? (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ! Nahi Hoga
                    </span>
                  ) : isOnTrack ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ✓ On Track
                    </span>
                  ) : (
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ! At Risk
                    </span>
                  )}
                </div>

                {/* Two Stat Boxes */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Target</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatIndianRupee(goal.targetAmount)}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${isUnachievable ? 'bg-red-50' : 'bg-green-50'}`}>
                    <p className="text-xs text-gray-500 mb-1">{lang.goalsTab.goalSecured}</p>
                    <p className={`text-lg font-bold ${isUnachievable ? 'text-red-700' : 'text-primary'}`}>
                      {formatIndianRupee(layer1_jamaHua)}
                    </p>
                  </div>
                </div>

                {/* Progress Bar - Layer 1 only */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">Progress ({lang.goalsTab.goalSecured})</p>
                    <p className={`text-sm font-bold ${isUnachievable ? 'text-red-700' : 'text-primary'}`}>
                      {Math.round(progress)}%
                    </p>
                  </div>
                  <Progress 
                    value={progress} 
                    className={`h-3 ${isUnachievable ? '[&>div]:bg-red-500' : ''}`}
                  />
                </div>

                {/* Money Breakdown - 4 Layers */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-4 mb-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">💰 Full Picture</p>

                  {/* Layer 1: Secured */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">✓ {lang.goalsTab.goalSecured}</span>
                    <span className="font-bold text-green-700">{formatIndianRupee(layer1_jamaHua)}</span>
                  </div>

                  {/* Layer 2: Incoming */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="text-gray-600">🔒 Aa raha hai (active FDs में)</span>
                      {goal.activeFDs.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                          {goal.activeFDs.map((fd, idx) => (
                            <div key={idx}>
                              • {fd.bankName}: {formatIndianRupee(fd.maturityAmount)} on {formatDate(fd.maturityDate)}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-blue-700">{formatIndianRupee(layer2_incoming)}</span>
                  </div>

                  {/* Layer 3: Investable */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex-1">
                      <span className="text-gray-600">💡 {lang.goalsTab.goalLagaSakte}</span>
                      <div className="text-xs text-gray-500 mt-1">
                        {layer3_maturedIdle > 0 && <div>• Matured idle: {formatIndianRupee(layer3_maturedIdle)}</div>}
                        {layer3_safeSurplus > 0 && <div>• Safe surplus: {formatIndianRupee(layer3_safeSurplus)}</div>}
                      </div>
                    </div>
                    <span className="font-bold text-amber-700">{formatIndianRupee(layer3_total)}</span>
                  </div>

                  {/* Layer 4: Remaining Gap */}
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-300">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">
                        {layer4_gap === 0 ? '✓' : '⚠️'} {lang.goalsTab.goalGap}
                      </span>
                      {layer4_gap === 0 && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                          {lang.goalsTab.goalCompletedSuccess}
                        </span>
                      )}
                    </div>
                    <span className={`font-bold ${layer4_gap === 0 ? 'text-green-700' : 'text-red-700'}`}>
                      {formatIndianRupee(layer4_gap)}
                    </span>
                  </div>
                </div>

                {/* Projection Card - Different for unachievable goals */}
                {layer3_total > 0 && !isUnachievable && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-3 border-l-4 border-blue-500">
                    <div className="flex items-start gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800 mb-1">📊 Projection</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          अगर आज <span className="font-bold">{formatIndianRupee(layer3_total)}</span>{layer3_maturedIdle > 0 && layer3_safeSurplus > 0 && (
                            <> (matured idle {formatIndianRupee(layer3_maturedIdle)} + safe surplus {formatIndianRupee(layer3_safeSurplus)})</>
                          )} को <span className="font-semibold">{bestRate}%</span> FD में <span className="font-semibold">{tenureInMonths} महीने</span> के लिए लगाएं तो <span className="font-semibold">{formatDate(currentDeadline)}</span> को <span className="font-bold text-primary">{formatIndianRupee(layer3_projectedMaturity)}</span> मिलेगा। आपका total us din <span className="font-bold text-primary">{formatIndianRupee(totalAtDeadline)}</span> होगा — जो आपके {formatIndianRupee(goal.targetAmount)} goal का <span className="font-bold">{Math.round((totalAtDeadline / goal.targetAmount) * 100)}%</span> है।
                        </p>
                        {isOnTrack ? (
                          <p className="text-sm text-green-700 font-semibold mt-2">
                            ✓ Goal पूरा हो जाएगा और <span className="font-bold">{formatIndianRupee(surplusExtra)} extra</span> भी मिलेगा!
                          </p>
                        ) : (
                          <p className="text-sm text-orange-700 font-semibold mt-2">
                            ⚠️ Still <span className="font-bold">{formatIndianRupee(layer4_gap)}</span> short. हर महीने लगभग <span className="font-bold">{formatIndianRupee(monthlyShortfall)}</span> और invest करना होगा।
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Unachievable Goal Projection */}
                {isUnachievable && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 mb-3 border-l-4 border-red-500">
                    <div className="flex items-start gap-2">
                      <X className="w-4 h-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-red-800 mb-1">⚠️ {language === 'हि' ? 'Goal नहीं होगा' : language === 'Bho' ? 'लक्ष्य ना हो पाई' : 'লক্ষ্য পূরণ হবে না'}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          Agar aaj poora <span className="font-bold">{formatIndianRupee(layer3_total)}</span> bhi FD mein lagaein toh <span className="font-semibold">{formatDate(currentDeadline)}</span> ko <span className="font-bold text-primary">{formatIndianRupee(totalAtDeadline)}</span> milega. Aapka total <span className="font-bold">{formatIndianRupee(goal.targetAmount)}</span> se <span className="font-bold text-red-700">{formatIndianRupee(layer4_gap)}</span> kam hai. Goal <span className="font-bold">{Math.round((totalAtDeadline / goal.targetAmount) * 100)}%</span> tak hi pahunch payega.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Warning for late FDs */}
                {lateFDs.length > 0 && (
                  <div className="bg-orange-50 rounded-xl p-4 mb-3 border-l-4 border-orange-500">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-800 mb-1">⚠️ {language === 'हि' ? 'समय की दिक्कत' : language === 'Bho' ? 'समय के दिक्कत' : 'সময়ের সমস্যা'}</p>
                        {lateFDs.map((fd, idx) => (
                          <p key={idx} className="text-sm text-gray-700 leading-relaxed">
                            {fd.bankName} की FD ({formatIndianRupee(fd.maturityAmount)}) आपको {formatDate(goal.deadline)} तक नहीं मिलेगी। यह {formatDate(fd.maturityDate)} को mature होगी। छोटी tenure की FD चुनें।
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Investment Options Section - Only for achievable goals with investable money */}
                {layer3_total > 0 && !isUnachievable && (
                  <div className="space-y-3 mb-4">
                    <h5 className="text-sm font-semibold text-gray-700">{language === 'हि' ? 'निवेश के विकल्प' : language === 'Bho' ? 'निवेश के विकल्प' : 'বিনিয়োগের বিকল্প'}</h5>

                    {/* Option 1: Matured FD Only - Only show if matured idle exists */}
                    {layer3_maturedIdle > 0 && (
                      <button
                        onClick={() => {
                          setSelectedOptions({ ...selectedOptions, [goal.id]: 'option1' });
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedOption === 'option1'
                            ? 'border-primary bg-green-50'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            selectedOption === 'option1' ? 'border-primary' : 'border-gray-300'
                          }`}>
                            {selectedOption === 'option1' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-gray-800">
                                {language === 'हि' ? 'सिर्फ मैच्योर FD वापस लगाएं' : language === 'Bho' ? 'सिर्फ मैच्योर FD वापस लगाईं' : 'শুধুমাত্র ম্যাচিওর হওয়া FD পুনরায় বিনিয়োগ করুন'}
                              </p>
                              <p className="font-bold text-primary">{formatIndianRupee(option1Amount)}</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {language === 'हि' ? 'सबसे आसान — पिछली FD का पैसा वापस काम पे लगाओ' : language === 'Bho' ? 'सबसे आसान — पिछला FD के पइसा वापस काम पे लगाईं' : 'সবচেয়ে সহজ — আগের FD-এর টাকা আবার কাজে লাগান'}
                            </p>
                            <div className="bg-white/60 rounded-lg p-2 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Maturity:</span>
                                <span className="font-semibold text-gray-800">
                                  {formatIndianRupee(calculateMaturityAmount(option1Amount, bestRate, tenureInMonths))}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Goal coverage:</span>
                                <span className="font-semibold text-gray-800">
                                  {Math.round(((layer1_jamaHua + layer2_incoming + calculateMaturityAmount(option1Amount, bestRate, tenureInMonths)) / goal.targetAmount) * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                                  Zero Risk
                                </span>
                                <span className="text-[10px] text-gray-500">— पहले भी FD में था</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Option 2: Matured FD + Safe Surplus */}
                    <button
                      onClick={() => {
                        setSelectedOptions({ ...selectedOptions, [goal.id]: 'option2' });
                      }}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selectedOption === 'option2'
                          ? 'border-primary bg-green-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                          selectedOption === 'option2' ? 'border-primary' : 'border-gray-300'
                        }`}>
                          {selectedOption === 'option2' && (
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-bold text-gray-800">
                                {layer3_maturedIdle > 0 
                                  ? (language === 'हि' ? 'मैच्योर FD + सुरक्षित बचत' : language === 'Bho' ? 'मैच्योर FD + सुरक्षित बचत' : 'ম্যাচিওর হওয়া FD + নিরাপদ সঞ্চয়')
                                  : (language === 'हि' ? 'सुरक्षित बचत लगाएं' : language === 'Bho' ? 'सुरक्षित बचत लगाईं' : 'নিরাপদ সঞ্চয় বিনিয়োগ করুন')}
                            </p>
                            <p className="font-bold text-primary">{formatIndianRupee(option2Amount)}</p>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {layer3_maturedIdle > 0 
                              ? (language === 'हि' ? 'सबसे ज्यादा फायदा — सारे बेकार पड़े पैसे एक साथ लगाओ' : language === 'Bho' ? 'सबसे ढेर फायदा — सारा बेकार पडल पइसा एक साथ लगाईं' : 'সর্বোচ্চ লাভ — সমস্ত অলস টাকা একসাথে বিনিয়োগ করুন')
                              : (language === 'हि' ? 'सबसे ज्यादा फायदा — सुरक्षित बचत को काम पे लगाओ' : language === 'Bho' ? 'सबसे ढेर फायदा — सुरक्षित बचत के काम पे लगाईं' : 'সর্বোচ্চ লাভ — নিরাপদ সঞ্চয়কে কাজে লাগান')
                            }
                          </p>
                          <div className="bg-white/60 rounded-lg p-2 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Maturity:</span>
                              <span className="font-semibold text-gray-800">
                                {formatIndianRupee(calculateMaturityAmount(option2Amount, bestRate, tenureInMonths))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Goal coverage:</span>
                              <span className="font-semibold text-gray-800">
                                {Math.round(((layer1_jamaHua + layer2_incoming + calculateMaturityAmount(option2Amount, bestRate, tenureInMonths)) / goal.targetAmount) * 100)}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                Low Risk
                              </span>
                              <span className="text-[10px] text-gray-500">— buffer ke baad spare</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Option 3: Custom Amount */}
                    <div
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        selectedOption === 'option3'
                          ? 'border-primary bg-green-50'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setSelectedOptions({ ...selectedOptions, [goal.id]: 'option3' });
                        }}
                        className="w-full text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                            selectedOption === 'option3' ? 'border-primary' : 'border-gray-300'
                          }`}>
                            {selectedOption === 'option3' && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-gray-800">Apni Marzi Se Chunein</p>
                              <p className="font-bold text-primary">{formatIndianRupee(customAmount)}</p>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              Khud decide karein kitna lagana hai
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Slider - only show when Option 3 is selected */}
                      {selectedOption === 'option3' && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-600">₹1,000</span>
                            <span className="text-xs text-gray-600">{formatIndianRupee(layer3_total)}</span>
                          </div>
                          <Slider
                            value={[customAmount]}
                            min={1000}
                            max={layer3_total}
                            step={500}
                            onValueChange={(value) => {
                              setCustomAmounts({ ...customAmounts, [goal.id]: value[0] });
                            }}
                            className="mb-3"
                          />
                          <div className="bg-white/60 rounded-lg p-2 text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Maturity:</span>
                              <span className="font-semibold text-gray-800">
                                {formatIndianRupee(calculateMaturityAmount(customAmount, bestRate, tenureInMonths))}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Goal coverage:</span>
                              <span className="font-semibold text-gray-800">
                                {Math.round(((layer1_jamaHua + layer2_incoming + calculateMaturityAmount(customAmount, bestRate, tenureInMonths)) / goal.targetAmount) * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Dynamic Projection Line */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
                      <p className="text-xs text-gray-700 leading-relaxed">
                        {language === 'हि' ? (
                          <>अगर आज <span className="font-bold text-gray-800">{formatIndianRupee(selectedAmount)}</span> लगाएं → <span className="font-semibold">{formatDate(currentDeadline)}</span> को <span className="font-bold text-primary">{formatIndianRupee(selectedMaturity)}</span> मिलेगा → Goal <span className="font-bold text-gray-800">{selectedGoalPercentage}%</span> पूरा होगा</>
                        ) : language === 'Bho' ? (
                          <>अगर आज <span className="font-bold text-gray-800">{formatIndianRupee(selectedAmount)}</span> लगाईं → <span className="font-semibold">{formatDate(currentDeadline)}</span> के <span className="font-bold text-primary">{formatIndianRupee(selectedMaturity)}</span> मिली → लक्ष्य <span className="font-bold text-gray-800">{selectedGoalPercentage}%</span> पूरा हो जाई</>
                        ) : (
                          <>যদি আজ <span className="font-bold text-gray-800">{formatIndianRupee(selectedAmount)}</span> বিনিয়োগ করেন → <span className="font-semibold">{formatDate(currentDeadline)}</span> তারিখে <span className="font-bold text-primary">{formatIndianRupee(selectedMaturity)}</span> পাবেন → লক্ষ্য <span className="font-bold text-gray-800">{selectedGoalPercentage}%</span> সম্পন্ন হবে</>
                        )}
                      </p>
                    </div>

                    {/* Confirm Button - Shows selected amount */}
                    <button
                      onClick={() => onGoalCTAClick(goal.name, selectedAmount)}
                      className="w-full bg-primary text-white font-semibold py-3.5 rounded-xl hover:bg-primary/90 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>{formatIndianRupee(selectedAmount)} {lang.goalsTab.bookFd}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Unachievable Goal Options - Two buttons side by side */}
                {isUnachievable && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-semibold text-red-700">{language === 'हि' ? 'विकल्प चुनें' : language === 'Bho' ? 'विकल्प चुनीं' : 'বিকল্প বেছে নিন'}</h5>
                    
                    {layer3_total > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {/* Option 1: Invest Maximum */}
                        <button
                          onClick={() => onGoalCTAClick(goal.name, layer3_total)}
                          className="bg-primary text-white font-semibold py-3 px-3 rounded-xl hover:bg-primary/90 active:scale-98 transition-all shadow-sm text-center text-sm"
                        >
                          <div className="mb-1">{language === 'हि' ? 'जितना हो सके' : language === 'Bho' ? 'जितना हो सके' : 'যতটা সম্ভব'}</div>
                          <div className="text-xs opacity-90">{language === 'हि' ? 'लगाएं' : language === 'Bho' ? 'लगाईं' : 'বিনিয়োগ করুন'} →</div>
                        </button>

                        {/* Option 2: Extend Deadline */}
                        <button
                          onClick={() => {
                            setExtendedDeadlines({ ...extendedDeadlines, [goal.id]: minViableDeadline });
                          }}
                          className="bg-orange-500 text-white font-semibold py-3 px-3 rounded-xl hover:bg-orange-600 active:scale-98 transition-all shadow-sm text-center text-sm"
                        >
                          <div className="mb-1">{language === 'हि' ? 'समय बढ़ाएं' : language === 'Bho' ? 'समय बढ़ाईं' : 'সময় বাড়ান'}</div>
                          <div className="text-xs opacity-90">→ {formatDate(minViableDeadline).split(' ')[1]} {formatDate(minViableDeadline).split(' ')[2]}</div>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <p className="text-sm text-red-800 text-center">
                          {language === 'हि' ? 'अभी निवेश करने के लिए पैसा नहीं है। समय बढ़ाने से भी लक्ष्य पूरा नहीं होगा।' : language === 'Bho' ? 'अभी निवेश करे खातिर पइसा नईखे। समय बढ़ावे से भी लक्ष्य पूरा ना होई।' : 'বর্তমানে বিনিয়োগের জন্য কোনো অর্থ নেই। সময় বাড়ালেও লক্ষ্য পূরণ হবে না।'}
                        </p>
                      </div>
                    )}

                    {/* Extended deadline info */}
                    {extendedDeadlines[goal.id] && (
                      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-800 mb-1">✓ Naya Timeline</p>
                            <p className="text-sm text-gray-700 leading-relaxed mb-2">
                              Agar deadline <span className="font-bold">{formatDate(minViableDeadline)}</span> kar do toh <span className="font-bold text-primary">{formatIndianRupee(totalAtDeadline)}</span> se goal asaani se poora ho jayega.
                            </p>
                            <button
                              onClick={() => {
                                onUpdateGoalDeadline(goal.id, minViableDeadline.toISOString());
                                setExtendedDeadlines({ ...extendedDeadlines, [goal.id]: minViableDeadline });
                              }}
                              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 active:scale-98 transition-all text-sm"
                            >
                              Deadline Update Karein
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}