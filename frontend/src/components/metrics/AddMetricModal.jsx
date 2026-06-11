import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { MEASUREMENT_TYPES } from '../../constants/metrics';
import { useT } from '../../hooks/useT';
import styles from './AddMetricModal.module.css';

function nowLocalISO() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return {
    date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    time: `${pad(now.getHours())}:${pad(now.getMinutes())}`
  };
}

export default function AddMetricModal({ onClose, onSave, onSuccess, defaultType }) {
  const { date, time } = nowLocalISO();
  const t = useT();
  const [measurementType, setMeasurementType] = useState(defaultType || MEASUREMENT_TYPES.GLUCOSE_FASTING);
  const [value, setValue] = useState('');
  const [measuredDate, setMeasuredDate] = useState(date);
  const [measuredTime, setMeasuredTime] = useState(time);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const isHbA1c = measurementType === MEASUREMENT_TYPES.HBAIC;
  const minValue = isHbA1c ? 4.0 : 0.1;
  const maxValue = isHbA1c ? 15.0 : 50;
  const unit = isHbA1c ? '%' : 'mmol/L';
  const placeholder = isHbA1c ? '6.8' : '7.0';

  const handleSave = async () => {
    const num = parseFloat(value);

    if (!value || isNaN(num) || num < minValue || num > maxValue) {
      setError(
        isHbA1c
          ? `HbA1c must be between ${minValue}-${maxValue} %`
          : `Glucose must be between ${minValue}-${maxValue} mmol/L`
      );
      return;
    }

    setError('');
    setSaving(true);

    try {
      const measured_at = new Date(`${measuredDate}T${measuredTime}:00`).toISOString();
      await onSave({
        measurement_type: measurementType,
        value: num,
        measured_at,
        note: note.trim() || undefined
      });
      onSuccess?.();
      onClose();
    } catch (e) {
      setError(e?.response?.data?.message || t.addMetric.errorGeneric || 'Error saving metric');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={t.addMetric?.title || 'Add Measurement'} onClose={onClose}>
      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric?.typeLabel || 'Type'}</label>
        <select
          className={styles.select}
          value={measurementType}
          onChange={(e) => setMeasurementType(e.target.value)}
        >
          <optgroup label={t.metrics?.glucoseLabel || 'Glucose'}>
            <option value={MEASUREMENT_TYPES.GLUCOSE_FASTING}>
              {t.metrics?.types?.glucose_fasting || 'Fasting'}
            </option>
            <option value={MEASUREMENT_TYPES.GLUCOSE_POSTMEAL}>
              {t.metrics?.types?.glucose_postmeal || 'Post-meal (2h)'}
            </option>
            <option value={MEASUREMENT_TYPES.GLUCOSE_RANDOM}>
              {t.metrics?.types?.glucose_random || 'Random'}
            </option>
          </optgroup>

          <optgroup label={t.metrics?.hba1cLabel || 'HbA1c'}>
            <option value={MEASUREMENT_TYPES.HBAIC}>
              {t.metrics?.types?.hba1c || 'HbA1c (3-month average)'}
            </option>
          </optgroup>
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric?.valueLabel || 'Value'}</label>
        <div className={styles.valueRow}>
          <input
            className={styles.input}
            type="number"
            step="0.1"
            min={minValue}
            max={maxValue}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <span className={styles.unit}>{unit}</span>
        </div>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric?.timeLabel || 'Time'}</label>
        <div className={styles.dateRow}>
          <input
            className={styles.input}
            type="date"
            value={measuredDate}
            onChange={(e) => setMeasuredDate(e.target.value)}
          />
          <input
            className={styles.input}
            type="time"
            value={measuredTime}
            onChange={(e) => setMeasuredTime(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>{t.addMetric?.noteLabel || 'Note'}</label>
        <textarea
          className={styles.textarea}
          placeholder={t.addMetric?.notePlaceholder || 'Optional notes...'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button full onClick={handleSave} disabled={saving}>
        {saving ? t.addMetric?.saving || 'Saving...' : t.addMetric?.saveBtn || 'Save'}
      </Button>
    </Modal>
  );
}
