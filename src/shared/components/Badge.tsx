import styles from './Badge.module.css';

type BadgeTone = 'blue' | 'gold' | 'green' | 'red' | 'muted';

type BadgeProps = {
  children: React.ReactNode;
  tone?: BadgeTone;
};

export const Badge = ({ children, tone = 'muted' }: BadgeProps) => (
  <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
);
