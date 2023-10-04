// routes/albumRoutes.js
const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router.get('/albums', albumController.getAllAlbums);
router.get('/albums/en', albumController.getAllAlbumsEN);
router.get('/albums/:id', albumController.getAlbumById);
router.post('/albums', albumController.createAlbum);
router.put('/albums/:id', albumController.updateAlbum);
router.delete('/albums/:id', albumController.deleteAlbum);

module.exports = router;