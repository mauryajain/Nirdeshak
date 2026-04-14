interface QuickReplyChipsProps {
  options: string[];
  onSelect: (option: string) => void;
}

export function QuickReplyChips({ options, onSelect }: QuickReplyChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 delay-150">
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => onSelect(option)}
          className="px-4 py-2 bg-white border-2 border-primary/20 text-gray-800 rounded-full text-sm font-medium hover:bg-primary/5 hover:border-primary/40 transition-all active:scale-95"
        >
          {option}
        </button>
      ))}
    </div>
  );
}
