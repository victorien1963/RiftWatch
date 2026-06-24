import styles from './EmptyState.module.css';

type EmptyStateProps = {
  icon: string;
  title: string;
  description: string;
};

export const EmptyState = ({ icon, title, description }: EmptyStateProps) => (
  <div className={styles.emptyState}>
    <i className={`bi ${icon}`} aria-hidden="true" />
    <strong>{title}</strong>
    <span>{description}</span>
  </div>
);
