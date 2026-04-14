import { Award } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface FDOption {
  bankName: string;
  tenure: number;
  maturityAmount: number;
  isBest?: boolean;
  differenceFromBest?: number;
}

interface FDComparisonCardProps {
  options: FDOption[];
  onSelect: (bankName: string) => void;
}

export function FDComparisonCard({ options, onSelect }: FDComparisonCardProps) {
  const { lang, language } = useLanguage();
  return (
    <div className="mx-4 mb-4 space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-400">
      {options.map((option, index) => (
        <div
          key={index}
          onClick={() => onSelect(option.bankName)}
          className={`bg-white rounded-2xl p-4 shadow-md cursor-pointer transition-all hover:shadow-lg active:scale-98 ${
            option.isBest
              ? 'border-2 border-primary ring-2 ring-primary/20'
              : 'border border-gray-200'
          }`}
        >
          {option.isBest && (
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary">
                  {language === 'हि' ? 'सबसे बेहतर' : language === 'Bho' ? 'सबसे बढ़िया' : 'সেরা বিকল্প'}
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-bold text-gray-800 text-lg">{option.bankName}</h4>
              <p className="text-sm text-gray-600">
                {option.tenure} {language === 'বাং' ? 'মাসের' : 'महीने की'} FD
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">
                {language === 'हि' ? 'मैच्योरिटी राशि' : language === 'Bho' ? 'मैच्योरिटी राशि' : 'ম্যাচিওরিটির পরিমাণ'}
              </p>
              <p className="text-xl font-bold text-primary">
                {formatIndianRupee(option.maturityAmount)}
              </p>
            </div>
          </div>

          {!option.isBest && option.differenceFromBest && (
            <div className="bg-red-50 px-3 py-2 rounded-lg border border-red-200">
              <p className="text-xs text-red-700">
                {language === 'हि' ? (
                  <>सबसे बेहतर विकल्प से <span className="font-bold">{formatIndianRupee(option.differenceFromBest)}</span> कम</>
                ) : language === 'Bho' ? (
                  <>सबसे बढ़िया विकल्प से <span className="font-bold">{formatIndianRupee(option.differenceFromBest)}</span> कम</>
                ) : (
                  <>সেরা বিকল্পের থেকে <span className="font-bold">{formatIndianRupee(option.differenceFromBest)}</span> কম</>
                )}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
