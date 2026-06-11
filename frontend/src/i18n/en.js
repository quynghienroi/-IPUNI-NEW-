const en = {
  // Nav
  nav: {
    home: 'Overview',
    metrics: 'Metrics',
    scan: 'Scan',
    medications: 'Medications',
    appointments: 'Appointments',
  },

  // Dashboard
  dashboard: {
    greetNight: 'Good night,',
    greetMorning: 'Good morning,',
    greetAfternoon: 'Good afternoon,',
    greetEvening: 'Good evening,',
    greetNightCute: 'Sweet dreams,',
    greetMorningCute: 'Rise and shine,',
    greetAfternoonCute: 'Have a lovely afternoon,',
    greetEveningCute: 'Good evening, cutie,',
    metricsSection: 'Latest Metrics',
    metricsSectionCute: '✨ Latest Metrics',
    viewAll: 'View all >',
    viewAllCute: 'View all 🔍',
    todayMeds: "Today's Medications",
    viewPrescription: 'View Rx',
    viewPrescriptionCute: 'View Rx 💊',
    noMeds: 'No medications',
    noMedsSubtitle: 'No prescription has been issued yet.',
    addMetric: 'Add Metric',
  },

  // Metrics page
  metrics: {
    title: 'Track Metrics',
    subtitle: 'Log and view your health metrics chart',
    addBtn: 'Add Metric',
    days7: '7 days',
    days14: '14 days',
    days30: '30 days',
    noData: 'No data yet',
    noDataSubtitle: 'Enter your first metric reading.',
    glucoseLabel: 'Glucose',
    hba1cLabel: 'HbA1c',
    types: {
      glucose_random: 'Random Blood Glucose',
      glucose_fasting: 'Fasting Blood Glucose',
      glucose_postmeal: 'Post-meal (2h)',
      hba1c: 'HbA1c (3-month average)',
    },
    thresholds: {
      fasting: 'Normal: <7 mmol/L | Danger: >10 mmol/L',
      post_meal_2h: 'Normal: <7.8 mmol/L | Danger: >11.1 mmol/L',
      pre_meal: 'Normal: 4.4-7.2 mmol/L | Danger: >10 mmol/L',
      pre_sleep: 'Normal: 5.0-8.3 mmol/L | Danger: >10 mmol/L',
    },
    statusLow: 'Low Blood Sugar',
    statusNormal: 'Normal',
    statusWarning: 'Warning',
    statusDanger: 'Danger',
    statusPrediabetes: 'Prediabetes',
    hypoglycemia: 'Low Blood Sugar (<3.9 mmol/L)',
    statisticsTitle: 'Statistics',
    average: 'Average',
    minimum: 'Min',
    maximum: 'Max',
    readingCount: 'Count',
    estimatedHbA1c: 'Est. HbA1c',
    estimatedNote: '(±15-20% accuracy)',
  },

  // Add metric modal
  addMetric: {
    title: 'Add Metric',
    typeLabel: 'Glucose Type',
    valueLabel: 'Value (mmol/L)',
    valuePlaceholder: 'e.g. 6.5',
    timeLabel: 'Measured At',
    noteLabel: 'Note (optional)',
    notePlaceholder: 'Add a note...',
    saveBtn: 'Save Metric',
    saving: 'Saving...',
    invalidValue: 'Please enter a valid value (0.1 – 50 mmol/L)',
    errorGeneric: 'Something went wrong',
  },

  // Medications page
  medications: {
    title: 'Prescriptions & Reminders',
    subtitle: 'Manage your doctor-prescribed medications',
    noMeds: 'No medications',
    noMedsSubtitle: 'No prescription issued yet. Please contact your doctor.',
  },

  // Appointments page
  appointments: {
    title: 'Appointments & Guidance',
    subtitle: 'Follow-up schedule and doctor instructions',
    tabAppointments: 'Appointments',
    tabDoctor: 'From Doctor',
    noAppointments: 'No appointments',
    noAppointmentsSubtitle: 'Your doctor will schedule a follow-up after each visit.',
    noDoctorNotes: 'No doctor notes',
    noDoctorNotesSubtitle: 'Your doctor will add notes after each visit.',
    statusUpcoming: 'Upcoming',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    doctorNote: 'Doctor\'s Notes',
    retakeSchedule: 'Follow-up Appointment',
  },

  // Advice page
  advice: {
    title: 'Health Advice',
    subtitle: 'Diet and lifestyle guidance',
    allAdvice: 'All',
    shouldEat: 'Foods to Eat',
    shouldAvoid: 'Foods to Avoid',
    exercise: 'Exercise',
    danger: 'Alerts',
  },

  // Auth
  auth: {
    loginTitle: 'Sign In',
    loginSubtitle: 'Welcome back',
    loginBtn: 'Sign In',
    loggingIn: 'Signing in...',
    identifierLabel: 'Email / ID Number',
    identifierPlaceholder: 'Email or national ID',
    passwordLabel: 'Password',
    noAccount: "Don't have an account?",
    registerLink: 'Sign up',
    loginFailed: 'Login failed',
    fillAll: 'Please fill in all fields',

    registerTitle: 'Create Account',
    registerSubtitle: 'Enter your details to get started',
    registerBtn: 'Create Account',
    registering: 'Creating account...',
    cccdLabel: 'National ID',
    phoneLabel: 'Phone Number',
    confirmPasswordLabel: 'Confirm Password',
    hasAccount: 'Already have an account?',
    loginLink: 'Sign in',
    registerFailed: 'Registration failed',
    cccdInvalid: 'National ID must be exactly 12 digits',
    phoneInvalid: 'Invalid phone number',
    passwordTooShort: 'Password must be at least 6 characters',
    passwordMismatch: 'Passwords do not match',

    tagline: 'Diabetes health tracking app',
    taglineRegister: 'Create a new account\nto start tracking your health',
    taglineLogin: 'Track your diabetes health\nanytime, anywhere',
  },

  // User menu
  userMenu: {
    upgrade: 'Upgrade',
    profile: 'My Profile',
    language: 'Language',
    theme: 'Appearance',
    settings: 'Settings',
    logout: 'Log Out',
  },

  // Settings
  settings: {
    title: 'Settings',
    sectionTheme: 'Appearance',
    cuteMode: 'Cute Mode',
    cuteModeDesc: 'Pastel and playful interface',
    goldTheme: 'Gold Theme',
    goldThemeDesc: 'Premium interface exclusive to Pro accounts',
    sectionNotify: 'Notifications',
    reminderTitle: 'Blood Glucose Reminder',
    reminderDesc: 'Daily reminders at 7:00 AM and 5:00 PM',
    sectionOther: 'Other',
    privacy: 'Privacy',
    privacyDesc: 'Manage your health data',
    support: 'Help & Support',
    supportDesc: 'FAQ and contact support',
    comingSoon: 'Coming soon',
    version: 'DIA+ v1.0.0 — Smart Health Care',
  },

  // Common
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    back: 'Back',
    success: 'Success!',
    error: 'Something went wrong',
  },

  // Days of week
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  dateFormat: (d, m, y) => `${m}/${d}/${y}`,
};

export default en;
