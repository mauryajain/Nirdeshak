import { CheckCircle2 } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';

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
  const { targetAmount = 0, totalJama = 0 } = goalImpact || {};
  const goalExceeded = totalJama >= targetAmount && targetAmount > 0;
  const extraAmount = Math.max(0, totalJama - targetAmount);
  const remainingGap = Math.max(0, targetAmount - totalJama);

  return (
    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 my-3 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-5 h-5 text-primary" />
        <h4 className="font-bold text-base text-gray-800">FD ka Poora Hisaab</h4>
      </div>

      <div className="space-y-2 bg-gray-50 rounded-lg p-3 mb-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Bank:</span>
          <span className="text-sm font-bold text-gray-800">{bankName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Amount:</span>
          <span className="text-sm font-bold text-primary">{formatIndianRupee(amount)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tenure:</span>
          <span className="text-sm font-bold text-gray-800">{tenure} mahine</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Interest rate:</span>
          <span className="text-sm font-bold text-gray-800">{interestRate}% har saal</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Mature hoga:</span>
          <span className="text-sm font-bold text-gray-800">{formatDate(maturityDate)}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-300">
          <span className="text-sm text-gray-600">Milega:</span>
          <span className="text-base font-bold text-primary">{formatIndianRupee(maturityAmount)}</span>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border-l-4 border-primary">
        <div className="space-y-1.5">
          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">Linked goal:</p>
            <p className="text-xs font-bold text-gray-800">{goalName}</p>
          </div>
          
          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">Goal ki zaroorat:</p>
            <p className="text-xs font-bold text-gray-800">{formatIndianRupee(targetAmount)}</p>
          </div>

          <div className="mb-1">
            <p className="text-xs text-gray-600 mb-0.5">Yeh FD mature hone ke baad milega:</p>
            <p className="text-xs font-bold text-primary">{formatIndianRupee(totalJama)}</p>
          </div>

          <div className="pt-1 border-t border-green-200">
            {goalExceeded ? (
              <p className="text-xs leading-relaxed text-gray-700">
                <span className="font-semibold text-green-700">Matlab:</span> Aapka {goalName.toLowerCase()} goal poora ho jayega aur{' '}
                <span className="font-bold text-green-700">{formatIndianRupee(extraAmount)}</span> extra bhi bachega
              </p>
            ) : (
              <p className="text-xs leading-relaxed text-gray-700">
                Yeh FD se goal ka{' '}
                <span className="font-bold text-primary">{formatIndianRupee(totalJama)}</span> hissa poora hoga.{' '}
                <span className="font-bold text-orange-600">{formatIndianRupee(remainingGap)}</span> abhi bhi chahiye.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}