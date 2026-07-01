module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'diaplus-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  METRIC_TYPES: ['fasting', 'post_meal_2h', 'pre_meal', 'pre_sleep'],
  ADVICE_CATEGORIES: ['should_eat', 'should_avoid', 'exercise', 'danger_sign'],
  // Admin Dashboard
  ADMIN_DASHBOARD_KEY: process.env.ADMIN_DASHBOARD_KEY || 'ipuni-admin-2026',
  GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL || '',
};
