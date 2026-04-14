interface GreetingCardProps {
  userName: string;
  idleAmount: number;
}

export function GreetingCard({ userName, idleAmount }: GreetingCardProps) {
  // Get time-based greeting
  const hour = new Date().getHours();
  let greeting = 'नमस्कार';
  if (hour < 12) {
    greeting = 'शुभ प्रभात';
  } else if (hour < 17) {
    greeting = 'नमस्कार';
  } else {
    greeting = 'शुभ संध्या';
  }

  return (
    <div className="mb-4 bg-gradient-to-br from-primary/5 to-green-50 rounded-2xl p-5 border border-primary/10">
      <h2 className="text-2xl font-bold text-gray-900 mb-1">
        {greeting}, {userName} जी
      </h2>
      <p className="text-sm text-gray-600">
        आपके पास ₹{idleAmount.toLocaleString('en-IN')} बेकार पड़ा है — काम पे लगाएं?
      </p>
    </div>
  );
}
