import { MessageCircle, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface BottomNavProps {
  activeTab: 'chat' | 'rates' | 'goals';
  onTabChange: (tab: 'chat' | 'rates' | 'goals') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { lang } = useLanguage();

  const tabs = [
    { id: 'chat' as const, label: lang.nav.chat, icon: MessageCircle },
    { id: 'rates' as const, label: lang.nav.rates, icon: TrendingUp },
    { id: 'goals' as const, label: lang.nav.goals, icon: Target },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="max-w-[390px] mx-auto flex justify-around items-center h-16 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
