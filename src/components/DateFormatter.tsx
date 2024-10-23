import React, { useState, useEffect } from 'react';

interface DateFormatterProps {
  dateString: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);

    if (date.toDateString() === today.toDateString()) {
      setFormattedDate('Сегодня');
    } else if (date.toDateString() === tomorrow.toDateString()) {
      setFormattedDate('Завтра');
    } else if (date.toDateString() === dayAfterTomorrow.toDateString()) {
      setFormattedDate('Послезавтра');
    } else {
      const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
      setFormattedDate(date.toLocaleDateString('ru-RU', options));
    }
  }, [dateString]); // Зависимость только от dateString

  return (
    <div>
      {formattedDate}
    </div>
  );
};

export default DateFormatter;