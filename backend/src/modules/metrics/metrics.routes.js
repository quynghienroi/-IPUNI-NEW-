const express = require('express');
const router = express.Router();
const controller = require('./metrics.controller');
const { authMiddleware } = require('../../middlewares/auth.middleware');
const { validate } = require('../../middlewares/validate.middleware');
const { createMetricSchema } = require('./metrics.schema');

router.use(authMiddleware);

// Get latest reading for each type (4 cards on dashboard)
router.get('/latest', controller.getLatestMetrics);

// Get statistics for period
router.get('/statistics', controller.getStatistics);

// Get filtered readings
router.get('/', controller.getMetrics);

// Create new reading
router.post('/', validate(createMetricSchema), controller.createMetric);

// Delete reading
router.delete('/:id', controller.deleteMetric);

module.exports = router;
