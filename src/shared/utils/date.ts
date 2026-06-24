const timeFormatter = new Intl.DateTimeFormat('zh-TW', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const shortDateFormatter = new Intl.DateTimeFormat('zh-TW', {
  month: '2-digit',
  day: '2-digit',
  weekday: 'short',
});

export const formatTime = (isoDate: string): string => timeFormatter.format(new Date(isoDate));

export const formatShortDate = (isoDate: string): string =>
  shortDateFormatter.format(new Date(isoDate));

export const getRelativeDayLabel = (isoDate: string, today: Date): string => {
  const target = new Date(isoDate);
  const targetStart = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round(
    (targetStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    return '今天';
  }

  if (diffDays === 1) {
    return '明天';
  }

  if (diffDays === -1) {
    return '昨天';
  }

  return formatShortDate(isoDate);
};
