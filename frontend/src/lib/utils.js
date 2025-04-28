import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getAge(birthDateString) {
  const today = new Date();
  const birthDate = new Date(birthDateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getCurrentMonthRevenueAndPercentage(data) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const now = new Date();
  const currentMonthIndex = now.getMonth();
  const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;

  const currentMonth = months[currentMonthIndex];
  const previousMonth = months[previousMonthIndex];

  const currentData = data.find((item) => item.month === currentMonth);
  const previousData = data.find((item) => item.month === previousMonth);

  const currentRevenue = currentData ? currentData.thisYear : 0;
  const previousRevenue = previousData ? previousData.thisYear : 0;

  let percentageChange = 0;
  if (previousRevenue === 0) {
    percentageChange = currentRevenue === 0 ? 0 : 100;
  } else {
    percentageChange = ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }

  // Format the current revenue as currency
  const formattedRevenue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(currentRevenue);

  return {
    revenue: formattedRevenue,
    percentage: percentageChange,
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
