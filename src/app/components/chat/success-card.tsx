import { CheckCircle2 } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';

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
  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-6 border-2 border-green-300 shadow-lg animate-in fade-in zoom-in-95 duration-500">
      <div className="flex justify-center mb-4">
        <div className="bg-green-500 p-3 rounded-full animate-in zoom-in duration-300 delay-150">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
      </div>

      <div className="text-center mb-5">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">बधाई हो! 🎉</h3>
        <p className="text-base text-gray-700 leading-relaxed">
          आपकी <span className="font-bold">{bankName}</span> में{' '}
          <span className="font-bold">{formatIndianRupee(amount)}</span> की{' '}
          <span className="font-bold">{tenure} महीने</span> की FD सफलतापूर्वक बुक हो गई है।
        </p>
      </div>

      <div className="bg-white rounded-xl p-5 space-y-3">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">मैच्योरिटी तारीख</span>
          <span className="text-sm font-bold text-gray-800">{formatDate(maturityDate)}</span>
        </div>
        <div className="flex justify-between items-center pt-1">
          <span className="text-base text-gray-700">आपको मिलेंगे</span>
          <span className="text-2xl font-bold text-primary">
            {formatIndianRupee(maturityAmount)}
          </span>
        </div>
      </div>

      <div className="mt-4 bg-green-50 rounded-xl p-3 border border-green-200">
        <p className="text-xs text-gray-600 text-center">
          आपको मैच्योरिटी से 7 दिन पहले याद दिला देंगे 📅
        </p>
      </div>
    </div>
  );
}
