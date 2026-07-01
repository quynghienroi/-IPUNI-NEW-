const db = require('../../config/database');

/* ───────────────────────── Helpers thời gian ───────────────────────── */

function pad(n) {
  return String(n).padStart(2, '0');
}

// Trả về chuỗi 'YYYY-MM-DD HH:MM:SS' (so sánh được trực tiếp với cột datetime của SQLite)
function toSqlDateTime(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return toSqlDateTime(d);
}

function startOfMonth() {
  const d = new Date();
  return toSqlDateTime(new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0));
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return toSqlDateTime(d);
}

// Lọc user demo: demoLogin tạo email dạng demo_xxxx@ipuni.com
const DEMO_LIKE = 'demo\\_%@ipuni.com';
function notDemo(qb) {
  return qb.whereRaw("email NOT LIKE ? ESCAPE '\\'", [DEMO_LIKE]);
}
function isDemo(qb) {
  return qb.whereRaw("email LIKE ? ESCAPE '\\'", [DEMO_LIKE]);
}

async function countWhere(table, builder) {
  const q = db(table);
  if (builder) builder(q);
  const row = await q.count('* as c').first();
  return Number(row.c) || 0;
}

/* ───────────────────────── Ghi sự kiện ───────────────────────── */

async function recordEvent({ event_type, path, session_id, user_id, referrer, user_agent, meta }) {
  if (!event_type) throw { status: 400, message: 'Thiếu event_type' };
  return db('analytics_events').insert({
    event_type,
    path: path || null,
    session_id: session_id || null,
    user_id: user_id || null,
    referrer: referrer || null,
    user_agent: user_agent ? String(user_agent).slice(0, 500) : null,
    meta: meta ? JSON.stringify(meta) : null,
  });
}

/* ───────────────────────── Tổng quan (KPI) ───────────────────────── */

async function getOverview() {
  const today = startOfToday();
  const monthStart = startOfMonth();
  const since30 = daysAgo(30);

  const [
    totalUsers,
    demoUsers,
    realUsers,
    proUsers,
    totalScans,
    scansThisMonth,
    totalMedications,
    totalAppointments,
    totalMetrics,
    pageViews,
    pageViewsToday,
  ] = await Promise.all([
    countWhere('users'),
    countWhere('users', isDemo),
    countWhere('users', notDemo),
    countWhere('users', (q) => notDemo(q).andWhere('plan', 'pro')),
    countWhere('scan_usages'),
    countWhere('scan_usages', (q) => q.where('scanned_at', '>=', monthStart)),
    countWhere('medications'),
    countWhere('appointments'),
    countWhere('metrics'),
    countWhere('analytics_events', (q) => q.where('event_type', 'page_view')),
    countWhere('analytics_events', (q) => q.where('event_type', 'page_view').andWhere('created_at', '>=', today)),
  ]);

  // Khách truy cập duy nhất (theo session_id)
  const uniqRow = await db('analytics_events')
    .where('event_type', 'page_view')
    .whereNotNull('session_id')
    .countDistinct('session_id as c')
    .first();
  const uniqueVisitors = Number(uniqRow.c) || 0;

  // Người dùng hoạt động 30 ngày (có nhập chỉ số)
  const activeRow = await db('metrics')
    .where('measured_at', '>=', since30)
    .countDistinct('user_id as c')
    .first();
  const activeUsers30d = Number(activeRow.c) || 0;

  // Đăng ký mới hôm nay
  const newUsersToday = await countWhere('users', (q) => notDemo(q).andWhere('created_at', '>=', today));

  return {
    pageViews,
    pageViewsToday,
    uniqueVisitors,
    totalUsers,
    realUsers,
    demoUsers,            // = số lượt bấm "Dùng thử Demo"
    proUsers,
    newUsersToday,
    activeUsers30d,
    totalScans,
    scansThisMonth,
    totalMedications,
    totalAppointments,
    totalMetrics,
    generatedAt: new Date().toISOString(),
  };
}

/* ───────────────────────── Dữ liệu biểu đồ ───────────────────────── */

// Gộp một mảng {day, count} thành map để fill đủ ngày
function fillSeries(rows, days) {
  const map = {};
  rows.forEach((r) => { map[r.day] = Number(r.count) || 0; });
  const out = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    out.push({ day: key, label: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`, count: map[key] || 0 });
  }
  return out;
}

async function getCharts(days = 14) {
  const since = daysAgo(days - 1);

  // Chuỗi thời gian: lượt truy cập / đăng ký / quét ảnh theo ngày
  const [viewsRows, regsRows, scansRows] = await Promise.all([
    db('analytics_events')
      .where('event_type', 'page_view')
      .andWhere('created_at', '>=', since)
      .select(db.raw('date(created_at) as day'))
      .count('id as count')
      .groupByRaw('date(created_at)'),
    db('users')
      .whereRaw("email NOT LIKE ? ESCAPE '\\'", [DEMO_LIKE])
      .andWhere('created_at', '>=', since)
      .select(db.raw('date(created_at) as day'))
      .count('id as count')
      .groupByRaw('date(created_at)'),
    db('scan_usages')
      .where('scanned_at', '>=', since)
      .select(db.raw('date(scanned_at) as day'))
      .count('id as count')
      .groupByRaw('date(scanned_at)'),
  ]);

  // Phân bố gói (pie)
  const free = await countWhere('users', (q) => notDemo(q).andWhere('plan', 'free'));
  const pro = await countWhere('users', (q) => notDemo(q).andWhere('plan', 'pro'));

  // Phân loại người dùng (pie)
  const real = await countWhere('users', notDemo);
  const demo = await countWhere('users', isDemo);

  // Phân bố chẩn đoán (pie)
  const diagnosisRows = await db('users')
    .whereRaw("email NOT LIKE ? ESCAPE '\\'", [DEMO_LIKE])
    .select('diagnosis')
    .count('id as count')
    .groupBy('diagnosis');

  // Top trang được xem nhiều nhất (horizontal bar)
  const topPagesRows = await db('analytics_events')
    .where('event_type', 'page_view')
    .whereNotNull('path')
    .select('path')
    .count('id as count')
    .groupBy('path')
    .orderBy('count', 'desc')
    .limit(10);

  // Tổng quan hành vi (pie / bar): truy cập vs đăng ký vs demo vs quét
  const eventBreakdown = [
    { name: 'Lượt truy cập', value: await countWhere('analytics_events', (q) => q.where('event_type', 'page_view')) },
    { name: 'Đăng ký', value: real },
    { name: 'Dùng demo', value: demo },
    { name: 'Quét ảnh', value: await countWhere('scan_usages') },
  ];

  return {
    timeseries: {
      views: fillSeries(viewsRows, days),
      registrations: fillSeries(regsRows, days),
      scans: fillSeries(scansRows, days),
    },
    planDistribution: [
      { name: 'Free', value: free },
      { name: 'Pro', value: pro },
    ],
    userTypeDistribution: [
      { name: 'Người dùng thật', value: real },
      { name: 'Tài khoản demo', value: demo },
    ],
    diagnosisDistribution: diagnosisRows.map((r) => ({
      name: r.diagnosis || 'Không rõ',
      value: Number(r.count) || 0,
    })),
    topPages: topPagesRows.map((r) => ({ name: r.path, value: Number(r.count) || 0 })),
    eventBreakdown,
  };
}

/* ───────────────────────── Bảng dữ liệu gần đây ───────────────────────── */

async function getRecent() {
  const recentUsers = await db('users')
    .whereRaw("email NOT LIKE ? ESCAPE '\\'", [DEMO_LIKE])
    .select('id', 'user_code', 'name', 'email', 'plan', 'diagnosis', 'created_at')
    .orderBy('created_at', 'desc')
    .limit(15);

  const recentScans = await db('scan_usages as s')
    .leftJoin('users as u', 's.user_id', 'u.id')
    .select('s.id', 's.user_id', 's.scanned_at', 'u.email', 'u.user_code')
    .orderBy('s.scanned_at', 'desc')
    .limit(15);

  return { recentUsers, recentScans };
}

/* ───────────────────────── Báo cáo cho Google Sheets ───────────────────────── */

async function buildReport(days = 14) {
  const [overview, charts] = await Promise.all([getOverview(), getCharts(days)]);
  return { overview, charts, exportedAt: new Date().toISOString() };
}

module.exports = {
  recordEvent,
  getOverview,
  getCharts,
  getRecent,
  buildReport,
};
