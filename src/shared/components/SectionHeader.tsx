import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  icon: string;
  title: string;
  titleId?: string;
  action?: React.ReactNode;
};

export const SectionHeader = ({ icon, title, titleId, action }: SectionHeaderProps) => (
  <div className={styles.header}>
    <div className={styles.titleWrap}>
      <i className={`bi ${icon}`} aria-hidden="true" />
      <h2 id={titleId}>{title}</h2>
    </div>
    {action ? <div className={styles.action}>{action}</div> : null}
  </div>
);
