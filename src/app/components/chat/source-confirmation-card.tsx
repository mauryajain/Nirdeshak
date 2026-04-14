import { Wallet, ArrowRight } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';
import { useLanguage } from '../../lib/LanguageContext';

interface SourceConfirmationCardProps {
  maturedAmount: number;
  savingsAmount: number;
}

export function SourceConfirmationCard({ maturedAmount, savingsAmount }: SourceConfirmationCardProps) {
  const { lang, language } = useLanguage();
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 my-2">
      <p className="text-sm font-semibold text-gray-800 mb-3">
        {language === 'हि' ? 'यह पैसा दो जगह से आएगा:' : language === 'Bho' ? 'ई पइसा दो जगह से आई:' : 'এই টাকা দুটি জায়গা থেকে আসবে:'}
      </p>

      <div className="space-y-2">
        {maturedAmount > 0 && (
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
            <Wallet className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">
                {language === 'हि' ? 'पिछली FD का पैसा (बचत खाते में)' : language === 'Bho' ? 'पिछला FD के पइसा (बचत खाता में)' : 'আগের FD-র টাকা (সঞ্চয় অ্যাকাউন্টে আছে)'}
              </p>
              <p className="text-sm font-bold text-gray-800">{formatIndianRupee(maturedAmount)}</p>
            </div>
          </div>
        )}

        {savingsAmount > 0 && (
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
            <Wallet className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">
                {language === 'हि' ? 'आपके बचत खाते से' : language === 'Bho' ? 'रउरा बचत खाता से' : 'আপনার সঞ্চয় অ্যাকাউন্ট থেকে'}
              </p>
              <p className="text-sm font-bold text-gray-800">{formatIndianRupee(savingsAmount)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <ArrowRight className="w-3 h-3" />
        <span>
          {language === 'हि' ? 'दोनों अकाउंट तैयार हैं' : language === 'Bho' ? 'दोनो अकाउंट एकदम रेडी बा' : 'দুটি অ্যাকাউন্টই তৈরি আছে'}
        </span>
      </div>
    </div>
  );
}
