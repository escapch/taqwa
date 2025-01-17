'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';

interface Props {
  className?: string;
}

const vecizeData = [
  {
    id: 1,
    text: 'Неужели ты создан лишь для этого мира, что тратишь все свое время на него',
    source: 'RNK Слова',
  },
  {
    id: 2,
    text: 'Человек, который является в этом мире мусафиром (путником) не будет привыкать и любить вещи, которые не сможет с собой унести (в другой мир)',
    source: 'RNK',
  },
  {
    id: 3,
    text: 'Часто вспоминайте смерть, которая разрушает наслаждение, получаемое дурными деяниями',
    source: 'RNK Сияния',
  },
];
export const Veсize: React.FC<Props> = ({ className }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const changeQuote = () => {
    setCurrentIndex((prev) => (prev + 1) % vecizeData.length);
  };

  return (
    <Card className={cn('w-full p-3', className)}>
      <p className="text-base font-medium">{vecizeData[currentIndex].text}</p>
      <span className="text-xs text-muted-foreground">
        — {vecizeData[currentIndex].source}
      </span>
      <div className="flex justify-end">
        <RefreshCcw
          className="text-primary cursor-pointer"
          onClick={changeQuote}
        />
      </div>
    </Card>
  );
};
