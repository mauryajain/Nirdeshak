import { Wallet, ArrowRight } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';

interface SourceConfirmationCardProps {
  maturedAmount: number;
  savingsAmount: number;
}

export function SourceConfirmationCard({ maturedAmount, savingsAmount }: SourceConfirmationCardProps) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-4 my-2">
      <p className="text-sm font-semibold text-gray-800 mb-3">
        Yeh paisa do jagah se aayega:
      </p>

      <div className="space-y-2">
        {maturedAmount > 0 && (
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
            <Wallet className="w-4 h-4 text-green-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Pichli FD ka paisa (savings mein pada hai)</p>
              <p className="text-sm font-bold text-gray-800">{formatIndianRupee(maturedAmount)}</p>
            </div>
          </div>
        )}

        {savingsAmount > 0 && (
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
            <Wallet className="w-4 h-4 text-blue-600" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Aapke savings account se</p>
              <p className="text-sm font-bold text-gray-800">{formatIndianRupee(savingsAmount)}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
        <ArrowRight className="w-3 h-3" />
        <span>Dono account ready hain</span>
      </div>
    </div>
  );
}
