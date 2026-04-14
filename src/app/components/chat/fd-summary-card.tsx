import { CheckCircle2 } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface FDSummaryCardProps {
  bankName: string;
  amount: number;
  tenure: number;
  interestRate: number;
  maturityDate: Date;
  maturityAmount: number;
  goalName: string;
  goalImpact: {
    targetAmount: number;
    totalJama: number;
    completionPercentage: number;
  };
}

export function FDSummaryCard({
  bankName,
  amount,
  tenure,
  interestRate,
  maturityDate,
  maturityAmount,
  goalName,
  goalImpact,
}: FDSummaryCardProps) {
  const { lang, language } = useLanguage();
  const { targetAmount = 0, totalJama = 0 } = goalImpact || {};
  const goalExceeded = totalJama >= targetAmount && targetAmount > 0;
  const extraAmount = Math.max(0, totalJama - targetAmount);
  const remainingGap = Math.max(0, targetAmount - totalJama);

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 my-3 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h4 className="font-bold text-base text-gray-800">
          {language === 'हि' ? 'FD का पूरा हिसाब' : language === 'Bho' ? 'FD के पूरा हिसाब' : 'FD-র সম্পূর্ণ হিসাব'}
        </h4>
      </div>

      <div className="space-y-2 bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{language === 'বাং' ? 'ব্যাংক:' : 'बैंक:'}</span>
          <span className="text-sm font-bold text-gray-800">{bankName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{language === 'हि' ? 'राशि:' : language === 'Bho' ? 'पइसा:' : 'পরিমাণ:'}</span>
          <span className="text-sm font-bold text-primary">{formatIndianRupee(amount)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{language === 'हि' ? 'अवधि:' : language === 'Bho' ? 'समय:' : 'সময়সীমা:'}</span>
          <span className="text-sm font-bold text-gray-800">{tenure} {language === 'বাং' ? 'মাস' : 'महीने'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{language === 'हि' ? 'ब्याज दर:' : language === 'Bho' ? 'ब्याज दर:' : 'সুদের হার:'}</span>
          <span className="text-sm font-bold text-gray-800">{interestRate}% {language === 'हि' ? 'हर साल' : language === 'Bho' ? 'हर साल' : 'প্রতি বছর'}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">{language === 'हि' ? 'मैच्योर होगा:' : language === 'Bho' ? 'मैच्योर होई:' : 'ম্যাচিওর হবে:'}</span>
          <span className="text-sm font-bold text-gray-800">{formatDate(maturityDate)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
          <span className="text-sm text-gray-600">{language === 'हि' ? 'मिलेगा:' : language === 'Bho' ? 'मिली:' : 'পাবেন:'}</span>
          <span className="text-base font-bold text-primary">{formatIndianRupee(maturityAmount)}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-l-4 border-primary">
        <div className="space-y-1.5">
          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">{language === 'हि' ? 'जुड़ा हुआ लक्ष्य:' : language === 'Bho' ? 'जुड़ल लक्ष्य:' : 'যুক্ত করা লক্ষ্য:'}</p>
            <p className="text-xs font-bold text-gray-800">{goalName}</p>
          </div>
          
          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">{language === 'हि' ? 'लक्ष्य राशि:' : language === 'Bho' ? 'लक्ष्य के पइसा:' : 'লক্ষ্যের পরিমাণ:'}</p>
            <p className="text-xs font-bold text-gray-800">{formatIndianRupee(targetAmount)}</p>
          </div>

          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">{language === 'हि' ? 'मैच्योरिटी के बाद आपके पास होगा:' : language === 'Bho' ? 'मैच्योरिटी के बाद रउरा पास हो जाई:' : 'ম্যাচিওরিটির পর আপনার মোট অর্থ হবে:'}</p>
            <p className="text-xs font-bold text-primary">{formatIndianRupee(totalJama)}</p>
          </div>

          <div className="pt-1 border-t border-green-200">
            {goalExceeded ? (
              <p className="text-xs leading-relaxed text-gray-700">
                <span className="font-semibold text-green-700">{language === 'हि' ? 'मतलब:' : language === 'Bho' ? 'मतलब:' : 'অর্থাৎ:'}</span> {language === 'हि' ? `आपका ${goalName} लक्ष्य पूरा हो जाएगा और` : language === 'Bho' ? `रउरा ${goalName} लक्ष्य पूरा हो जाई अउर` : `আপনার ${goalName} লক্ষ্যটি পূরণ হয়ে যাবে এবং`} {' '}
                <span className="font-bold text-green-700">{formatIndianRupee(extraAmount)}</span> {language === 'हि' ? 'एक्स्ट्रा भी बचेगा' : language === 'Bho' ? 'बेसी रही' : 'অতিরিক্ত থাকবে'}
              </p>
            ) : (
              <p className="text-xs leading-relaxed text-gray-700">
                {language === 'हि' ? `इस FD से लक्ष्य का` : language === 'Bho' ? `एह FD से लक्ष्य के` : `এই FD দিয়ে লক্ষ্যের`} {' '}
                <span className="font-bold text-primary">{formatIndianRupee(totalJama)}</span> {language === 'हि' ? 'हिस्सा पूरा होगा।' : language === 'Bho' ? 'हिस्सा पूरा होई।' : 'অংশ পূরণ হবে।'} {' '}
                <span className="font-bold text-orange-600">{formatIndianRupee(remainingGap)}</span> {language === 'हि' ? 'अभी भी चाहिए' : language === 'Bho' ? 'अउर चाहीं' : 'এখনও প্রয়োজন'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}