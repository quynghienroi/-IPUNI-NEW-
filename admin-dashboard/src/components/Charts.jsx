import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const PALETTE = ['#6366F1', '#22C55E', '#F59E0B', '#EF4444', '#06B6D4', '#A855F7', '#EC4899', '#84CC16'];

function ChartCard({ title, children, height = 280 }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </div>
  );
}

/* Biểu đồ đường: xu hướng theo ngày */
export function TrafficLineChart({ timeseries }) {
  // Gộp 3 chuỗi theo cùng nhãn ngày
  const data = (timeseries?.views || []).map((v, i) => ({
    label: v.label,
    'Lượt truy cập': v.count,
    'Đăng ký': timeseries?.registrations?.[i]?.count ?? 0,
    'Quét ảnh': timeseries?.scans?.[i]?.count ?? 0,
  }));

  return (
    <ChartCard title="Xu hướng theo ngày">
      <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="Lượt truy cập" stroke="#6366F1" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Đăng ký" stroke="#22C55E" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Quét ảnh" stroke="#F59E0B" strokeWidth={2} dot={false} />
      </LineChart>
    </ChartCard>
  );
}

/* Biểu đồ tròn */
export function DistributionPie({ title, data }) {
  const clean = (data || []).filter((d) => d.value > 0);
  return (
    <ChartCard title={title}>
      {clean.length === 0 ? (
        <Empty />
      ) : (
        <PieChart>
          <Pie
            data={clean}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(e) => `${e.name}: ${e.value}`}
            labelLine={false}
          >
            {clean.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
          </Pie>
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      )}
    </ChartCard>
  );
}

/* Biểu đồ cột ngang */
export function HorizontalBar({ title, data, color = '#6366F1' }) {
  const clean = (data || []).filter((d) => d.value > 0);
  return (
    <ChartCard title={title} height={Math.max(220, clean.length * 38 + 40)}>
      {clean.length === 0 ? (
        <Empty />
      ) : (
        <BarChart data={clean} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#cbd5e1', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
          <Bar dataKey="value" fill={color} radius={[0, 6, 6, 0]} barSize={22} />
        </BarChart>
      )}
    </ChartCard>
  );
}

function Empty() {
  return <div className="chart-empty">Chưa có dữ liệu</div>;
}
