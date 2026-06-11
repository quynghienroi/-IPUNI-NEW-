import { CalendarDays } from 'lucide-react';
import { useT } from '../../hooks/useT';
import styles from './AppointmentCard.module.css';

function formatDate(dateStr, t) {
  const d = new Date(dateStr);
  const days = t.days || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[d.getDay()];
  const pad = (n) => String(n).padStart(2, '0');
  return `${dayName}, ${pad(d.getDate())} ${t.months?.[d.getMonth()] || (d.getMonth() + 1)} ${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AppointmentCard({ appointment }) {
  const t = useT();
  const statusLabels = {
    upcoming: t.appointments?.statusUpcoming || 'Upcoming',
    completed: t.appointments?.statusCompleted || 'Completed',
    cancelled: t.appointments?.statusCancelled || 'Cancelled',
  };

  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}><CalendarDays size={22} /></div>
      <div className={styles.info}>
        <div className={styles.title}>{t.appointments?.retakeSchedule || 'Appointment'}</div>
        <div className={styles.doctor}>Dr. {appointment.doctor_name}{appointment.department ? ` - ${appointment.department}` : ''}</div>
        <div className={styles.datetime}>{formatDate(appointment.scheduled_at, t)}</div>
        {appointment.location && <div className={styles.location}>{appointment.location}</div>}
      </div>
      <span className={`${styles.statusBadge} ${styles[appointment.status]}`}>
        {statusLabels[appointment.status]}
      </span>
    </div>
  );
}
