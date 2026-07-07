'use client';

import { FC } from 'react';
import { Card } from '@/components/ui/card';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { format, parseISO, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';
import styles from './stats-heatmap.module.css';
import { StatsDaily } from './types';

const MONTH_LABELS: [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
] = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];

interface Props {
  daily: StatsDaily[];
}

export const StatsHeatmap: FC<Props> = ({ daily }) => {
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // react-calendar-heatmap parses string dates as UTC while it buckets
  // startDate/endDate by local calendar day, so raw 'YYYY-MM-DD' strings
  // can land in the wrong day (or no day at all) depending on timezone.
  // Passing Date objects (via parseISO, which is local-time) sidesteps that.
  const values = daily.map((d) => ({ ...d, date: parseISO(d.date) }));

  return (
    <Card className="p-4">
      <div className={`${styles.heatmapWrap} overflow-x-auto`}>
        <div className="w-fit">
          <CalendarHeatmap
            // react-calendar-heatmap anchors its visible range off endDate and
            // derives day-count from (endDate - startDate), so a same-day
            // startDate/endDate (e.g. a brand-new user) yields a 0-day count
            // and renders nothing. Padding startDate back by a day keeps the
            // count >= 1 while endDate still lands on the real last day.
            startDate={daily[0] ? subDays(parseISO(daily[0].date), 1) : undefined}
            endDate={daily.length ? parseISO(daily[daily.length - 1].date) : undefined}
            values={values}
            monthLabels={MONTH_LABELS}
            gutterSize={2}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              const dateStr = format(value.date, 'yyyy-MM-dd');
              if (value.total === 0) return dateStr === todayStr ? 'color-empty' : 'color-missed';
              if (value.completed === value.total) return 'color-completed';
              if (value.completed > 0) return 'color-partial';
              return 'color-missed';
            }}
            titleForValue={(value) => {
              if (!value) return '';
              return `${format(value.date, 'd MMMM yyyy', { locale: ru })}: ${value.completed}/${value.total}`;
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 pt-4 border-t text-sm font-medium text-muted-foreground">
        <LegendDot color="hsl(142, 76%, 36%)" label="Все прочитано" />
        <LegendDot color="hsl(48, 96%, 53%)" label="Частично" />
        <LegendDot color="hsl(0, 84%, 60%)" label="Есть пропуски" />
      </div>
    </Card>
  );
};

const LegendDot: FC<{ color: string; label: string }> = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
    <span>{label}</span>
  </div>
);
