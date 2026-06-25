import Card from 'react-bootstrap/Card';
import { Badge } from '../../../shared/components/Badge';
import type { ChampionChangeType, PatchNote } from '../types';
import styles from './PatchCard.module.css';

type PatchCardProps = {
  patch: PatchNote;
};

const changeTypeLabel: Record<ChampionChangeType, string> = {
  buff: '增強',
  nerf: '削弱',
  adjust: '調整',
  rework: '重製',
};

const changeTypeTone: Record<ChampionChangeType, 'green' | 'red' | 'blue' | 'gold'> = {
  buff: 'green',
  nerf: 'red',
  adjust: 'blue',
  rework: 'gold',
};

const impactTone: Record<PatchNote['impactLevel'], 'muted' | 'blue' | 'gold'> = {
  low: 'muted',
  medium: 'blue',
  high: 'gold',
};

export const PatchCard = ({ patch }: PatchCardProps) => (
  <Card className={styles.card}>
    <Card.Body className={styles.body}>
      <div className={styles.topLine}>
        <Badge tone="gold">Patch {patch.version}</Badge>
        <Badge tone={impactTone[patch.impactLevel]}>{patch.impactLevel}</Badge>
      </div>
      <h3>{patch.title}</h3>
      <p>{patch.summary}</p>
      <div className={styles.changes}>
        {patch.championChanges.length > 0
          ? patch.championChanges.slice(0, 4).map((change) => (
              <span key={change.championName}>
                <Badge tone={changeTypeTone[change.changeType]}>
                  {changeTypeLabel[change.changeType]}
                </Badge>
                {change.championName}
              </span>
            ))
          : patch.systemChanges.slice(0, 2).map((change) => (
              <span key={change.systemName}>
                <Badge tone="blue">公告</Badge>
                {change.systemName}
              </span>
            ))}
      </div>
      <a className={styles.sourceLink} href={patch.sourceUrl} target="_blank" rel="noreferrer">
        查看官方版本公告
      </a>
      <div className={styles.counts}>
        {patch.championChanges.length > 0 ? (
          <span>{patch.championChanges.length} champions</span>
        ) : null}
        {patch.itemChanges.length > 0 ? <span>{patch.itemChanges.length} items</span> : null}
        {patch.systemChanges.length > 0 ? <span>{patch.systemChanges.length} systems</span> : null}
      </div>
    </Card.Body>
  </Card>
);
