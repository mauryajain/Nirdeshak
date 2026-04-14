export function formatIndianRupee(amount: number): string {
  // Handle undefined, null, or NaN values
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Math.round(amount).toString();
  const lastThree = num.substring(num.length - 3);
  const otherNumbers = num.substring(0, num.length - 3);

  if (otherNumbers !== '') {
    return '₹' + otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }

  return '₹' + lastThree;
}

export function formatDate(date: Date): string {
  const months = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function calculateMaturityAmount(principal: number, rate: number, tenureMonths: number): number {
  const annualRate = rate / 100;
  const years = tenureMonths / 12;
  return Math.round(principal * (1 + annualRate * years));
}