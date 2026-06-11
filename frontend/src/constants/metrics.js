// Glucose & HbA1c measurement types and thresholds

export const METRIC_TYPES = {
  glucose_random: { label: 'Đường huyết ngẫu nhiên', normalMax: 7.8, dangerMin: 11.1 },
  glucose_fasting: { label: 'Đường huyết lúc đói', normalMax: 7, dangerMin: 10 },
  glucose_postmeal: { label: 'Đường huyết sau ăn 2h', normalMax: 7.8, dangerMin: 11.1 },
  hba1c: { label: 'HbA1c', normalMax: 5.7, dangerMin: 6.5 }
};

export const MEASUREMENT_TYPES = {
  GLUCOSE_FASTING: 'glucose_fasting',
  GLUCOSE_POSTMEAL: 'glucose_postmeal',
  GLUCOSE_RANDOM: 'glucose_random',
  HBAIC: 'hba1c'
};

export const MEASUREMENT_CATEGORIES = {
  GLUCOSE: 'glucose',
  HBAIC: 'hba1c'
};

export const METRIC_THRESHOLDS = {
  glucose_fasting: {
    normalMax: 5.6,
    warningMin: 5.6,
    warningMax: 6.9,
    dangerMin: 7.0
  },
  glucose_postmeal: {
    normalMax: 7.8,
    warningMin: 7.8,
    warningMax: 11.0,
    dangerMin: 11.1
  },
  glucose_random: {
    normalMax: 7.8,
    dangerMin: 11.1
  },
  hba1c: {
    normalMax: 5.7,
    prediabetesMax: 6.4,
    dangerMin: 6.5
  }
};

export const HYPOGLYCEMIA_THRESHOLD = 3.9;

export function getMetricStatus(measurementType, value) {
  const thresholds = METRIC_THRESHOLDS[measurementType];
  if (!thresholds) return 'normal';

  // Glucose status
  if (measurementType.includes('glucose')) {
    if (value < HYPOGLYCEMIA_THRESHOLD) return 'low';
    if (value >= thresholds.dangerMin) return 'danger';
    if (value > thresholds.normalMax) return 'warning';
    return 'normal';
  }

  // HbA1c status
  if (measurementType === 'hba1c') {
    if (value < thresholds.normalMax) return 'normal';
    if (value <= thresholds.prediabetesMax) return 'prediabetes';
    return 'danger';
  }

  return 'normal';
}

export function getStatusLabel(status, t) {
  const labels = {
    low: t.metrics?.statusLow || 'Low',
    normal: t.metrics?.statusNormal || 'Normal',
    warning: t.metrics?.statusWarning || 'Warning',
    danger: t.metrics?.statusDanger || 'Danger',
    prediabetes: t.metrics?.statusPrediabetes || 'Prediabetes'
  };
  return labels[status] || status;
}
