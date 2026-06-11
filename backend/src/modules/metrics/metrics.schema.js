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
    // HbA1c: 4.0-15.0 %
    if (data.measurement_type === 'hba1c') {
      return data.value >= 4.0 && data.value <= 15.0;
    }
    return false;
  },
  {
    message: 'Value out of valid range for this measurement type',
    path: ['value']
  }
);

module.exports = { createMetricSchema };
