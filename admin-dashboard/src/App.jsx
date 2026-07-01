import { useState, useEffect, useCallback } from 'react';
import { adminApi, getKey, setKey, clearKey } from './api';
import { TrafficLineChart, DistributionPie, HorizontalBar } from './components/Charts';

const REFRESH_MS = 30000;

export default function App() {
  const [authed, setAuthed] = useState(!!getKey());

  if (!authed) return <LoginGate onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { clearKey(); setAuthed(false); }} />;
}

/* ───────────────────────── Cổng đăng nhập ───────────────────────── */
function LoginGate({ onSuccess }) {
  const [val, setVal] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    setKey(val.trim());
    try {
      await adminApi.overview(); // thử gọi để kiểm tra key
      onSuccess();
    } catch (e2) {
      clearKey();
      setErr(e2.response?.status === 401 ? 'Sai key quản trị' : `Không kết nối được backend (${e2.message})`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">IPUNI<span>·</span>Theo dõi</div>
        <p className="login-sub">Trang quản trị nội bộ — nhập key để tiếp tục</p>
        <input
          type="password"
          className="login-input"
          placeholder="Admin key"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          autoFocus
        />
        {err && <div className="login-err">{err}</div>}
        <button className="btn btn-primary" disabled={loading || !val.trim()}>
          {loading ? 'Đang kiểm tra…' : 'Đăng nhập'}
        </button>
        <div className="login-hint">Backend: {adminApi.baseUrl}</div>
      </form>
    </div>
  );
}

/* ───────────────────────── Dashboard chính ───────────────────────── */
function Dashboard({ onLogout }) {
  const [days, setDays] = useState(14);
  const [overview, setOverview] = useState(null);
  const [charts, setCharts] = useState(null);
  const [recent, setRecent] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      const [o, c, r, h] = await Promise.all([
        adminApi.overview(),
        adminApi.charts(days),
        adminApi.recent(),
        adminApi.health().catch(() => null),
      ]);
      setOverview(o); setCharts(c); setRecent(r); setHealth(h);
      setLastUpdated(new Date());
    } catch (e) {
      if (e.response?.status === 401) { onLogout(); return; }
      setError(`Lỗi tải dữ liệu: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [days, onLogout]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const t = setInterval(load, REFRESH_MS);
    return () => clearInterval(t);
  }, [load]);

  async function doExport() {
    setExporting(true);
    setExportMsg('');
    try {
      await adminApi.exportSheets(days);
      setExportMsg('✓ Đã xuất sang Google Sheets');
    } catch (e) {
      setExportMsg(`✗ ${e.response?.data?.message || e.message}`);
    } finally {
      setExporting(false);
      setTimeout(() => setExportMsg(''), 5000);
    }
  }

  if (loading) return <div className="center-screen">Đang tải dữ liệu…</div>;

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">IPUNI <span className="brand-dim">· Bảng theo dõi</span></div>
        <div className="topbar-actions">
          <HealthDot health={health} />
          <select className="select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>7 ngày</option>
            <option value={14}>14 ngày</option>
            <option value={30}>30 ngày</option>
            <option value={90}>90 ngày</option>
          </select>
          <button className="btn" onClick={load}>↻ Làm mới</button>
          <button className="btn btn-sheets" onClick={doExport} disabled={exporting}>
            {exporting ? 'Đang xuất…' : '⊞ Xuất Google Sheets'}
          </button>
          <button className="btn btn-ghost" onClick={onLogout}>Đăng xuất</button>
        </div>
      </header>

      {exportMsg && <div className="banner">{exportMsg}</div>}
      {error && <div className="banner banner-err">{error}</div>}

      <div className="updated">
        Cập nhật lúc {lastUpdated?.toLocaleTimeString('vi-VN')} · tự làm mới mỗi 30 giây
      </div>

      {/* KPI */}
      <section className="kpi-grid">
        <Kpi label="Lượt truy cập web" value={overview.pageViews} sub={`Hôm nay: ${overview.pageViewsToday}`} accent="#6366F1" />
        <Kpi label="Khách duy nhất" value={overview.uniqueVisitors} sub="Theo phiên" accent="#06B6D4" />
        <Kpi label="Người dùng đăng ký" value={overview.realUsers} sub={`Mới hôm nay: ${overview.newUsersToday}`} accent="#22C55E" />
        <Kpi label="Lượt dùng Demo" value={overview.demoUsers} sub="Bấm 'Dùng thử'" accent="#A855F7" />
        <Kpi label="Lượt quét ảnh" value={overview.totalScans} sub={`Tháng này: ${overview.scansThisMonth}`} accent="#F59E0B" />
        <Kpi label="Người dùng Pro" value={overview.proUsers} sub="Gói trả phí" accent="#EC4899" />
        <Kpi label="Hoạt động 30 ngày" value={overview.activeUsers30d} sub="Có nhập chỉ số" accent="#84CC16" />
        <Kpi label="Tổng chỉ số nhập" value={overview.totalMetrics} sub={`${overview.totalAppointments} lịch hẹn`} accent="#EF4444" />
      </section>

      {/* Biểu đồ */}
      <section className="chart-grid">
        <div className="span-2"><TrafficLineChart timeseries={charts.timeseries} /></div>
        <HorizontalBar title="Tổng quan hành vi" data={charts.eventBreakdown} color="#6366F1" />
        <DistributionPie title="Phân bố gói (Free / Pro)" data={charts.planDistribution} />
        <DistributionPie title="Người dùng thật / Demo" data={charts.userTypeDistribution} />
        <HorizontalBar title="Trang được xem nhiều nhất" data={charts.topPages} color="#22C55E" />
        <DistributionPie title="Phân bố chẩn đoán" data={charts.diagnosisDistribution} />
      </section>

      {/* Bảng dữ liệu */}
      <section className="table-grid">
        <RecentUsers users={recent?.recentUsers || []} />
        <RecentScans scans={recent?.recentScans || []} />
      </section>

      <SystemHealthPanel health={health} />

      <footer className="footer">IPUNI Admin · dữ liệu từ {adminApi.baseUrl}</footer>
    </div>
  );
}

/* ───────────────────────── Thành phần con ───────────────────────── */
function Kpi({ label, value, sub, accent }) {
  return (
    <div className="kpi" style={{ borderTopColor: accent }}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{Number(value ?? 0).toLocaleString('vi-VN')}</div>
      <div className="kpi-sub">{sub}</div>
    </div>
  );
}

function HealthDot({ health }) {
  const ok = health?.dbConnected;
  return (
    <span className="health-dot" title={ok ? 'Backend OK' : 'Backend lỗi'}>
      <span className={`dot ${ok ? 'dot-ok' : 'dot-bad'}`} />
      {ok ? 'Online' : 'Offline'}
    </span>
  );
}

function RecentUsers({ users }) {
  return (
    <div className="card">
      <h3 className="card-title">Người dùng mới nhất</h3>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Mã</th><th>Tên</th><th>Email</th><th>Gói</th><th>Ngày</th></tr></thead>
          <tbody>
            {users.length === 0 && <tr><td colSpan={5} className="td-empty">Chưa có</td></tr>}
            {users.map((u) => (
              <tr key={u.id}>
                <td className="mono">{u.user_code}</td>
                <td>{u.name || '—'}</td>
                <td className="dim">{u.email || '—'}</td>
                <td><span className={`pill ${u.plan === 'pro' ? 'pill-pro' : 'pill-free'}`}>{u.plan}</span></td>
                <td className="dim">{fmtDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecentScans({ scans }) {
  return (
    <div className="card">
      <h3 className="card-title">Lượt quét ảnh gần đây</h3>
      <div className="table-scroll">
        <table>
          <thead><tr><th>#</th><th>Người dùng</th><th>Email</th><th>Thời gian</th></tr></thead>
          <tbody>
            {scans.length === 0 && <tr><td colSpan={4} className="td-empty">Chưa có</td></tr>}
            {scans.map((s) => (
              <tr key={s.id}>
                <td className="mono">{s.id}</td>
                <td className="mono">{s.user_code || s.user_id}</td>
                <td className="dim">{s.email || '—'}</td>
                <td className="dim">{fmtDateTime(s.scanned_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SystemHealthPanel({ health }) {
  if (!health) return null;
  return (
    <div className="card health-panel">
      <h3 className="card-title">Tình trạng hệ thống</h3>
      <div className="health-grid">
        <HealthItem label="Database" value={health.dbConnected ? `OK (${health.dbLatencyMs}ms)` : 'Lỗi'} ok={health.dbConnected} />
        <HealthItem label="Uptime" value={fmtUptime(health.uptimeSec)} ok />
        <HealthItem label="RAM" value={`${health.memoryMb} MB`} ok />
        <HealthItem label="Node" value={health.nodeVersion} ok />
        <HealthItem label="Google Sheets" value={health.sheetsConfigured ? 'Đã cấu hình' : 'Chưa cấu hình'} ok={health.sheetsConfigured} />
      </div>
    </div>
  );
}

function HealthItem({ label, value, ok }) {
  return (
    <div className="health-item">
      <span className="health-item-label">{label}</span>
      <span className={`health-item-value ${ok ? 'ok' : 'bad'}`}>{value}</span>
    </div>
  );
}

/* ───────────────────────── Tiện ích ───────────────────────── */
function fmtDate(s) {
  if (!s) return '—';
  const d = new Date(s.replace(' ', 'T'));
  return isNaN(d) ? s : d.toLocaleDateString('vi-VN');
}
function fmtDateTime(s) {
  if (!s) return '—';
  const d = new Date(s.replace(' ', 'T'));
  return isNaN(d) ? s : d.toLocaleString('vi-VN');
}
function fmtUptime(sec) {
  if (!sec) return '—';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
