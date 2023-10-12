const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Rutas para servicios
router.get('/services', serviceController.getServices);
router.get('/services/en', serviceController.getServicesEn);
router.post('/services', serviceController.createService);
router.delete('/services', serviceController.deleteService);

module.exports = router;