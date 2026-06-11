import { Activity, Plus } from 'lucide-react';
import { METRIC_TYPES, getMetricStatus } from '../../constants/metrics';
import { useT } from '../../hooks/useT';
import styles from './MetricCard.module.css';

export function MetricCard({ type, metric }) {
  const t = useT();
  const typeLabel = t.metrics?.types?.[type] || type;
  const status = metric ? getMetricStatus(type, metric.value) : null;

  return (
    <div className={styles.card}>
      <div className={styles.cardLabel}>
        <span>{typeLabel}</span>
        <Activity size={14} color="#1B5FA6" />
      </div>
      <div className={`${styles.cardValue} ${status ? styles[status] : ''}`}>
        {metric ? `${metric.value}` : '—'}
      </div>
      <div className={styles.cardSub}>
        {metric ? 'mmol/L' : t.common?.noData || 'No data'}
      </div>
    </div>
  );
}

export function AddMetricCard({ onClick }) {
  const t = useT();
  return (
    <div className={styles.addCard} onClick={onClick}>
      <div className={styles.addIcon}><Plus size={18} /></div>
      <span className={styles.addLabel}>{t.dashboard?.addMetric || 'Add metric'}</span>
    </div>
  );
}
