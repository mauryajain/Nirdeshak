import { useLanguage } from '../../lib/LanguageContext';

interface StepCounterProps {
  currentStep: number;
  totalSteps: number;
}

export function StepCounter({ currentStep, totalSteps }: StepCounterProps) {
  const { lang, language } = useLanguage();
  return (
    <div className="sticky top-0 z-10 bg-primary/10 backdrop-blur-sm px-4 py-2 border-b border-primary/20 animate-in fade-in slide-in-from-top duration-300">
      <div className="max-w-[390px] mx-auto flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {language === 'हि' ? 'FD बुकिंग प्रक्रिया' : language === 'Bho' ? 'FD बुकिंग प्रक्रिया' : 'FD বুকিং প্রক্রিয়া'}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index < currentStep
                    ? 'bg-primary w-3'
                    : index === currentStep
                    ? 'bg-primary/60 w-4'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs font-semibold text-primary">
            {currentStep}/{totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
}
