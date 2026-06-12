import { Pill, Clock } from 'lucide-react';
import Modal from '../common/Modal';
import { withDoctorPrefix } from '../../utils/doctor';
import styles from './MedicationDetailModal.module.css';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{value}</span>
    </div>
  );
}

export default function MedicationDetailModal({ medication, onClose }) {
  const med = medication || {};
  const times = Array.isArray(med.times) ? med.times : [];
  const prescribedAt = med.prescribed_at
    ? new Date(med.prescribed_at).toLocaleDateString('vi-VN')
    : null;

  return (
    <Modal title="Chi tiết thuốc" onClose={onClose}>
      <div className={styles.hero}>
        <div className={styles.imgWrap}>
          {med.image ? (
            <img src={med.image} alt={med.name} className={styles.img} draggable={false} />
          ) : (
            <Pill size={32} color="#1B5FA6" />
          )}
        </div>
        <div>
          <div className={styles.name}>{med.name}</div>
          {med.dosage && <div className={styles.dosage}>{med.dosage}</div>}
        </div>
      </div>

      <div className={styles.section}>
        <Row label="Tên đầy đủ" value={med.full_name || med.name} />
        <Row label="Xuất xứ" value={med.origin} />
        <Row label="Tác dụng chính" value={med.main_effect || med.instructions} />
        <Row label="Tác dụng phụ" value={med.side_effects} />
        <Row label="Liều dùng" value={med.frequency} />
        <Row label="Bác sĩ kê đơn" value={med.doctor_name ? withDoctorPrefix(med.doctor_name) : null} />
        <Row label="Ngày kê đơn" value={prescribedAt} />
      </div>

      {times.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Giờ uống</div>
          <div className={styles.timeList}>
            {times.map((tm, i) => (
              <div key={i} className={styles.timeItem}>
                <Clock size={14} color="#1B5FA6" /> {tm}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
