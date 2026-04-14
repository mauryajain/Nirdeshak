import { useEffect, useMemo, useRef, useState } from 'react';
import { Bell, Globe, User, Mic, Send, Clock } from 'lucide-react';
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
import { StepCounter } from '../chat/step-counter';
import { JargonTooltip } from '../chat/jargon-tooltip';
import { calculateMaturityAmount, formatIndianRupee } from '../../utils/format';
import type { ActiveFD, Goal } from '../../lib/types';
import type { FDRecord } from '../../lib/api';
import { getReceipt, appendChatMessages, createChatSession, getChatSession, listChatSessions } from '../../lib/api';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string | JSX.Element;
  timestamp: Date;
  options?: string[];
  cardType?: 'fd-recommendation' | 'source-confirmation' | 'fd-summary' | 'booking-success';
  cardData?: any;
}

interface SelectedInvestment {
  goalName: string;
  amount: number;
  bankName?: string;
  interestRate?: number;
  tenure?: number;
}

interface ChatSessionSummary {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

interface ChatTabProps {
  onNotificationClick: () => void;
  onSwitchToGoals: () => void;
  onSwitchToRates: () => void;
  onGoalCTAClick: (goalName: string, amount: number, bankName?: string, interestRate?: number, tenure?: number) => void;
  onAddFD: (goalName: string, newFD: ActiveFD) => Promise<FDRecord | null>;
  goals: Goal[];
  selectedInvestment?: SelectedInvestment | null;
  onClearInvestment: () => void;
  unreadNotifications: number;
  savedScroll: number;
  onSaveScroll: (position: number) => void;
}

export function ChatTab({
  onNotificationClick,
  onSwitchToGoals,
  onSwitchToRates,
  onGoalCTAClick,
  onAddFD,
  goals,
  selectedInvestment,
  onClearInvestment,
  unreadNotifications,
  savedScroll,
  onSaveScroll,
}: ChatTabProps) {
  const [language, setLanguage] = useState<'हि' | 'Bho' | 'বাং'>('हि');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [bookingContext, setBookingContext] = useState<SelectedInvestment | null>(null);
  const [bookingStep, setBookingStep] = useState<string>('idle');
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>('');
  const [createdFdId, setCreatedFdId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionActive, setRecognitionActive] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('nirdeshak-language');
    if (saved === 'हि' || saved === 'Bho' || saved === 'বাং') {
      setLanguage(saved);
    }
    setSpeechSupported(
      typeof window !== 'undefined' &&
        !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('nirdeshak-language', language);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = savedScroll;
    }
  }, [savedScroll]);

  useEffect(() => {
    if (!sessionId && selectedInvestment) {
      startBookingFlow(selectedInvestment);
    }
  }, [selectedInvestment]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, bookingStep]);

  const prepareDefaultView = () => {
    setMessages([]);
    setBookingContext(null);
    setBookingStep('idle');
    setShowQuickActions(true);
    setIsReadOnly(false);
    setSessionId(null);
    setCurrentSessionTitle('');
    setCreatedFdId(null);
  };

  const loadSessions = async () => {
    try {
      const items = await listChatSessions();
      setSessions(items);
    } catch (error) {
      toast.error('चैट history लोड नहीं हो पाई');
      console.error(error);
    }
  };

  const openHistory = async () => {
    await loadSessions();
    setIsHistoryOpen(true);
  };

  const closeHistory = () => {
    setIsHistoryOpen(false);
  };

  const openSession = async (id: string) => {
    try {
      const session = await getChatSession(id);
      setMessages(
        session.messages.map((message) => ({
          ...message,
          timestamp: new Date(message.createdAt),
        }))
      );
      setSessionId(session.id);
      setCurrentSessionTitle(session.title);
      setIsReadOnly(true);
      setBookingStep('readonly');
      closeHistory();
    } catch (error) {
      toast.error('Session खोलने में समस्या');
      console.error(error);
    }
  };

  const createSessionIfNeeded = async (payload: { firstUserMessage?: string; goalName?: string; amount?: number }) => {
    if (sessionId) return sessionId;
    try {
      const session = await createChatSession({ userId: '1', ...payload });
      setSessionId(session.id);
      setCurrentSessionTitle(session.title);
      return session.id;
    } catch (error) {
      toast.error('Chat session बनाते समय त्रुटि');
      console.error(error);
      return null;
    }
  };

  const persistMessages = async (newMessages: Message[]) => {
    if (!sessionId) return;
    try {
      await appendChatMessages(sessionId, newMessages.map((message) => ({
        role: message.type,
        content: typeof message.content === 'string' ? message.content : String(message.content),
        cardType: message.cardType,
        cardData: message.cardData,
      })));
    } catch (error) {
      console.error('Message save failed', error);
    }
  };

  const handleDownloadReceipt = async (fdId: string) => {
    try {
      const blob = await getReceipt(fdId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (error) {
      toast.error('Receipt डाउनलोड नहीं हो पाई');
      console.error(error);
    }
  };

  const getMostUrgentAlert = useMemo(() => {
    const atRiskGoal = goals.find((g) => g.status === 'behind' || g.status === 'at-risk');
    if (atRiskGoal) {
      const gap = Math.max(0, atRiskGoal.targetAmount - (atRiskGoal.jamaHua + atRiskGoal.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0)));
      return {
        type: atRiskGoal.status === 'behind' ? 'goal-at-risk' : 'goal-at-risk',
        title: atRiskGoal.status === 'behind' ? `${atRiskGoal.icon} Goal पीछे रह रही है` : `${atRiskGoal.icon} Goal risk में है`,
        message: `${atRiskGoal.name} goal ${atRiskGoal.deadline.toLocaleDateString('hi-IN')} तक पूरी करनी है। अभी ${formatIndianRupee(gap)} की कमी है।`,
        amount: gap,
        ctaText: 'FD में लगाएं',
        onCTAClick: () => onGoalCTAClick(atRiskGoal.name, gap),
      };
    }

    const idleMaturedGoal = goals.find((g) => g.idleMaturedMoney > 0);
    if (idleMaturedGoal) {
      return {
        type: 'idle-matured',
        title: `${idleMaturedGoal.icon} FD mature हो गई!`,
        message: `${idleMaturedGoal.name} goal की पिछली FD mature हो गई। यह पैसा बचत खाते में बेकार पड़ा है। दोबारा FD में लगाएं।`,
        amount: idleMaturedGoal.idleMaturedMoney,
        ctaText: 'दोबारा निवेश करें',
        onCTAClick: () => onGoalCTAClick(idleMaturedGoal.name, idleMaturedGoal.idleMaturedMoney),
      };
    }

    return {
      type: 'idle-savings',
      title: 'बचत खाते में पैसा बेकार पड़ा है',
      message: 'आपके पास कुछ अतिरिक्त पैसा सुरक्षित रूप से FD में लगाया जा सकता है।',
      amount: 0,
      ctaText: 'FD शुरू करें',
      onCTAClick: () => {
        setShowQuickActions(false);
        setMessages([
          {
            id: Date.now().toString(),
            type: 'bot',
            content: 'Kaunse goal ke लिए FD karna chahte hain?',
            timestamp: new Date(),
            options: goals.map((g) => `${g.icon} ${g.name}`),
          },
        ]);
      },
    };
  }, [goals]);

  const isDefaultView = bookingStep === 'idle' && messages.length === 0 && !isReadOnly;

  const handleSend = async () => {
    if (!inputValue.trim() || isReadOnly) return;
    const content = inputValue.trim();
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    const newSessionId = await createSessionIfNeeded({ firstUserMessage: content });
    if (newSessionId) {
      await persistMessages([userMessage]);
    }
  };

  const handleQuickReply = async (option: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-user`,
      type: 'user',
      content: option,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const newSessionId = await createSessionIfNeeded({ firstUserMessage: option });
    if (newSessionId) {
      await persistMessages([userMessage]);
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (bookingStep !== 'idle' && bookingContext) {
        handleBookingFlow(option);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-bot`,
            type: 'bot',
            content: 'ठीक है, मैं इस पर काम करता हूँ।',
            timestamp: new Date(),
          },
        ]);
      }
    }, 1200);
  };

  const startBookingFlow = async (investment: SelectedInvestment) => {
    onClearInvestment();
    setBookingContext(investment);
    setBookingStep('confirm-amount');
    setShowQuickActions(false);
    const botMessage: Message = {
      id: `${Date.now()}-bot`,
      type: 'bot',
      content: (
        <>
          Aap <strong>{formatIndianRupee(investment.amount)}</strong> ki FD karna chahte hain — <strong>{investment.goalName}</strong> goal के लिए. क्या ये सही है?
        </>
      ),
      timestamp: new Date(),
      options: ['Haan, sahi hai', 'Amount badlna hai'],
    };
    setMessages([botMessage]);

    const newSessionId = await createSessionIfNeeded({ goalName: investment.goalName, amount: investment.amount });
    if (newSessionId) {
      await persistMessages([{
        ...botMessage,
        content: typeof botMessage.content === 'string' ? botMessage.content : String(botMessage.content),
      }] as Message[]);
    }
  };

  const handleBookingFlow = (userResponse: string) => {
    if (!bookingContext) return;

    if (bookingStep === 'confirm-amount' && userResponse === 'Haan, sahi hai') {
      setBookingStep('suggest-tenure');
      const monthsToDeadline = Math.max(1, Math.round((bookingContext.tenure || 12)));
      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: (
          <>
            Aapki goal deadline {bookingContext.goalName} के लिए चुनी गयी अवधि <strong>{monthsToDeadline} महीने</strong> है। यह ठीक है?
          </>
        ),
        timestamp: new Date(),
        options: [`Haan, ${monthsToDeadline} महीने ठीक है`, 'Alag tenure chahiye'],
      };
      setMessages((prev) => [...prev, botMessage]);
      void persistMessages([botMessage]);
      return;
    }

    if (bookingStep === 'suggest-tenure' && userResponse.includes('ठीक है')) {
      setBookingStep('show-fd-option');
      const botMessage: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: 'Yeh hai aapke liye best FD option:',
        timestamp: new Date(),
        cardType: 'fd-recommendation',
        cardData: {
          bankName: bookingContext.bankName || 'HDFC Bank',
          interestRate: bookingContext.interestRate || 7.5,
          principal: bookingContext.amount,
          tenure: bookingContext.tenure || 12,
          maturityAmount: calculateMaturityAmount(bookingContext.amount, bookingContext.interestRate || 7.5, bookingContext.tenure || 12),
          maturityDate: new Date(new Date().setMonth(new Date().getMonth() + (bookingContext.tenure || 12))),
          deadline: new Date(),
        },
      };
      const followUp: Message = {
        id: `${Date.now()}-bot-follow`,
        type: 'bot',
        content: (
          <>
            यह FD <JargonTooltip term="p.a." explanation="matlab har saal" /> पर होगा। आगे बढ़ें?
          </>
        ),
        timestamp: new Date(),
        options: ['Haan, yahi theek hai', 'Doosra bank dekhna hai'],
      };
      setMessages((prev) => [...prev, botMessage, followUp]);
      void persistMessages([botMessage, followUp]);
      return;
    }

    if (bookingStep === 'show-fd-option' && userResponse === 'Haan, yahi theek hai') {
      setBookingStep('confirm-source');
      const sourceMessage: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        cardType: 'source-confirmation',
        cardData: {
          maturedAmount: bookingContext.amount * 0.3,
          savingsAmount: bookingContext.amount * 0.7,
        },
      };
      const confirmMessage: Message = {
        id: `${Date.now()}-bot-follow`,
        type: 'bot',
        content: 'Dono account ready hain. Aage badhein?',
        timestamp: new Date(),
        options: ['Haan, aage badho', 'Sirf ek source use karna hai'],
      };
      setMessages((prev) => [...prev, sourceMessage, confirmMessage]);
      void persistMessages([sourceMessage, confirmMessage]);
      return;
    }

    if (bookingStep === 'confirm-source' && userResponse === 'Haan, aage badho') {
      setBookingStep('kyc-check');
      const kycMessage: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: 'Aapko Aadhaar number aur PAN card ready rakhna hoga. Kya dono available hain?',
        timestamp: new Date(),
        options: ['Haan dono hain', 'Nahi hain abhi'],
      };
      setMessages((prev) => [...prev, kycMessage]);
      void persistMessages([kycMessage]);
      return;
    }

    if (bookingStep === 'kyc-check' && userResponse === 'Haan dono hain') {
      setBookingStep('show-summary');
      const maturityAmount = calculateMaturityAmount(bookingContext.amount, bookingContext.interestRate || 7.5, bookingContext.tenure || 12);
      const goal = goals.find((g) => g.name === bookingContext.goalName);
      const currentJama = goal?.jamaHua || 0;
      const incomingFDs = goal?.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0) || 0;
      const totalJama = currentJama + incomingFDs + maturityAmount;
      const summary: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: '',
        timestamp: new Date(),
        cardType: 'fd-summary',
        cardData: {
          bankName: bookingContext.bankName || 'HDFC Bank',
          amount: bookingContext.amount,
          tenure: bookingContext.tenure || 12,
          interestRate: bookingContext.interestRate || 7.5,
          maturityDate: new Date(new Date().setMonth(new Date().getMonth() + (bookingContext.tenure || 12))),
          maturityAmount,
          goalName: bookingContext.goalName,
          goalImpact: {
            targetAmount: goal?.targetAmount || 0,
            totalJama,
            completionPercentage: Math.round((totalJama / (goal?.targetAmount || 1)) * 100),
          },
        },
      };
      const confirmMessage: Message = {
        id: `${Date.now()}-bot-follow`,
        type: 'bot',
        content: 'Sab sahi lag raha hai?',
        timestamp: new Date(),
        options: ['Haan, FD karo', 'Nahi, badlna hai'],
      };
      setMessages((prev) => [...prev, summary, confirmMessage]);
      void persistMessages([summary, confirmMessage]);
      return;
    }

    if (bookingStep === 'show-summary' && userResponse === 'Haan, FD karo') {
      setBookingStep('processing');
      const processing: Message = {
        id: `${Date.now()}-bot`,
        type: 'bot',
        content: 'Aapki FD process ho rahi hai... एक second',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, processing]);
      void persistMessages([processing]);

      setTimeout(async () => {
        setBookingStep('success');
        const maturityAmount = calculateMaturityAmount(bookingContext.amount, bookingContext.interestRate || 7.5, bookingContext.tenure || 12);
        const goal = goals.find((g) => g.name === bookingContext.goalName);
        const currentJama = goal?.jamaHua || 0;
        const incomingFDs = goal?.activeFDs.reduce((sum, fd) => sum + fd.maturityAmount, 0) || 0;
        const projectedTotal = currentJama + incomingFDs + maturityAmount;
        const result = await onAddFD(bookingContext.goalName, {
          bankName: bookingContext.bankName || 'HDFC Bank',
          amount: bookingContext.amount,
          maturityAmount,
          maturityDate: new Date(new Date().setMonth(new Date().getMonth() + (bookingContext.tenure || 12))),
          tenure: bookingContext.tenure,
        });
        const fdId = result?.id ?? null;
        if (fdId) {
          setCreatedFdId(fdId);
        }
        const successMessage: Message = {
          id: `${Date.now()}-bot-success`,
          type: 'bot',
          content: '',
          timestamp: new Date(),
          cardType: 'booking-success',
          cardData: {
            amount: bookingContext.amount,
            maturityAmount,
            bankName: bookingContext.bankName || 'HDFC Bank',
            tenure: bookingContext.tenure || 12,
            maturityDate: new Date(new Date().setMonth(new Date().getMonth() + (bookingContext.tenure || 12))),
            goalName: bookingContext.goalName,
            projectedTotal,
            targetAmount: goal?.targetAmount || 0,
            fdId,
          },
        };
        setMessages((prev) => [...prev.filter((m) => m.id !== processing.id), successMessage]);
      }, 2200);
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast('Voice input जल्द आएगा');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsRecording(false);
      setRecognitionActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsRecording(false);
      setRecognitionActive(false);
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setIsRecording(false);
      setRecognitionActive(false);
      toast('Voice input हल्की समस्या के कारण नहीं चालू हो पाया');
    };
    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
    setRecognitionActive(true);
  };

  return (
    <div className="h-full flex flex-col bg-[#fdfbf7]">
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
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
          <button className="relative" onClick={openHistory}>
            <Clock className="w-5 h-5" />
          </button>
          <button className="relative">
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>

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

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4" onScroll={(event) => onSaveScroll((event.target as HTMLElement).scrollTop)}>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-40 bg-black/50 p-4">
            <div className="relative h-full max-w-[390px] mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl">
              <div className="bg-primary px-4 py-4 flex items-center justify-between text-white">
                <h3 className="font-bold text-lg">Chat History</h3>
                <button onClick={closeHistory} className="p-2 rounded-full bg-white/10">
                  Close
                </button>
              </div>
              <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-64px)]">
                <button
                  onClick={() => {
                    prepareDefaultView();
                    closeHistory();
                  }}
                  className="w-full bg-primary text-white rounded-2xl py-3 font-semibold"
                >
                  नया Chat
                </button>
                {sessions.length === 0 ? (
                  <p className="text-sm text-gray-600">कोई पुराना चैट नहीं मिला।</p>
                ) : (
                  sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => openSession(session.id)}
                      className="w-full text-left rounded-2xl border border-gray-200 p-4 bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-semibold text-gray-800">{session.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(session.createdAt).toLocaleDateString('hi-IN', {
                              day: 'numeric',
                              month: 'long',
                            })}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{session.messageCount} संदेश</span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {!isReadOnly && bookingStep !== 'idle' && <StepCounter currentStep={Math.min(bookingStep === 'processing' ? 6 : 1, 7)} totalSteps={7} />}

        {isDefaultView && (
          <>
            <GreetingCard userName="रमेश" idleAmount={283000} />
            <ProactiveAlertCard {...getMostUrgentAlert} />
            {showQuickActions && (
              <QuickActionPills
                onNewFD={() => {
                  setShowQuickActions(false);
                  setMessages([
                    {
                      id: `${Date.now()}-bot`,
                      type: 'bot',
                      content: 'Kaunse goal ke लिए FD karna chahte hain?',
                      timestamp: new Date(),
                      options: goals.map((g) => `${g.icon} ${g.name}`),
                    },
                  ]);
                }}
                onViewGoals={onSwitchToGoals}
                onViewRates={onSwitchToRates}
              />
            )}
          </>
        )}

        {bookingContext && !isReadOnly && (() => {
          const currentGoal = goals.find((goal) => goal.name === bookingContext.goalName);
          return (
            <ContextCard
              goalName={bookingContext.goalName}
              amount={bookingContext.amount}
              deadline={currentGoal?.deadline ?? new Date()}
              targetAmount={currentGoal?.targetAmount ?? 0}
            />
          );
        })()}

        {messages.map((message) => (
          <div key={message.id}>
            <ChatBubble type={message.type} content={message.content} timestamp={message.timestamp} />
            {message.cardType === 'fd-recommendation' && <FDRecommendationCard {...message.cardData} />}
            {message.cardType === 'source-confirmation' && <SourceConfirmationCard {...message.cardData} />}
            {message.cardType === 'fd-summary' && <FDSummaryCard {...message.cardData} />}
            {message.cardType === 'booking-success' && (
              <FDBookingSuccessCard
                {...message.cardData}
                onViewGoal={onSwitchToGoals}
                onGoHome={prepareDefaultView}
                onDownloadReceipt={message.cardData?.fdId ? () => handleDownloadReceipt(message.cardData.fdId) : undefined}
              />
            )}
            {message.options && message === messages[messages.length - 1] && (
              <QuickReplyChips options={message.options} onSelect={handleQuickReply} />
            )}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {!isReadOnly && (
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="अपना सवाल लिखें..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleMicClick}
              className={`relative p-2.5 rounded-full transition-all ${
                recognitionActive ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Mic className="w-5 h-5" />
              {recognitionActive && <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />}
            </button>
            <button
              onClick={() => void handleSend()}
              className="p-2.5 bg-primary text-white rounded-full hover:bg-primary/90 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
