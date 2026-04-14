import { AlertTriangle } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';

interface RiskWarningCardProps {
  penaltyAmount: number;
  suggestion: string;
}

export function RiskWarningCard({ penaltyAmount, suggestion }: RiskWarningCardProps) {
  return (
    <div className="mx-4 mb-4 bg-orange-50 rounded-2xl p-5 border-2 border-orange-200 shadow-md animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-orange-200 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-orange-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">ध्यान दें</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            अगर आपको FD के बीच में पैसे निकालने पड़े, तो आपको लगभग{' '}
            <span className="font-bold text-orange-700">{formatIndianRupee(penaltyAmount)}</span> का
            नुकसान हो सकता है।
          </p>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-2">💡 सुझाव:</p>
        <p className="text-sm text-gray-700 leading-relaxed">{suggestion}</p>
      </div>
    </div>
  );
}
