import { Trash2 } from 'lucide-react';
import { METRIC_TYPES, getMetricStatus } from '../../constants/metrics';
import { useT } from '../../hooks/useT';

const STATUS_COLORS = {
  normal: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  low: '#7C3AED'
};

export default function MetricHistoryItem({ metric, onDelete }) {
  const t = useT();
  const typeLabel = t.metrics?.types?.[metric.type] || metric.type;
  const status = getMetricStatus(metric.type, metric.value);
  const color = STATUS_COLORS[status];

  const statusLabels = {
    normal: t.metrics?.statusNormal || 'Normal',
    warning: t.metrics?.statusWarning || 'Warning',
    danger: t.metrics?.statusDanger || 'Danger',
    low: t.metrics?.statusLow || 'Low'
  };

  const dt = new Date(metric.measured_at);
  const pad = (n) => String(n).padStart(2, '0');
  const timeStr = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
  const dateStr = `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #F1F5F9', gap: 12 }}>
      <div style={{ width: 4, height: 40, borderRadius: 2, background: color, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#1A2332' }}>{metric.value}</span>
          <span style={{ fontSize: 12, color: '#6B7A8D' }}>mmol/L</span>
          <span style={{ fontSize: 11, fontWeight: 600, color, marginLeft: 4, background: `${color}18`, padding: '2px 7px', borderRadius: 20 }}>
            {statusLabels[status]}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#6B7A8D', marginTop: 2 }}>
          {typeLabel} · {timeStr} {dateStr}
        </div>
        {metric.note && <div style={{ fontSize: 12, color: '#6B7A8D', marginTop: 2, fontStyle: 'italic' }}>{metric.note}</div>}
      </div>
      <button onClick={() => onDelete(metric.id)} style={{ color: '#EF4444', padding: 6, borderRadius: 8, background: '#FFF1F2' }}>
        <Trash2 size={15} />
      </button>
    </div>
  );
}
