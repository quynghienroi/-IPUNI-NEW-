exports.seed = async function(knex) {
  await knex('medications').del();

  await knex('medications').insert([
    {
      id: 1,
      user_id: 1,
      name: 'Metformin',
      dosage: '500mg',
      frequency: '2 lần/ngày',
      times: JSON.stringify(['07:00', '19:00']),
      instructions: 'Uống sau bữa ăn chính. Dùng với nước ấm. Tránh uống với cà phê.',
      doctor_name: 'Nguyễn Văn A',
      prescribed_at: new Date('2026-05-15'),
      is_active: 1,
    },
    {
      id: 2,
      user_id: 1,
      name: 'Amlodipine',
      dosage: '5mg',
      frequency: '1 lần/ngày',
      times: JSON.stringify(['08:00']),
      instructions: 'Uống vào buổi sáng. Có thể uống cùng hoặc sau bữa ăn.',
      doctor_name: 'Trần Thị B',
      prescribed_at: new Date('2026-06-01'),
      is_active: 1,
    },
    {
      id: 3,
      user_id: 1,
      name: 'Insulin Glargine',
      dosage: '100 IU/ml',
      frequency: '1 lần/ngày',
      times: JSON.stringify(['22:00']),
      instructions: 'Tiêm dưới da (subcutaneous). Tại chỗ khác nhau mỗi lần. Bảo quản ở tủ lạnh 2-8°C.',
      doctor_name: 'Lê Hoàng C',
      prescribed_at: new Date('2026-04-20'),
      is_active: 1,
    },
  ]);
};
