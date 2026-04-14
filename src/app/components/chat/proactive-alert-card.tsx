import { AlertCircle, TrendingDown, Wallet, Calendar } from 'lucide-react';

interface ProactiveAlertCardProps {
  type: 'goal-at-risk' | 'idle-matured' | 'idle-savings' | 'upcoming-maturity';
  title: string;
  message: string;
  amount: number;
  ctaText: string;
  onCTAClick: () => void;
}

export function ProactiveAlertCard({
  type,
  title,
  message,
  amount,
  ctaText,
  onCTAClick,
}: ProactiveAlertCardProps) {
  const getIcon = () => {
    switch (type) {
      case 'goal-at-risk':
        return <TrendingDown className="w-5 h-5 text-orange-600" />;
      case 'idle-matured':
        return <Wallet className="w-5 h-5 text-primary" />;
      case 'idle-savings':
        return <Wallet className="w-5 h-5 text-blue-600" />;
      case 'upcoming-maturity':
        return <Calendar className="w-5 h-5 text-purple-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'goal-at-risk':
        return 'bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200';
      case 'idle-matured':
        return 'bg-gradient-to-br from-primary/5 to-green-100/50 border-primary/20';
      case 'idle-savings':
        return 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200';
      case 'upcoming-maturity':
        return 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`mb-4 rounded-2xl p-5 border ${getBgColor()}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="bg-white/80 p-2 rounded-lg">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{message}</p>
          <p className="text-lg font-bold text-gray-900 mt-2">
            ₹{amount.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
      <button
        onClick={onCTAClick}
        className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 active:scale-98 transition-all shadow-sm"
      >
        {ctaText}
      </button>
    </div>
  );
}
