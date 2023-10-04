
const db = require('../services/db');
const traductor = require('./traductorController'); // Ruta correcta al archivo db.js

const getAllArtists = async (req, res) => {
  try {
    const query = 'SELECT * FROM artist';
    const result = await db.execute(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllArtistsEN = async (req, res) => {
  try {
    const query = 'SELECT * FROM artist';
    const result = await db.execute(query);

    const artistsTraducidos = await traductor.traducirJson(result.rows);

    res.json(artistsTraducidos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getArtistById = async (req, res) => {
  const artistId = req.params.id;
  try {
    const query = `SELECT * FROM artist WHERE id = '${artistId}'`;
    const result = await db.execute(query);
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
    const {id, nombre, generomusica, nacimiento, paisorigen} = req.body;
    try {
      const query = `INSERT INTO artist(id, nombre, generomusica, nacimiento, paisorigen) VALUES('${id}', '${nombre}', '${generomusica}', '${nacimiento}', '${paisorigen}')`;
      await db.execute(query);
      res.status(201).json({ message: 'Artista creado exitosamente' });
    } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateArtist = async (req, res) => {
  const artistId = req.params.id;
  const { nombre, generomusica, nacimiento, paisorigen } = req.body;
  try {
    const query = `UPDATE artist SET nombre = '${nombre}', generomusica = '${generomusica}', nacimiento = '${nacimiento}' , paisorigen = '${paisorigen}' WHERE id = '${artistId}'`;
    await db.execute(query);
    res.status(201).json({ message: 'Artista Editado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteArtist = async (req, res) => {
  const artistId = req.params.id;
  try {
    const query = `DELETE FROM artist WHERE id = '${artistId}';`;
    await db.execute(query);
    res.status(204).json({ message: 'Artista Eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllArtists,
  getAllArtistsEN,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
};
