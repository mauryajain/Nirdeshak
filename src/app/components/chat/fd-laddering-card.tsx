import { Layers } from 'lucide-react';
import { formatIndianRupee } from '../../utils/format';

interface LadderStep {
  tenure: number;
  amount: number;
  maturityAmount: number;
}

interface FDLadderingCardProps {
  steps: LadderStep[];
}

export function FDLadderingCard({ steps }: FDLadderingCardProps) {
  return (
    <div className="mx-4 mb-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 shadow-md animate-in fade-in slide-in-from-bottom-3 duration-400">
      <div className="flex items-start gap-3 mb-4">
        <div className="bg-green-200 p-2 rounded-full">
          <Layers className="w-5 h-5 text-green-700" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">FD Laddering Plan</h3>
          <p className="text-sm text-gray-600">आपका पैसा तीन हिस्सों में बंटेगा</p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-4 border border-green-200 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">{step.tenure} महीने की FD</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatIndianRupee(step.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">मिलेगा</p>
                <p className="text-lg font-bold text-primary">
                  {formatIndianRupee(step.maturityAmount)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-white/60 rounded-xl p-3">
        <p className="text-xs text-gray-600 leading-relaxed">
          💡 इस तरह से आपके पास हर {steps[0].tenure} महीने में कुछ पैसा मैच्योर होगा, अगर
          ज़रूरत पड़े तो निकाल सकते हैं।
        </p>
      </div>
    </div>
  );
}
