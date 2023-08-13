// controllers/albumController.js
const db = require('../services/db'); // Ruta correcta al archivo db.js

const getAllAlbums = async (req, res) => {
  try {
    const query = 'SELECT * FROM album';
    const result = await db.execute(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAlbumById = async (req, res) => {
  const albumId = req.params.id;
  try {
    const query = 'SELECT * FROM album WHERE id = $1';
    const result = await db.execute(query, [albumId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createAlbum = async (req, res) => {
  const { idartista, nombre, lanzamiento, sellodiscografico } = req.body;
  try {
    const query = 'INSERT INTO album(idartista, nombre, lanzamiento, sellodiscografico) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [idartista, nombre, lanzamiento, sellodiscografico];
    const result = await db.execute(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateAlbum = async (req, res) => {
  const albumId = req.params.id;
  const { idartista, nombre, lanzamiento, sellodiscografico } = req.body;
  try {
    const query = 'UPDATE album SET idartista = $1, nombre = $2, lanzamiento = $3, sellodiscografico = $4 WHERE id = $5 RETURNING *';
    const values = [idartista, nombre, lanzamiento, sellodiscografico, albumId];
    const result = await db.execute(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteAlbum = async (req, res) => {
  const albumId = req.params.id;
  try {
    const query = 'DELETE FROM album WHERE id = $1';
    await db.execute(query, [albumId]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};