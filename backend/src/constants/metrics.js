// Glucose & HbA1c constants, thresholds, and targets

const MEASUREMENT_TYPES = {
  GLUCOSE_FASTING: 'glucose_fasting',
  GLUCOSE_POSTMEAL: 'glucose_postmeal',
  GLUCOSE_RANDOM: 'glucose_random',
  HBAIC: 'hba1c'
};

const MEASUREMENT_CATEGORIES = {
  GLUCOSE: 'glucose',
  HBAIC: 'hba1c'
};

const UNITS = {
  GLUCOSE: 'mmol/L',
  HBAIC: '%'
};

// Clinical thresholds for each measurement type
const THRESHOLDS = {
  glucose_fasting: {
    unit: 'mmol/L',
    category: 'glucose',
    normalMax: 5.6,
    warningMin: 5.6,
    warningMax: 6.9,
    dangerMin: 7.0,
    diagnosticCutoff: 7.0
  },

  glucose_postmeal: {
    unit: 'mmol/L',
    category: 'glucose',
    normalMax: 7.8,
    warningMin: 7.8,
    warningMax: 11.0,
    dangerMin: 11.1,
    diagnosticCutoff: 11.1
  },

  glucose_random: {
    unit: 'mmol/L',
    category: 'glucose',
    normalMax: 7.8,
    dangerMin: 11.1,
    diagnosticCutoff: 11.1
  },

  hba1c: {
    unit: '%',
    category: 'hba1c',
    normalMax: 5.7,
    prediabetesMin: 5.7,
    prediabetesMax: 6.4,
    dangerMin: 6.5,
    diagnosticCutoff: 6.5,
    type2Target: 7.0,
    type1Target: 6.5,
    warningThreshold: 8.0
  }
};

// Hypoglycemia threshold (applies to all glucose types)
const HYPOGLYCEMIA_THRESHOLD = 3.9; // mmol/L

// Treatment targets by patient type
const PATIENT_TARGETS = {
  type2_diabetes: {
    glucose: {
      fasting: 7.0,
      postmeal: 7.8,
      random: 7.8
    },
    hba1c: 7.0
  },
  type1_diabetes: {
    glucose: {
      fasting: 5.0,
      postmeal: 7.2,
      random: 7.2
    },
    hba1c: 6.5
  }
};

module.exports = {
  MEASUREMENT_TYPES,
  MEASUREMENT_CATEGORIES,
  UNITS,
  THRESHOLDS,
  HYPOGLYCEMIA_THRESHOLD,
  PATIENT_TARGETS
};
