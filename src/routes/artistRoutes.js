// routes/artistRoutes.js
const express = require('express');
const artistController = require('../controllers/artistController');

const router = express.Router();

router.get('/artists', artistController.getAllArtists);
router.get('/artists/:id', artistController.getArtistById);
router.post('/artists', artistController.createArtist);
router.put('/artists/:id', artistController.updateArtist);
router.delete('/artists/:id', artistController.deleteArtist);

module.exports = router;