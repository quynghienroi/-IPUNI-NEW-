const { THRESHOLDS, HYPOGLYCEMIA_THRESHOLD, PATIENT_TARGETS } = require('../../constants/metrics');

class MetricsCalculator {
  /**
   * Calculate status based on measurement type and value
   * @param {string} measurementType - glucose_fasting, glucose_postmeal, glucose_random, hba1c
   * @param {number} value - The metric value
   * @returns {string} - 'low' | 'normal' | 'warning' | 'danger' | 'prediabetes'
   */
  static calculateStatus(measurementType, value) {
    const thresholds = THRESHOLDS[measurementType];
    if (!thresholds) return null;

    // Glucose readings
    if (measurementType.includes('glucose')) {
      if (value < HYPOGLYCEMIA_THRESHOLD) return 'low';
      if (value >= thresholds.dangerMin) return 'danger';
      if (value > thresholds.normalMax) return 'warning';
      return 'normal';
    }

    // HbA1c reading
    if (measurementType === 'hba1c') {
      if (value < thresholds.normalMax) return 'normal';
      if (value <= thresholds.prediabetesMax) return 'prediabetes';
      return 'danger';
    }

    return null;
  }

  /**
   * Estimate HbA1c from average glucose (EAGA Formula - ADA Validated)
   * HbA1c (%) = (0.0915 × Avg_Glucose_mmol/L) + 2.15
   * Accuracy: ±15-20% (biological variation)
   *
   * @param {number} avgGlucoseMmolL - Average glucose in mmol/L
   * @returns {number|null} - Estimated HbA1c percentage
   */
  static estimateHbA1c(avgGlucoseMmolL) {
    if (!avgGlucoseMmolL || avgGlucoseMmolL <= 0) return null;

    const estimated = (0.0915 * avgGlucoseMmolL) + 2.15;

    // Clamp to reasonable range
    if (estimated < 4.0) return 4.0;
    if (estimated > 15.0) return 15.0;

    return Math.round(estimated * 100) / 100; // 2 decimal places
  }

  /**
   * Reverse: Calculate average glucose from HbA1c
   * Avg_Glucose_mg/dL = 28.7 × HbA1c (%) - 46.7
   * Returns in mmol/L
   *
   * @param {number} hba1cPercent - HbA1c in percentage
   * @returns {number|null} - Average glucose in mmol/L
   */
  static getAvgGlucoseFromHbA1c(hba1cPercent) {
    if (!hba1cPercent || hba1cPercent <= 0) return null;

    const avgGlucoseMgdL = (28.7 * hba1cPercent) - 46.7;
    const avgGlucoseMmolL = avgGlucoseMgdL / 18; // Convert to mmol/L

    return Math.round(avgGlucoseMmolL * 10) / 10; // 1 decimal place
  }

  /**
   * Calculate statistics from readings
   * @param {Array} readings - Array of metric objects with .value
   * @returns {Object|null} - Statistics object
   */
  static getStatistics(readings) {
    if (!readings || readings.length === 0) return null;

    const values = readings.map(r => r.value);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    // Standard deviation
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of Variation (CV%)
    const cv = (stdDev / avg) * 100;

    return {
      count: readings.length,
      average: Math.round(avg * 10) / 10,
      minimum: Math.round(min * 10) / 10,
      maximum: Math.round(max * 10) / 10,
      stdDev: Math.round(stdDev * 10) / 10,
      cv: Math.round(cv) // Percentage
    };
  }

  /**
   * Categorize reading for a specific patient
   * @param {string} measurementType - Type of measurement
   * @param {number} value - The value
   * @param {string} patientType - type2_diabetes or type1_diabetes
   * @returns {Object} - Status and target info
   */
  static categorizeReading(measurementType, value, patientType = 'type2_diabetes') {
    const status = this.calculateStatus(measurementType, value);
    const target = PATIENT_TARGETS[patientType];

    if (!target) return { status };

    let targetValue = null;

    if (measurementType.includes('glucose')) {
      const glucoseType = measurementType.replace('glucose_', '');
      targetValue = target.glucose[glucoseType];
    } else if (measurementType === 'hba1c') {
      targetValue = target.hba1c;
    }

    return {
      status,
      targetValue,
      isAboveTarget: targetValue ? value > targetValue : null
    };
  }

  /**
   * Convert glucose between units
   * @param {number} value - Value to convert
   * @param {string} fromUnit - 'mmol/L' or 'mg/dL'
   * @param {string} toUnit - 'mmol/L' or 'mg/dL'
   * @returns {number} - Converted value
   */
  static convertGlucoseUnit(value, fromUnit, toUnit) {
    if (fromUnit === toUnit) return value;

    if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
      return Math.round(value * 18);
    }

    if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
      return Math.round((value / 18) * 10) / 10;
    }

    return value;
  }
}

module.exports = MetricsCalculator;
