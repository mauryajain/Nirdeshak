import { Plus, Target, TrendingUp } from 'lucide-react';

interface QuickActionPillsProps {
  onNewFD: () => void;
  onViewGoals: () => void;
  onViewRates: () => void;
}

export function QuickActionPills({ onNewFD, onViewGoals, onViewRates }: QuickActionPillsProps) {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={onNewFD}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">नया FD करो</span>
      </button>
      <button
        onClick={onViewGoals}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all border border-gray-200 shadow-sm"
      >
        <Target className="w-4 h-4" />
        <span className="text-sm">Goals देखो</span>
      </button>
      <button
        onClick={onViewRates}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all border border-gray-200 shadow-sm"
      >
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm">FD Rates देखो</span>
      </button>
    </div>
  );
}
