// controllers/albumController.js
const db = require('../services/db'); 
const traductor = require('./traductorController'); // Ruta correcta al archivo db.js

const getAllAlbums = async (req, res) => {
  try {
    const query = 'SELECT * FROM album';
    const result = await db.execute(query);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllAlbumsEN = async (req, res) => {
  try {
    const query = 'SELECT * FROM album';
    const result = await db.execute(query);

    const albumsTraducidos = await traductor.traducirJson(result.rows);

    res.json(albumsTraducidos);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getAlbumById = async (req, res) => {
  const albumId = req.params.id;
  try {
    const query = `SELECT * FROM album WHERE id = '${albumId}'`;
    const result = await db.execute(query);
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
  const { id, idartista, nombre, lanzamiento, sellodiscografico } = req.body;
  try {
    const query = `INSERT INTO album(id, idartista, nombre, lanzamiento, sellodiscografico) VALUES('${id}', '${idartista}', '${nombre}', '${lanzamiento}', '${sellodiscografico}')`;

    await db.execute(query);
    res.status(201).json({ message: 'Album creado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const updateAlbum = async (req, res) => {
  const albumId = req.params.id;
  const { idartista, nombre, lanzamiento, sellodiscografico } = req.body;
  try {
    const query = `UPDATE album SET idartista = '${idartista}', nombre = '${nombre}', lanzamiento = '${lanzamiento}' , sellodiscografico = '${sellodiscografico}' WHERE id = '${albumId}'`;
    await db.execute(query);
    res.status(201).json({ message: 'Album Editado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
const deleteAlbum = async (req, res) => {
  const albumId = req.params.id;
  try {
    const query = `DELETE FROM album WHERE id = '${albumId}';`;
    await db.execute(query);
    res.status(204).json({ message: 'Album Eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllAlbums,
  getAllAlbumsEN,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};