import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpDown, Clock } from 'lucide-react';
import { formatIndianRupee, calculateMaturityAmount } from '../../utils/format';
import type { FDOption } from '../../lib/api';
import * as api from '../../lib/api';
import { useLanguage } from '../../lib/LanguageContext';

interface FDRatesTabProps {
  onSelectFD: (fd: FDOption) => void;
  savedScroll: number;
  onSaveScroll: (position: number) => void;
}

export function FDRatesTab({ onSelectFD, savedScroll, onSaveScroll }: FDRatesTabProps) {
  const { lang } = useLanguage();
  const [sortBy, setSortBy] = useState<'return' | 'tenure'>('return');
  const [fdOptions, setFdOptions] = useState<FDOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const defaultAmount = 50000;

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = savedScroll;
    }
  }, [savedScroll]);

  useEffect(() => {
    let active = true;
    void api.getFdOptions()
      .then((options) => {
        if (active) {
          setFdOptions(options);
        }
      })
      .catch((error) => {
        console.error('Failed to load FD options', error);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // BUG B3 FIX: fdOptions was missing from the dependency array. When the API fetch
  // completed and setFdOptions fired, sortedFDs never recomputed because useMemo only
  // watched sortBy — so the FD cards stayed blank even after data loaded.
  const sortedFDs = useMemo(() => {
    return [...fdOptions].sort((a, b) => {
      if (sortBy === 'return') {
        return b.interestRate - a.interestRate;
      }
      return Math.min(...a.tenures) - Math.min(...b.tenures);
    });
  }, [sortBy, fdOptions]);

  const fdCards = sortedFDs.map((fd) => {
    const maturity = calculateMaturityAmount(defaultAmount, fd.interestRate, 12);
    const earnings = maturity - defaultAmount;

    return (
      <div
        key={fd.id}
        onClick={() => onSelectFD(fd)}
        className="bg-white rounded-2xl p-4 shadow-md border border-gray-200 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer active:scale-98"
      >
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-800">{fd.bankName}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {lang.ratesTab.minAmount}: {formatIndianRupee(fd.minAmount)}
            </p>
          </div>
          <div className="text-right">
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <p className="text-lg font-bold text-primary">{fd.interestRate}%</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">Interest</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-xs text-gray-600 mb-2">उपलब्ध अवधि:</p>
          <div className="flex flex-wrap gap-2">
            {fd.tenures.map((tenure) => (
              <span
                key={tenure}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700"
              >
                {tenure} {lang.ratesTab.months}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-3 border border-green-200">
          <p className="text-xs text-gray-600 mb-1">
            {formatIndianRupee(defaultAmount)} पर 1 साल में मिलेगा:
          </p>
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-primary">{formatIndianRupee(maturity)}</p>
            <p className="text-sm text-green-700">
              +{formatIndianRupee(earnings)} कमाई
            </p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      onScroll={(event) => onSaveScroll((event.target as HTMLElement).scrollTop)}
      className="h-full bg-[#fdfbf7] pb-20 overflow-y-auto"
    >
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-3">{lang.ratesTab.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setSortBy('return')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              sortBy === 'return'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            {lang.ratesTab.highestReturn}
          </button>
          <button
            onClick={() => setSortBy('tenure')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              sortBy === 'tenure'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            {lang.ratesTab.shortestTime}
          </button>
        </div>
      </div>

      {/* FD Cards */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-600 shadow-sm">
            {lang.ratesTab.loading}
          </div>
        ) : sortedFDs.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-gray-600 shadow-sm">
            कोई FD विकल्प उपलब्ध नहीं है।
          </div>
        ) : (
          fdCards
        )}
      </div>
    </div>
  );
}
