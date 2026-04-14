import { useLanguage } from '../../lib/LanguageContext';

interface GreetingCardProps {
  userName: string;
  idleAmount: number;
}

const DICT = {
  'हि': {
    getGreeting: (hour: number) => {
      if (hour < 12) return 'शुभ प्रभात';
      if (hour < 17) return 'नमस्कार';
      return 'शुभ संध्या';
    },
    titleSuffix: 'जी',
    idleText: (amt: string) => `आपके पास ₹${amt} बेकार पड़ा है — काम पे लगाएं?`,
  },
  'Bho': {
    getGreeting: (hour: number) => {
      if (hour < 12) return 'राम राम';
      if (hour < 17) return 'प्रणाम';
      return 'शुभ सांझ';
    },
    titleSuffix: 'जी',
    idleText: (amt: string) => `रउरा लगे ₹${amt} फालतू पड़ल बा — काम प लगाईं जा?`,
  },
  'বাং': {
    getGreeting: (hour: number) => {
      if (hour < 12) return 'সুপ্রভাত';
      if (hour < 17) return 'নমস্কার';
      return 'শুভ সন্ধ্যা';
    },
    titleSuffix: 'মশাই',
    idleText: (amt: string) => `আপনার কাছে ₹${amt} অলস পড়ে আছে — কাজে লাগাবেন?`,
  }
};

export function GreetingCard({ userName, idleAmount }: GreetingCardProps) {
  const { lang, language } = useLanguage();
  const t = (DICT as any)[language] || DICT['हि'];
  const hour = new Date().getHours();
  const greeting = t.getGreeting(hour);

  return (
    <div className="mb-4 bg-gradient-to-br from-primary/5 to-green-50 rounded-2xl p-5 border border-primary/10">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        {greeting}, {userName} {t.titleSuffix}
      </h2>
      <p className="text-sm text-gray-600">
        {t.idleText(idleAmount.toLocaleString('en-IN'))}
      </p>
    </div>
  );
}
