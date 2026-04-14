import { TrendingUp, Calendar, Coins } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface FDRecommendationCardProps {
  bankName: string;
  interestRate: number;
  principal: number;
  tenure: number;
  maturityAmount: number;
  maturityDate: Date;
  deadline: Date;
}

export function FDRecommendationCard({
  bankName,
  interestRate,
  principal,
  tenure,
  maturityAmount,
  maturityDate,
  deadline,
}: FDRecommendationCardProps) {
  const { lang, language } = useLanguage();
  const isBeforeDeadline = maturityDate < deadline;

  return (
    <div className="bg-white border-2 border-primary rounded-xl p-4 shadow-md my-2">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-lg text-gray-800">{bankName}</h4>
        <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
          {interestRate}% {language === 'हि' ? 'हर साल' : language === 'Bho' ? 'हर साल' : 'প্রতি বছর'}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <Coins className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {formatIndianRupee(principal)} → {tenure} {language === 'বাং' ? 'মাস' : 'महीने'} {language === 'हि' ? 'बाद' : language === 'Bho' ? 'बाद' : 'পর'} {' '}
            <span className="font-bold text-primary">{formatIndianRupee(maturityAmount)}</span> {language === 'हि' ? 'मिलेगा' : language === 'Bho' ? 'मिली' : 'পাবেন'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {language === 'हि' ? 'मैच्योर होगा:' : language === 'Bho' ? 'मैच्योर होई:' : 'ম্যাচিওর হবে:'} <span className="font-semibold">{formatDate(maturityDate)}</span>
            {isBeforeDeadline ? (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                {language === 'हि' ? 'डेडलाइन से पहले' : language === 'Bho' ? 'डेडलाइन से पहिले' : 'ডেডলাইনের আগে'} ✓
              </span>
            ) : (
              <span className="ml-2 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                {language === 'हि' ? 'डेडलाइन के बाद' : language === 'Bho' ? 'डेडलाइन के बाद' : 'ডেডলাইনের পরে'} ⚠️
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border-l-4 border-blue-500">
        <div className="flex items-start gap-2">
          <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-gray-700 leading-relaxed">
            {language === 'हि' ? (
              <>यह आपके लिए <span className="font-bold">सबसे बेस्ट ऑप्शन</span> है इस राशि और अवधि के लिए</>
            ) : language === 'Bho' ? (
              <>ई रउरा खातिर <span className="font-bold">सबसे बढ़िया विकल्प</span> बा एह पइसा अउर समय खातिर</>
            ) : (
              <>এই পরিমাণ এবং সময়ের জন্য এটি আপনার জন্য <span className="font-bold">সবচেয়ে সেরা বিকল্প</span></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
