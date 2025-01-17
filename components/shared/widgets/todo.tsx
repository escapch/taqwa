import React from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface Props {
  className?: string;
}

export const Todo: React.FC<Props> = ({ className }) => {
  return (
    <div className={cn(className)}>
      <Checkbox />
    </div>
  );
};
