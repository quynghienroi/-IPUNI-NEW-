import { Bell, BookOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';
import useThemeStore from '../../store/themeStore';
import Logo from '../common/Logo';
import styles from './TopBar.module.css';

export default function TopBar() {
  const navigate = useNavigate();
  const { isCuteMode } = useThemeStore();

  return (
    <header className={styles.topbar}>
      <div className={styles.logo}>
        <Logo size="sm" variant="onDark" />
        <span className={styles.logoText}>DIA+</span>
        {isCuteMode && <Sparkles size={14} color="#fff" strokeWidth={2.5} />}
        {isCuteMode && <span className={styles.cuteBadge}>cute</span>}
      </div>
      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Lời khuyên" onClick={() => navigate('/advice')}>
          <BookOpen size={20} />
        </button>
        <button className={styles.bellBtn} title="Thông báo">
          <Bell size={20} />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
