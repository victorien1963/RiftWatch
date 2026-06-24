import Card from 'react-bootstrap/Card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Badge } from '../../../shared/components/Badge';
import type { MetaTrend } from '../../../shared/types';
import styles from './MetaTrendCard.module.css';

type MetaTrendCardProps = {
  trend: MetaTrend;
};

const trendIcon: Record<MetaTrend['trend'], string> = {
  rising: 'bi-arrow-up-right',
  stable: 'bi-dash-lg',
  falling: 'bi-arrow-down-right',
};

const trendLabel: Record<MetaTrend['trend'], string> = {
  rising: '上升',
  stable: '持平',
  falling: '下降',
};

const roleLabel: Record<MetaTrend['role'], string> = {
  top: 'TOP',
  jungle: 'JUG',
  mid: 'MID',
  bot: 'BOT',
  support: 'SUP',
};

const createChartData = (trend: MetaTrend) => {
  const direction = trend.trend === 'rising' ? 1 : trend.trend === 'falling' ? -1 : 0;
  return Array.from({ length: 7 }, (_, index) => {
    const offset = index - 6;
    return {
      label: `D${offset}`,
      value: Math.max(0, Math.min(100, trend.value + offset * direction * 3)),
    };
  });
};

export const MetaTrendCard = ({ trend }: MetaTrendCardProps) => {
  const chartData = createChartData(trend);

  return (
    <Card className={styles.card}>
      <Card.Body className={styles.body}>
        <div className={styles.header}>
          <div>
            <Badge tone="blue">{roleLabel[trend.role]}</Badge>
            <h3>{trend.label}</h3>
          </div>
          <div className={styles.score}>
            <i className={`bi ${trendIcon[trend.trend]}`} aria-hidden="true" />
            <strong>{trend.value}</strong>
            <span>{trendLabel[trend.trend]}</span>
          </div>
        </div>
        <p>{trend.note}</p>
        <div className={styles.chart} aria-label={`${trend.label} 趨勢圖`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 0, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id={`${trend.id}-value`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#56a8ff" stopOpacity={0.58} />
                  <stop offset="100%" stopColor="#56a8ff" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <YAxis hide domain={[0, 100]} />
              <Tooltip
                cursor={{ stroke: 'rgba(237, 244, 255, 0.18)' }}
                contentStyle={{
                  background: '#101d31',
                  border: '1px solid rgba(202, 214, 232, 0.16)',
                  borderRadius: 8,
                  color: '#edf4ff',
                }}
                labelStyle={{ color: '#d7b56d' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="熱度"
                stroke="#56a8ff"
                strokeWidth={2}
                fill={`url(#${trend.id}-value)`}
                dot={false}
                activeDot={{ r: 4, fill: '#d7b56d', strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};
