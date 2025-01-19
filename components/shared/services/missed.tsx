'use client';
import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Container } from '../container';
import { Header } from '../widgets/header';

export default function Missed() {
  const [startDate, setStartDate] = useState<Date | null>(null); // Начальная дата
  const [customDate, setCustomDate] = useState(''); // Для ввода своей даты

  // Обработчик изменения своей даты
  const handleSetCustomDate = () => {
    const parsedDate = new Date(customDate);
    if (!isNaN(parsedDate.getTime())) {
      setStartDate(parsedDate);
    } else {
      alert('Некорректная дата. Введите дату в формате YYYY-MM-DD.');
    }
  };

  return (
    <Container className="flex flex-col  justify-between gap-5">
      <Header headerTitle="Пропущенные намазы" />
      {!startDate ? (
        <div className="flex flex-col items-center gap-2">
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <button
            onClick={handleSetCustomDate}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Установить начальную дату
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Отслеживание начато с:{' '}
          {new Intl.DateTimeFormat('ru-RU', { dateStyle: 'long' }).format(startDate)}
        </p>
      )}

      {/* Примерный рендер календаря */}
      <Calendar />
    </Container>
  );
}
