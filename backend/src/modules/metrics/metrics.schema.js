const { z } = require('zod');
const { MEASUREMENT_TYPES } = require('../../constants/metrics');

// Validate measurement_type exists
const measurementTypeSchema = z.string()
  .refine(
    (type) => Object.values(MEASUREMENT_TYPES).includes(type),
    { message: 'Invalid measurement type' }
  );

// Main creation schema
const createMetricSchema = z.object({
  measurement_type: measurementTypeSchema,
  value: z.number().positive('Value must be positive'),
  value_diastolic: z.number().positive('Diastolic must be positive').optional().nullable(),
  measured_at: z.string()
    .datetime({ offset: true })
    .or(z.string().min(1, 'Invalid datetime')),
  note: z.string().optional().nullable()
})
.refine(
  (data) => {
    // Glucose: 0.1-50 mmol/L
    if (data.measurement_type.includes('glucose')) {
      return data.value >= 0.1 && data.value <= 50;
    }
    // HbA1c: 3.0-20.0 %
    if (data.measurement_type === 'hba1c') {
      return data.value >= 3.0 && data.value <= 20.0;
    }
    // C-peptide: 0-20 ng/mL
    if (data.measurement_type === 'c_peptide') {
      return data.value >= 0 && data.value <= 20;
    }
    // Blood pressure: systolic 40-250, diastolic 30-150
    if (data.measurement_type === 'blood_pressure') {
      const validSystolic = data.value >= 40 && data.value <= 250;
      const validDiastolic = data.value_diastolic != null ? (data.value_diastolic >= 30 && data.value_diastolic <= 150) : true;
      return validSystolic && validDiastolic;
    }
    return false;
  },
  {
    message: 'Value out of valid range for this measurement type',
    path: ['value']
  }
);

module.exports = { createMetricSchema };
