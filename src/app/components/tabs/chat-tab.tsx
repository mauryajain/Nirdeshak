import { useState, useRef, useEffect } from 'react';
import { Bell, Globe, User, Mic, Send } from 'lucide-react';
import { ChatBubble } from '../chat/chat-bubble';
import { QuickReplyChips } from '../chat/quick-reply-chips';
import { ContextCard } from '../chat/context-card';
import { FDRecommendationCard } from '../chat/fd-recommendation-card';
import { SourceConfirmationCard } from '../chat/source-confirmation-card';
import { FDSummaryCard } from '../chat/fd-summary-card';
import { FDBookingSuccessCard } from '../chat/fd-booking-success-card';
import { TypingIndicator } from '../chat/typing-indicator';
import { GreetingCard } from '../chat/greeting-card';
import { ProactiveAlertCard } from '../chat/proactive-alert-card';
import { QuickActionPills } from '../chat/quick-action-pills';
import { calculateMaturityAmount, type ActiveFD, type Goal } from '../../data/dummy-data';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
  options?: string[];
  cardType?: 'fd-recommendation' | 'source-confirmation' | 'fd-summary' | 'booking-success';
  cardData?: any;
}

interface BookingContext {
  goalName: string;
  goalDeadline: Date;
  amount: number;
  maturedAmount: number;
  savingsAmount: number;
  tenure: number;
  bankName: string;
  interestRate: number;
  maturityDate: Date;
  maturityAmount: number;
  targetAmount: number;
}

interface ChatTabProps {
  onNotificationClick: () => void;
  selectedInvestment?: { goalName: string; amount: number } | null;
  onClearInvestment?: () => void;
  onSwitchToGoals?: () => void;
  onAddFD: (goalName: string, newFD: ActiveFD) => void;
  goals: Goal[];
}

export function ChatTab({ 
  onNotificationClick, 
  selectedInvestment, 
  onClearInvestment,
  onSwitchToGoals,
  onAddFD,
  goals
}: ChatTabProps) {
  const [language, setLanguage] = useState<'हि' | 'Bho' | 'বাং'>('हि');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingContext, setBookingContext] = useState<BookingContext | null>(null);
  const [bookingStep, setBookingStep] = useState<string>('idle');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Determine the most urgent alert
  const getMostUrgentAlert = () => {
    // Priority 1: Goal at risk or behind
    const atRiskGoal = goals.find(g => g.status === 'behind' || g.status === 'at-risk');
    if (atRiskGoal) {
      const gap = atRiskGoal.targetAmount - (atRiskGoal.jamaHua + atRiskGoal.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0));
      return {
        type: 'goal-at-risk' as const,
        title: atRiskGoal.status === 'behind' ? `${atRiskGoal.icon} Goal पीछे रह रही है` : `${atRiskGoal.icon} Goal risk में है`,
        message: `${atRiskGoal.name} goal ${new Date(atRiskGoal.deadline).toLocaleDateString('hi-IN')} तक पूरी करनी है। अभी ₹${gap.toLocaleString('en-IN')} की कमी है।`,
        amount: gap,
        ctaText: 'FD में लगाएं',
        onCTAClick: () => {
          if (atRiskGoal.idleMaturedMoney > 0) {
            handleGoalCTA(atRiskGoal.name, atRiskGoal.idleMaturedMoney);
          } else {
            // Calculate investable amount (simplified for now)
            const investableAmount = Math.min(gap, 50000);
            handleGoalCTA(atRiskGoal.name, investableAmount);
          }
        },
      };
    }

    // Priority 2: Matured FD sitting idle
    const idleMaturedGoal = goals.find(g => g.idleMaturedMoney > 0);
    if (idleMaturedGoal) {
      return {
        type: 'idle-matured' as const,
        title: `${idleMaturedGoal.icon} FD mature हो गई!`,
        message: `${idleMaturedGoal.name} goal की पिछली FD mature हो गई। यह पैसा बचत ाते में बेकार पड़ा है। दोबारा FD में लगाएं।`,
        amount: idleMaturedGoal.idleMaturedMoney,
        ctaText: 'दोबारा निवेश करें',
        onCTAClick: () => handleGoalCTA(idleMaturedGoal.name, idleMaturedGoal.idleMaturedMoney),
      };
    }

    // Priority 3: Idle savings (simplified - using dummy data)
    return {
      type: 'idle-savings' as const,
      title: 'बचत खाते में पैसा बेकार पड़ा है',
      message: 'आपके पास ₹2,83,000 safely निवेश किया जा सकता है। Emergency fund सुरक्षित रखते हुए FD में लगाएं।',
      amount: 283000,
      ctaText: 'FD शुरू करें',
      onCTAClick: () => {
        // Start new FD flow
        setShowQuickActions(false);
        setMessages([
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Kaunse goal ke liye FD karna chahte hain?',
            timestamp: new Date(),
            options: [...goals.map(g => `${g.icon} ${g.name}`), 'Other'],
          },
        ]);
      },
    };
  };

  const mostUrgentAlert = getMostUrgentAlert();

  // Is this a clean default view (no booking flow)
  const isDefaultView = bookingStep === 'idle' && messages.length === 0;

  // Handle investment selection from Goals tab
  useEffect(() => {
    if (selectedInvestment && onClearInvestment) {
      // Find the goal to get deadline
      const goal = goals.find(g => g.name === selectedInvestment.goalName);
      if (!goal) return;

      // Calculate tenure based on goal deadline
      const monthsToDeadline = Math.max(1, Math.round((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
      const suggestedTenure = monthsToDeadline >= 18 ? 18 : monthsToDeadline >= 12 ? 12 : 6;

      // Calculate maturity
      const bestRate = 8.75;
      const maturityAmount = calculateMaturityAmount(selectedInvestment.amount, bestRate, suggestedTenure);
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + suggestedTenure);

      // Set booking context
      const context: BookingContext = {
        goalName: selectedInvestment.goalName,
        goalDeadline: goal.deadline,
        amount: selectedInvestment.amount,
        maturedAmount: goal.idleMaturedMoney,
        savingsAmount: selectedInvestment.amount - goal.idleMaturedMoney,
        tenure: suggestedTenure,
        bankName: 'Suryoday Bank',
        interestRate: bestRate,
        maturityDate: maturityDate,
        maturityAmount: maturityAmount,
        targetAmount: goal.targetAmount,
      };

      setBookingContext(context);
      setBookingStep('confirm-amount');

      // Clear existing messages and start fresh booking flow
      setMessages([]);

      // Step 1: Confirm amount
      setTimeout(() => {
        const botMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: `Aap ₹${selectedInvestment.amount.toLocaleString('en-IN')} ki FD karna chahte hain — ${selectedInvestment.goalName} goal ke liye. Kya yeh sahi hai?`,
          timestamp: new Date(),
          options: ['Haan, sahi hai', 'Amount badlna hai'],
        };
        setMessages([botMessage]);
      }, 500);

      onClearInvestment();
    }
  }, [selectedInvestment, onClearInvestment]);

  const handleQuickReply = (option: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: option,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Handle booking flow steps
    setTimeout(() => {
      setIsTyping(false);
      handleBookingFlow(option);
    }, 1500);
  };

  const handleBookingFlow = (userResponse: string) => {
    if (!bookingContext) return;

    // Step 2: Confirm amount
    if (bookingStep === 'confirm-amount' && userResponse === 'Haan, sahi hai') {
      setBookingStep('suggest-tenure');
      const monthsToDeadline = Math.round((bookingContext.goalDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Aapki goal deadline ${new Date(bookingContext.goalDeadline).toLocaleDateString('hi-IN')} hai — yaani ${monthsToDeadline} mahine baaki hain. Main suggest karunga ${bookingContext.tenure} mahine ki FD taaki paisa deadline se pehle aa jaye. Chalega?`,
        timestamp: new Date(),
        options: [`Haan, ${bookingContext.tenure} mahine theek hai`, 'Alag tenure chahiye'],
      };
      setMessages((prev) => [...prev, botMessage]);
    }

    // Step 3: Show FD recommendation
    else if (bookingStep === 'suggest-tenure' && userResponse.includes('theek hai')) {
      setBookingStep('show-fd-option');
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Yeh hai aapke liye best FD option:',
        timestamp: new Date(),
        cardType: 'fd-recommendation',
        cardData: {
          bankName: bookingContext.bankName,
          interestRate: bookingContext.interestRate,
          principal: bookingContext.amount,
          tenure: bookingContext.tenure,
          maturityAmount: bookingContext.maturityAmount,
          maturityDate: bookingContext.maturityDate,
          deadline: bookingContext.goalDeadline,
        },
      };
      const optionsMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Kya aap is bank mein lagana chahte hain?',
        timestamp: new Date(),
        options: ['Haan, yahi theek hai', 'Doosra bank dekhna hai'],
      };
      setMessages((prev) => [...prev, botMessage, optionsMessage]);
    }

    // Step 4: Source of funds confirmation
    else if (bookingStep === 'show-fd-option' && userResponse === 'Haan, yahi theek hai') {
      setBookingStep('confirm-source');
      
      // Only show source confirmation if both sources exist
      if (bookingContext.maturedAmount > 0 && bookingContext.savingsAmount > 0) {
        const sourceMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: '',
          timestamp: new Date(),
          cardType: 'source-confirmation',
          cardData: {
            maturedAmount: bookingContext.maturedAmount,
            savingsAmount: bookingContext.savingsAmount,
          },
        };
        const confirmMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: 'Dono account ready hain. Aage badhein?',
          timestamp: new Date(),
          options: ['Haan, aage badho', 'Sirf ek source use karna hai'],
        };
        setMessages((prev) => [...prev, sourceMessage, confirmMessage]);
      } else {
        // Skip to KYC if only one source
        setBookingStep('kyc-check');
        const kycMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: 'Aapko Aadhaar number aur PAN card ready rakhna hoga. Kya dono available hain?',
          timestamp: new Date(),
          options: ['Haan dono hain', 'Nahi hain abhi'],
        };
        setMessages((prev) => [...prev, kycMessage]);
      }
    }

    // Step 5: KYC Check
    else if (bookingStep === 'confirm-source' && userResponse === 'Haan, aage badho') {
      setBookingStep('kyc-check');
      const kycMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Aapko Aadhaar number aur PAN card ready rakhna hoga. Kya dono available hain?',
        timestamp: new Date(),
        options: ['Haan dono hain', 'Nahi hain abhi'],
      };
      setMessages((prev) => [...prev, kycMessage]);
    }

    // Step 6: Show summary
    else if (bookingStep === 'kyc-check' && userResponse === 'Haan dono hain') {
      setBookingStep('show-summary');
      
      // Calculate goal impact
      const goal = goals.find(g => g.name === bookingContext.goalName);
      const currentJama = goal?.jamaHua || 0;
      const incomingFDs = goal?.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0) || 0;
      const totalJama = currentJama + incomingFDs + bookingContext.maturityAmount;
      const completionPercentage = Math.round((totalJama / (goal?.targetAmount || 1)) * 100);

      const summaryMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: '',
        timestamp: new Date(),
        cardType: 'fd-summary',
        cardData: {
          bankName: bookingContext.bankName,
          amount: bookingContext.amount,
          tenure: bookingContext.tenure,
          interestRate: bookingContext.interestRate,
          maturityDate: bookingContext.maturityDate,
          maturityAmount: bookingContext.maturityAmount,
          goalName: bookingContext.goalName,
          goalImpact: {
            targetAmount: goal?.targetAmount || 0,
            totalJama: totalJama,
            completionPercentage: completionPercentage,
          },
        },
      };
      const confirmMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sab sahi lag raha hai?',
        timestamp: new Date(),
        options: ['Haan, FD karo', 'Nahi, badlna hai'],
      };
      setMessages((prev) => [...prev, summaryMessage, confirmMessage]);
    }

    // Step 7: Process booking
    else if (bookingStep === 'show-summary' && userResponse === 'Haan, FD karo') {
      setBookingStep('processing');
      const loadingMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: 'Aapki FD process ho rahi hai... ek second',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, loadingMessage]);

      // Simulate API call
      setTimeout(() => {
        setBookingStep('success');
        
        // Calculate goal impact
        const goal = goals.find(g => g.name === bookingContext.goalName);
        const currentJama = goal?.jamaHua || 0;
        const incomingFDs = goal?.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0) || 0;
        const projectedTotal = currentJama + incomingFDs + bookingContext.maturityAmount;
        const targetAmount = goal?.targetAmount || 0;

        const successMessage: Message = {
          id: Date.now().toString(),
          type: 'bot',
          content: '',
          timestamp: new Date(),
          cardType: 'booking-success',
          cardData: {
            amount: bookingContext.amount,
            maturityAmount: bookingContext.maturityAmount,
            bankName: bookingContext.bankName,
            tenure: bookingContext.tenure,
            maturityDate: bookingContext.maturityDate,
            goalName: bookingContext.goalName,
            projectedTotal: projectedTotal,
            targetAmount: targetAmount,
          },
        };
        setMessages((prev) => [...prev.filter(m => !m.content.includes('process ho rahi')), successMessage]);

        // Add FD to goal
        if (onAddFD) {
          const newFD: ActiveFD = {
            amount: bookingContext.amount,
            maturityAmount: bookingContext.maturityAmount,
            bankName: bookingContext.bankName,
            tenure: bookingContext.tenure,
            maturityDate: bookingContext.maturityDate,
          };
          onAddFD(bookingContext.goalName, newFD);
        }
      }, 3000);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
  };

  const handleViewGoal = () => {
    if (onSwitchToGoals) {
      onSwitchToGoals();
    }
  };

  const handleGoHome = () => {
    setBookingContext(null);
    setBookingStep('idle');
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'नमस्ते! मैं आपका FD सलाहकार हूं। मैं आपको सबसे अच्छी FD चुनने में मदद करूंगा। 😊',
        timestamp: new Date(),
      },
    ]);
  };

  const handleGoalCTA = (goalName: string, amount: number) => {
    // Find the goal to get deadline
    const goal = goals.find(g => g.name === goalName);
    if (!goal) return;

    // Calculate tenure based on goal deadline
    const monthsToDeadline = Math.max(1, Math.round((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)));
    const suggestedTenure = monthsToDeadline >= 18 ? 18 : monthsToDeadline >= 12 ? 12 : 6;

    // Calculate maturity
    const bestRate = 8.75;
    const maturityAmount = calculateMaturityAmount(amount, bestRate, suggestedTenure);
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + suggestedTenure);

    // Set booking context
    const context: BookingContext = {
      goalName: goalName,
      goalDeadline: goal.deadline,
      amount: amount,
      maturedAmount: goal.idleMaturedMoney,
      savingsAmount: amount - goal.idleMaturedMoney,
      tenure: suggestedTenure,
      bankName: 'Suryoday Bank',
      interestRate: bestRate,
      maturityDate: maturityDate,
      maturityAmount: maturityAmount,
      targetAmount: goal.targetAmount,
    };

    setBookingContext(context);
    setBookingStep('confirm-amount');

    // Clear existing messages and start fresh booking flow
    setMessages([]);

    // Step 1: Confirm amount
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Aap ₹${amount.toLocaleString('en-IN')} ki FD karna chahte hain — ${goalName} goal ke liye. Kya yeh sahi hai?`,
        timestamp: new Date(),
        options: ['Haan, sahi hai', 'Amount badlna hai'],
      };
      setMessages([botMessage]);
    }, 500);
  };

  return (
    <div className="h-full flex flex-col bg-[#fdfbf7]">
      {/* Header */}
      <div className="bg-primary text-white px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <User className="w-8 h-8 bg-white/20 rounded-full p-1.5" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary"></div>
          </div>
          <div>
            <h3 className="font-bold text-base">Nirdeshak</h3>
            <p className="text-xs text-white/80">आपका FD सलाहकार</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative" onClick={onNotificationClick}>
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
              3
            </span>
          </button>
          <button className="relative">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Language selector */}
      <div className="bg-white px-4 py-2 border-b border-gray-200 flex items-center gap-2">
        <span className="text-xs text-gray-600">भाषा:</span>
        <div className="flex gap-2">
          {(['हि', 'Bho', 'বাং'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                language === lang
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Default View: Greeting + Alert + Quick Actions */}
        {isDefaultView && (
          <>
            <GreetingCard userName="रमेश" idleAmount={283000} />
            <ProactiveAlertCard {...mostUrgentAlert} />
            {showQuickActions && (
              <QuickActionPills
                onNewFD={() => {
                  setShowQuickActions(false);
                  setMessages([
                    {
                      id: Date.now().toString(),
                      type: 'bot',
                      content: 'Kaunse goal ke liye FD karna chahte hain?',
                      timestamp: new Date(),
                      options: [...goals.map(g => `${g.icon} ${g.name}`), 'Other'],
                    },
                  ]);
                }}
                onViewGoals={() => onSwitchToGoals && onSwitchToGoals()}
                onViewRates={() => {
                  // Switch to rates tab - need to pass this up
                }}
              />
            )}
          </>
        )}

        {/* Context Card - Pinned (only during booking flow) */}
        {bookingContext && (
          <ContextCard
            goalName={bookingContext.goalName}
            amount={bookingContext.amount}
            deadline={bookingContext.goalDeadline}
            targetAmount={bookingContext.targetAmount}
          />
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div key={message.id}>
            <ChatBubble
              type={message.type}
              content={message.content}
              timestamp={message.timestamp}
            />

            {/* Special Cards */}
            {message.cardType === 'fd-recommendation' && message.cardData && (
              <FDRecommendationCard {...message.cardData} />
            )}

            {message.cardType === 'source-confirmation' && message.cardData && (
              <SourceConfirmationCard {...message.cardData} />
            )}

            {message.cardType === 'fd-summary' && message.cardData && (
              <FDSummaryCard {...message.cardData} />
            )}

            {message.cardType === 'booking-success' && message.cardData && (
              <FDBookingSuccessCard
                {...message.cardData}
                onViewGoal={handleViewGoal}
                onGoHome={handleGoHome}
              />
            )}

            {/* Quick Reply Chips */}
            {message.options && message.id === messages[messages.length - 1].id && (
              <QuickReplyChips options={message.options} onSelect={handleQuickReply} />
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}

        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="अपना सवाल लिखें..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2.5 rounded-full transition-all ${
              isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}