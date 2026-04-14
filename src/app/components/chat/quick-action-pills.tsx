import { Plus, Target, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

interface QuickActionPillsProps {
  onNewFD: () => void;
  onViewGoals: () => void;
  onViewRates: () => void;
}

export function QuickActionPills({ onNewFD, onViewGoals, onViewRates }: QuickActionPillsProps) {
  const { lang, language } = useLanguage();
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={onNewFD}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 active:scale-95 transition-all shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm">
          {language === 'हि' ? 'नया FD करें' : language === 'Bho' ? 'नया FD करीं' : 'নতুন FD করুন'}
        </span>
      </button>
      <button
        onClick={onViewGoals}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all border border-gray-200 shadow-sm"
      >
        <Target className="w-4 h-4" />
        <span className="text-sm">
          {language === 'हि' ? 'लक्ष्य देखें' : language === 'Bho' ? 'लक्ष्य देखीं' : 'লক্ষ্য দেখুন'}
        </span>
      </button>
      <button
        onClick={onViewRates}
        className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 font-semibold rounded-full hover:bg-gray-50 active:scale-95 transition-all border border-gray-200 shadow-sm"
      >
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm">
          {language === 'हि' ? 'FD रेट्स देखें' : language === 'Bho' ? 'FD रेट्स देखीं' : 'FD রেট দেখুন'}
        </span>
      </button>
    </div>
  );
}
