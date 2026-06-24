import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import type { AppRoute } from '../../app/routes';
import styles from './PageShell.module.css';

type PageShellProps = {
  activePath: string;
  children: React.ReactNode;
  routes: AppRoute[];
  onNavigate: (path: string) => void;
};

export const PageShell = ({ activePath, children, routes, onNavigate }: PageShellProps) => (
  <Container fluid className={styles.shell}>
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>RIFT WATCH</p>
        <h1>峽谷觀測站</h1>
      </div>
      <div className={styles.signal} aria-label="今日觀測狀態">
        <span />
        Live
      </div>
    </header>
    <Nav className={styles.nav} variant="pills" activeKey={activePath}>
      {routes.map((route) => (
        <Nav.Item key={route.path}>
          <Nav.Link eventKey={route.path} onClick={() => onNavigate(route.path)}>
            <i className={`bi ${route.icon}`} aria-hidden="true" />
            <span>{route.label}</span>
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
    <main className={styles.main}>{children}</main>
  </Container>
);
