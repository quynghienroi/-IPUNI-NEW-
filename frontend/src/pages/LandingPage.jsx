import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Camera, Brain, Sparkles, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.logo}>DIA+</div>
        <button onClick={() => navigate('/login')} className={styles.loginBtn}>
          Đăng nhập
        </button>
      </nav>

      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Sparkles size={16} /> <span>Trợ lý sức khỏe thông minh</span>
          </div>
          <h1 className={styles.title}>
            Quản lý tiểu đường<br />
            <span className={styles.highlight}>Dễ dàng hơn bao giờ hết</span>
          </h1>
          <p className={styles.subtitle}>
            DIA+ giúp bạn theo dõi đường huyết, nhắc nhở uống thuốc và phân tích đơn thuốc tự động bằng AI.
          </p>
          <button onClick={() => navigate('/login')} className={styles.ctaBtn}>
            Bắt đầu miễn phí <ChevronRight size={20} />
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.iconWrap} style={{ background: '#EEF2FF', color: '#4F46E5' }}>
              <Camera size={28} />
            </div>
            <h3>Quét đơn thuốc bằng AI</h3>
            <p>Tự động nhận diện tên thuốc, công dụng, liều dùng chỉ qua một bức ảnh chụp.</p>
          </div>
          
          <div className={styles.card}>
            <div className={styles.iconWrap} style={{ background: '#FEF3C7', color: '#D97706' }}>
              <Brain size={28} />
            </div>
            <h3>Nhắc nhở thông minh</h3>
            <p>Tự động nhắc giờ uống thuốc bằng giọng nói tiếng Việt thân thiện.</p>
          </div>

          <div className={styles.card}>
            <div className={styles.iconWrap} style={{ background: '#DCFCE7', color: '#16A34A' }}>
              <Activity size={28} />
            </div>
            <h3>Theo dõi chỉ số</h3>
            <p>Lưu trữ và theo dõi đường huyết, HbA1c, huyết áp dễ dàng.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.logo}>DIA+</div>
        <p>© 2026 IPUNI-NEW. All rights reserved.</p>
      </footer>
    </div>
  );
}
