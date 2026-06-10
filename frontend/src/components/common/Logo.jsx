import logoImg from '../../assets/logo.jpg';
import styles from './Logo.module.css';

/**
 * Props:
 *   size    — 'sm' (32px) | 'md' (48px) | 'lg' (72px)
 *   variant — 'onDark' (nền tối/màu, tách nền trắng) | 'onLight' (nền sáng, hiển thị thường)
 *   showText — true/false: hiện chữ "DIA+" bên cạnh
 */
export default function Logo({ size = 'md', variant = 'onDark', showText = false, className = '' }) {
  return (
    <div className={`${styles.wrap} ${styles[size]} ${className}`}>
      <img
        src={logoImg}
        alt="DIA+"
        className={`${styles.img} ${variant === 'onDark' ? styles.onDark : styles.onLight}`}
        draggable={false}
      />
      {showText && <span className={`${styles.text} ${variant === 'onDark' ? styles.textOnDark : ''}`}>DIA+</span>}
    </div>
  );
}
