// routes/albumRoutes.js
const express = require('express');
const technicianController = require('../controllers/TechnicianController');

const router = express.Router();

router.get('/technicians', technicianController.getTechnicians);
router.get('/technicians/en', technicianController.getTechniciansEn);
router.post('/technicians', technicianController.createTechnician);
router.delete('/technicians', technicianController.deleteTechnician);

module.exports = router;