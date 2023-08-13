
const db = require('../services/db'); // Ruta correcta al archivo db.js

const getAllArtists = async (req, res) => {
  try {
    const query = 'SELECT * FROM artist';
    const result = await db.execute(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getArtistById = async (req, res) => {
  const artistId = req.params.id;
  try {
    const query = 'SELECT * FROM artist WHERE id = $1';
    const result = await db.execute(query, [artistId]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'Artist not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createArtist = async (req, res) => {
  const { nombre, generomusica, nacimiento, paisorigen } = req.body;
  try {
    const query = 'INSERT INTO artist(nombre, generomusica, nacimiento, paisorigen) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [nombre, generomusica, nacimiento, paisorigen];
    const result = await db.execute(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateArtist = async (req, res) => {
  const artistId = req.params.id;
  const { nombre, generomusica, nacimiento, paisorigen } = req.body;
  try {
    const query = 'UPDATE artist SET nombre = $1, generomusica = $2, nacimiento = $3, paisorigen = $4 WHERE id = $5 RETURNING *';
    const values = [nombre, generomusica, nacimiento, paisorigen, artistId];
    const result = await db.execute(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteArtist = async (req, res) => {
  const artistId = req.params.id;
  try {
    const query = 'DELETE FROM artist WHERE id = $1';
    await db.execute(query, [artistId]);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};





