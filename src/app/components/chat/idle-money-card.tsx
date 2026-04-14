import { TrendingUp } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';

interface IdleMoneyCardProps {
  idleAmount: number;
  currentEarnings: number;
  potentialEarnings: number;
  onCTAClick: () => void;
}

export function IdleMoneyCard({
  idleAmount,
  currentEarnings,
  potentialEarnings,
  onCTAClick,
}: IdleMoneyCardProps) {
  const extraEarnings = potentialEarnings - currentEarnings;

  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-5 border-2 border-amber-200 shadow-md animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-amber-200 p-2 rounded-full">
          <TrendingUp className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">खाली पैसा मिला!</h3>
          <p className="text-2xl font-bold text-gray-900">{formatIndianRupee(idleAmount)}</p>
        </div>
      </div>

      <div className="bg-white/60 rounded-xl p-4 mb-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">अभी मिल रहा है:</span>
          <span className="text-sm font-semibold text-gray-800">
            {formatIndianRupee(currentEarnings)}/साल
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">FD से मिल सकता है:</span>
          <span className="text-sm font-semibold text-primary">
            {formatIndianRupee(potentialEarnings)}/साल
          </span>
        </div>
        <div className="h-px bg-amber-300 my-2" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">अतिरिक्त कमाई:</span>
          <span className="text-lg font-bold text-primary">
            +{formatIndianRupee(extraEarnings)}
          </span>
        </div>
      </div>

      <button
        onClick={onCTAClick}
        className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 active:scale-98 transition-all"
      >
        FD शुरू करें
      </button>
    </div>
  );
}
