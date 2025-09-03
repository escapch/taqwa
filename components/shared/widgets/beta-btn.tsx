import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { FC } from 'react';

export const BetaBtn: FC = () => {
  return (
    <TooltipProvider>
      <div>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={'destructive'}>Бета версия</Badge>
          </TooltipTrigger>
          <TooltipContent className="text-center ">
            <p className="w-[200px]">
              Приложение в разработке. Некоторые функции могут работать не
              идеально. Спасибо за ваше терпение!
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
