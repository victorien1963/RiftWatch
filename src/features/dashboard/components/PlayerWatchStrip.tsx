import { SectionHeader } from '../../../shared/components/SectionHeader';
import styles from './PlayerWatchStrip.module.css';

type WatchedPlayer = {
  id: string;
  name: string;
  team: string;
  role: string;
  initials: string;
};

const watchedPlayers: WatchedPlayer[] = [
  { id: 'faker', name: 'Faker', team: 'T1', role: 'MID', initials: 'F' },
  { id: 'keria', name: 'Keria', team: 'T1', role: 'SUP', initials: 'K' },
  { id: 'chovy', name: 'Chovy', team: 'GEN', role: 'MID', initials: 'C' },
  { id: 'oner', name: 'Oner', team: 'T1', role: 'JUG', initials: 'O' },
  { id: 'peyz', name: 'Peyz', team: 'T1', role: 'ADC', initials: 'P' },
];

export const PlayerWatchStrip = () => (
  <section className={styles.section} aria-labelledby="player-watch-title">
    <SectionHeader icon="bi-person-lines-fill" title="追蹤選手" titleId="player-watch-title" />
    <div className={styles.scroller}>
      {watchedPlayers.map((player) => (
        <article className={styles.player} key={player.id}>
          <span className={styles.avatar} aria-hidden="true">
            {player.initials}
          </span>
          <div>
            <strong>{player.name}</strong>
            <span>
              {player.team} · {player.role}
            </span>
          </div>
        </article>
      ))}
    </div>
  </section>
);
