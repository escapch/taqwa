import { cn } from '@/lib/utils';
import React from 'react';

interface Props {
  className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div className={cn('sm:mx-auto max-w-[640px] my-4 mb-20 mx-1', className)}>
      {children}
    </div>
  );
};
