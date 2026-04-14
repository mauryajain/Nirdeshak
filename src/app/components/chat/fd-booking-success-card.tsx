import { CheckCircle, ArrowRight, Target } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface FDBookingSuccessCardProps {
  amount: number;
  maturityAmount: number;
  bankName: string;
  tenure: number;
  maturityDate: Date;
  goalName: string;
  projectedTotal: number;
  targetAmount: number;
  onViewGoal: () => void;
  onGoHome: () => void;
  onDownloadReceipt?: () => void;
}

export function FDBookingSuccessCard({
  amount,
  maturityAmount,
  bankName,
  tenure,
  maturityDate,
  goalName,
  projectedTotal,
  targetAmount,
  onViewGoal,
  onGoHome,
  onDownloadReceipt,
}: FDBookingSuccessCardProps) {
  const { lang, language } = useLanguage();

  // Calculate the goal status message
  let goalStatusMessage = '';
  
  if (projectedTotal > targetAmount) {
    const extra = projectedTotal - targetAmount;
    if (language === 'हि') goalStatusMessage = `Goal पूरा हो जाएगा — और ${formatIndianRupee(extra)} एक्स्ट्रा भी बचेगा`;
    else if (language === 'Bho') goalStatusMessage = `लक्ष्य पूरा हो जाई — अउर ${formatIndianRupee(extra)} बेसी रही`;
    else goalStatusMessage = `লক্ষ্য পূরণ হবে — এবং ${formatIndianRupee(extra)} অতিরিক্ত থাকবে`;
  } else if (projectedTotal === targetAmount) {
    if (language === 'हि') goalStatusMessage = 'Goal पूरा हो जाएगा';
    else if (language === 'Bho') goalStatusMessage = 'लक्ष्य पूरा हो जाई';
    else goalStatusMessage = 'লক্ষ্য পূরণ হবে';
  } else {
    const shortfall = targetAmount - projectedTotal;
    if (language === 'हि') goalStatusMessage = `Goal के लिए ${formatIndianRupee(shortfall)} और चाहिए`;
    else if (language === 'Bho') goalStatusMessage = `लक्ष্য खातिर ${formatIndianRupee(shortfall)} अउर चाहीं`;
    else goalStatusMessage = `লক্ষ্যের জন্য আরও ${formatIndianRupee(shortfall)} প্রয়োজন`;
  }

  return (
    <div className="my-4">
      <div className="bg-gradient-to-br from-primary to-green-700 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold">
            {language === 'हि' ? 'FD हो गयी!' : language === 'Bho' ? 'FD हो गइल!' : 'FD হয়ে গেছে!'}
          </h3>
        </div>

        <div className="bg-white/10 rounded-xl p-4 mb-4">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold">{formatIndianRupee(amount)}</span>
            <ArrowRight className="w-5 h-5" />
            <span className="text-2xl font-bold">{formatIndianRupee(maturityAmount)}</span>
          </div>
          <div className="space-y-1 text-sm text-white/80">
            <p className="font-semibold">{bankName} · {tenure} {language === 'বাং' ? 'মাস' : 'महीने'}</p>
            <p>{formatDate(maturityDate)} {language === 'हि' ? 'को पैसा मिलेगा' : language === 'Bho' ? 'के पइसा मिली' : 'টাকা পাবেন'}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-4 flex items-center gap-3">
          <Target className="w-5 h-5 text-white/80" />
          <div className="flex-1">
            <p className="text-sm text-white/80 mb-1">{goalName} goal</p>
            <p className="text-base font-bold leading-snug">{goalStatusMessage}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={onViewGoal}
          className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 active:scale-98 transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>{language === 'हि' ? 'Goal देखें' : language === 'Bho' ? 'लक्ष्य देखीं' : 'লক্ষ্য দেখুন'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {onDownloadReceipt && (
          <button
            onClick={onDownloadReceipt}
            className="w-full bg-white text-primary font-semibold py-3 rounded-xl border border-primary hover:bg-primary/5 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Receipt डाउनलोड करें</span>
          </button>
        )}

        <button
          onClick={onGoHome}
          className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 active:scale-98 transition-all flex items-center justify-center gap-2"
        >
          <span>{language === 'हि' ? 'घर जाएं' : language === 'Bho' ? 'घर जाईं' : 'হোমে ফিরে যান'}</span>
        </button>
      </div>
    </div>
  );
}