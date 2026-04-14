import { Target } from 'lucide-react';
import { formatIndianRupee, formatDate } from '../../utils/format';

interface ContextCardProps {
  goalName: string;
  amount: number;
  deadline: Date;
  targetAmount: number;
}

export function ContextCard({ goalName, amount, deadline, targetAmount }: ContextCardProps) {
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-primary/30 rounded-xl p-4 mb-4 sticky top-0 z-10 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-600 mb-1">
            {goalName} goal ke liye FD shuru kar rahe hain
          </p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-gray-600">Goal target:</span>
            <span className="text-sm font-bold text-gray-800">{formatIndianRupee(targetAmount)}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xs text-gray-600">Invest kar rahe:</span>
            <span className="text-lg font-bold text-primary">{formatIndianRupee(amount)}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-600">Deadline:</span>
            <span className="text-sm font-semibold text-gray-800">{formatDate(deadline)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}