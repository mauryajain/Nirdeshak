import { ReactNode } from 'react';

interface ChatBubbleProps {
  type: 'bot' | 'user';
  content: string | ReactNode;
  timestamp?: Date;
}

export function ChatBubble({ type, content, timestamp }: ChatBubbleProps) {
  const isBot = type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-3 px-4 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
          isBot
            ? 'bg-white text-gray-800 rounded-tl-none'
            : 'bg-[#dcfce7] text-gray-800 rounded-tr-none'
        }`}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <p className="text-[11px] text-gray-500 mt-1 text-right">
            {timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
    </div>
  );
}