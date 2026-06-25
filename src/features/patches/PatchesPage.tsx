import BsBadge from 'react-bootstrap/Badge';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { SectionHeader } from '../../shared/components/SectionHeader';
import { usePatchStore } from '../../shared/stores/patchStore';
import type { ChampionChangeType, PatchNote } from '../../shared/types';
import { formatShortDate } from '../../shared/utils/date';
import styles from './PatchesPage.module.css';

const impactVariant: Record<PatchNote['impactLevel'], string> = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
};

const changeTypeLabel: Record<ChampionChangeType, string> = {
  buff: 'buff',
  nerf: 'nerf',
  adjust: 'adjust',
  rework: 'rework',
};

const changeTypeVariant: Record<ChampionChangeType, string> = {
  buff: 'success',
  nerf: 'danger',
  adjust: 'info',
  rework: 'warning',
};

const sortByReleasedAtDesc = (items: PatchNote[]): PatchNote[] =>
  [...items].sort(
    (patchA, patchB) =>
      new Date(patchB.releasedAt).getTime() - new Date(patchA.releasedAt).getTime(),
  );

export const PatchesPage = () => {
  const patches = usePatchStore((state) => state.patches);
  const sortedPatches = sortByReleasedAtDesc(patches);

  return (
    <section className={styles.page} aria-labelledby="patches-page-title">
      <SectionHeader icon="bi-lightning-charge" title="版本追蹤" titleId="patches-page-title" />

      <div className={styles.list}>
        {sortedPatches.map((patch) => (
          <Card className={styles.patchCard} key={patch.id}>
            <Card.Body className={styles.cardBody}>
              <div className={styles.topLine}>
                <div className={styles.metaGroup}>
                  <BsBadge bg="warning" text="dark">
                    Patch {patch.version}
                  </BsBadge>
                  <BsBadge bg={impactVariant[patch.impactLevel]} text="dark">
                    {patch.impactLevel}
                  </BsBadge>
                </div>
                <span>{formatShortDate(patch.releasedAt)}</span>
              </div>
              <h2>{patch.title}</h2>
              <p>{patch.summary}</p>
              <a
                className={styles.sourceLink}
                href={patch.sourceUrl}
                target="_blank"
                rel="noreferrer"
              >
                查看官方版本公告
              </a>

              {patch.championChanges.length > 0 ||
              patch.itemChanges.length > 0 ||
              patch.systemChanges.some((change) => change.systemName !== '官方版本公告') ? (
                <Accordion className={styles.accordion} flush>
                  {patch.championChanges.length > 0 ? (
                    <Accordion.Item eventKey="champions">
                      <Accordion.Header>Champion Changes</Accordion.Header>
                      <Accordion.Body>
                        <div className={styles.changeList}>
                          {patch.championChanges.map((change) => (
                            <article className={styles.changeItem} key={change.championName}>
                              <div>
                                <strong>{change.championName}</strong>
                                {change.role ? <span>{change.role}</span> : null}
                              </div>
                              <BsBadge bg={changeTypeVariant[change.changeType]}>
                                {changeTypeLabel[change.changeType]}
                              </BsBadge>
                              <p>{change.summary}</p>
                            </article>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : null}

                  {patch.itemChanges.length > 0 ? (
                    <Accordion.Item eventKey="items">
                      <Accordion.Header>Item Changes</Accordion.Header>
                      <Accordion.Body>
                        <div className={styles.changeList}>
                          {patch.itemChanges.map((change) => (
                            <article className={styles.changeItem} key={change.itemName}>
                              <div>
                                <strong>{change.itemName}</strong>
                              </div>
                              <BsBadge bg={changeTypeVariant[change.changeType]}>
                                {changeTypeLabel[change.changeType]}
                              </BsBadge>
                              <p>{change.summary}</p>
                            </article>
                          ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : null}

                  {patch.systemChanges.some((change) => change.systemName !== '官方版本公告') ? (
                    <Accordion.Item eventKey="systems">
                      <Accordion.Header>System Changes</Accordion.Header>
                      <Accordion.Body>
                        <div className={styles.changeList}>
                          {patch.systemChanges
                            .filter((change) => change.systemName !== '官方版本公告')
                            .map((change) => (
                              <article className={styles.systemItem} key={change.systemName}>
                                <strong>{change.systemName}</strong>
                                <p>{change.summary}</p>
                              </article>
                            ))}
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ) : null}
                </Accordion>
              ) : null}
            </Card.Body>
          </Card>
        ))}
      </div>
    </section>
  );
};
