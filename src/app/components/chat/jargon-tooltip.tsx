import { useState } from 'react';
import { Info } from 'lucide-react';

interface JargonTooltipProps {
  term: string;
  explanation: string;
}

export function JargonTooltip({ term, explanation }: JargonTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-primary underline decoration-dotted underline-offset-2 hover:decoration-solid transition-all"
      >
        {term}
      </button>
      {isOpen && (
        <div className="inline-block ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
          <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 inline-flex items-start gap-2 max-w-[250px]">
            <Info className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-gray-700">{explanation}</span>
          </div>
        </div>
      )}
    </span>
  );
}
