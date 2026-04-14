import { CheckCircle2 } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface SuccessCardProps {
  bankName: string;
  amount: number;
  tenure: number;
  maturityAmount: number;
  maturityDate: Date;
}

export function SuccessCard({
  bankName,
  amount,
  tenure,
  maturityAmount,
  maturityDate,
}: SuccessCardProps) {
  const { lang, language } = useLanguage();
  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 shadow-lg animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-center mb-4">
        <div className="bg-green-500 p-3 rounded-full animate-in zoom-in duration-300 delay-150">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="text-center mb-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {language === 'हि' ? 'बधाई हो! 🎉' : language === 'Bho' ? 'बधाई हो! 🎉' : 'অভিনন্দন! 🎉'}
        </h3>
        <p className="text-base text-gray-700 leading-relaxed">
          {language === 'हि' ? (
            <>आपकी <span className="font-bold">{bankName}</span> में <span className="font-bold">{formatIndianRupee(amount)}</span> की <span className="font-bold">{tenure} महीने</span> की FD सफलतापूर्वक बुक हो गई है।</>
          ) : language === 'Bho' ? (
            <>रउरा <span className="font-bold">{bankName}</span> में <span className="font-bold">{formatIndianRupee(amount)}</span> के <span className="font-bold">{tenure} महीना</span> के FD सफलतापूर्वक बुक हो गइल बा।</>
          ) : (
            <>আপনার <span className="font-bold">{bankName}</span>-এ <span className="font-bold">{formatIndianRupee(amount)}</span>-এর <span className="font-bold">{tenure} মাসের</span> FD সফলভাবে বুক করা হয়েছে।</>
          )}
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">
            {language === 'हि' ? 'मैच्योरिटी तारीख' : language === 'Bho' ? 'मैच्योरिटी तारीख' : 'ম্যাচিওরিটির তারিখ'}
          </span>
          <span className="text-sm font-bold text-gray-800">{formatDate(maturityDate)}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-base text-gray-700">
            {language === 'हि' ? 'आपको मिलेंगे' : language === 'Bho' ? 'रउरा मिली' : 'আপনি পাবেন'}
          </span>
          <span className="text-2xl font-bold text-primary">
            {formatIndianRupee(maturityAmount)}
          </span>
        </div>
      </div>

      <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-200">
        <p className="text-xs text-gray-600 text-center">
          {language === 'हि' ? 'आपको मैच्योरिटी से 7 दिन पहले याद दिला देंगे 📅' : language === 'Bho' ? 'रउरा मैच्योरिटी से 7 दिन पहिले याद दिला देब 📅' : 'ম্যাচিওরিটির ৭ দিন আগে আমরা আপনাকে মনে করিয়ে দেব 📅'}
        </p>
      </div>
    </div>
  );
}
