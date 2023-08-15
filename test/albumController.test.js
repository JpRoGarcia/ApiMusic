const {getAllAlbums,  getAlbumById, createAlbum, updateAlbum, deleteAlbum} = require('../controllers/albumController');
const db = require('../services/db');

describe('getAllAlbums', () => {

    // Tests that the function returns all albums from the database
    it('should return all albums from the database', async () => {
      const mockResult = { rows: [{ id: 1, title: 'Album 1' }, { id: 2, title: 'Album 2' }] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockRes = { json: jest.fn() };
      await getAllAlbums({}, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.rows);
    });

    // Tests that the function returns a JSON object with album data
    it('should return a JSON object with album data', async () => {
      const mockResult = { rows: [{ id: 1, title: 'Album 1' }, { id: 2, title: 'Album 2' }] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockRes = { json: jest.fn() };
      await getAllAlbums({}, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.rows);
    });

    // Tests that the function returns a 500 status code if there is an error
    it('should return a 500 status code if there is an error', async () => {
      db.execute = jest.fn().mockRejectedValue(new Error('Database error'));
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getAllAlbums({}, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    // Tests that the function handles empty result sets gracefully
    it('should handle empty result sets gracefully', async () => {
      const mockResult = { rows: [] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockRes = { json: jest.fn() };
      await getAllAlbums({}, mockRes);
      expect(mockRes.json).toHaveBeenCalledWith([]);
    });

    // Tests that the function handles invalid queries gracefully
    it('should handle invalid queries gracefully', async () => {
      db.execute = jest.fn().mockRejectedValue(new Error('Invalid query'));
      const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await getAllAlbums({}, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
});

describe('getAlbumById', () => {

    it('should return the album object when a valid id is provided', async () => {
      const req = { params: { id: 'validId' } };
      const res = { json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [{ id: 'validId', name: 'Album 1' }] });

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = 'validId'");
      expect(res.json).toHaveBeenCalledWith({ id: 'validId', name: 'Album 1' });
    });

    // Tests that the function returns a 404 error when an invalid id is provided
    it('should return a 404 error when an invalid id is provided', async () => {
      const req = { params: { id: 'invalidId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = 'invalidId'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Album not found' });
    });

    // Tests that the function handles an empty result set from the database
    it('should handle an empty result set from the database', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = 'validId'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Album not found' });
    });

    // Tests that the function handles errors thrown by the database
    it('should handle errors thrown by the database', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockRejectedValue(new Error('Database error'));

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = 'validId'");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function sanitizes input to prevent SQL injection attacks
    it('should sanitize input to prevent SQL injection attacks', async () => {
      const req = { params: { id: "'; DROP TABLE album; --" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = '\'; DROP TABLE album; --'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Album not found' });
    });

    // Tests that the function handles non-integer id inputs
    it('should handle non-integer id inputs', async () => {
      const req = { params: { id: 'nonIntegerId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getAlbumById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM album WHERE id = 'nonIntegerId'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Album not found' });
    });
});

describe('createAlbum', () => {

    // Tests that the album is successfully inserted into the database and the function returns a status code of 201 and a success message
    it('should insert album into database and return status code 201 and success message', async () => {
      const req = {
        body: {
          id: '1',
          idartista: '2',
          nombre: 'Album 1',
          lanzamiento: '2022-01-01',
          sellodiscografico: 'Sello 1'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      await createAlbum(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Album creado exitosamente' });
    });

    // Tests that the function returns an error message for database connection errors
    it('should return error message for database connection errors', async () => {
      const req = {
        body: {
          id: '1',
          idartista: '2',
          nombre: 'Album 1',
          lanzamiento: '2022-01-01',
          sellodiscografico: 'Sello 1'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.execute = jest.fn().mockRejectedValue(new Error('Database connection error'));
      await createAlbum(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function returns an error message for unexpected errors
    it('should return error message for unexpected errors', async () => {
      const req = {
        body: {
          id: '1',
          idartista: '2',
          nombre: 'Album 1',
          lanzamiento: '2022-01-01',
          sellodiscografico: 'Sello 1'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      db.execute = jest.fn().mockRejectedValue(new Error('Unexpected error'));
      await createAlbum(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('updateAlbum', () => {

    // Tests that updateAlbum function updates the album with valid input data and returns status 201
    it('should update the album with valid input data and return status 201', async () => {
      const req = {
        params: { id: 'albumId' },
        body: { idartista: 'idartista', nombre: 'nombre', lanzamiento: 'lanzamiento', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn();
  
      await updateAlbum(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE album SET idartista = 'idartista', nombre = 'nombre', lanzamiento = 'lanzamiento' , sellodiscografico = 'sellodiscografico' WHERE id = 'albumId'`);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Album Editado exitosamente' });
    });

    // Tests that updateAlbum function returns status 500 if database execution fails
    it('should return status 500 if database execution fails', async () => {
      const req = {
        params: { id: 'albumId' },
        body: { idartista: 'idartista', nombre: 'nombre', lanzamiento: 'lanzamiento', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn().mockRejectedValue(new Error('Database execution failed'));
  
      await updateAlbum(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE album SET idartista = 'idartista', nombre = 'nombre', lanzamiento = 'lanzamiento' , sellodiscografico = 'sellodiscografico' WHERE id = 'albumId'`);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that updateAlbum function returns status 500 if albumId is not provided
    it('should return status 500 if albumId is not provided', async () => {
      const req = {
        params: {},
        body: { idartista: 'idartista', nombre: 'nombre', lanzamiento: 'lanzamiento', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateAlbum(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that updateAlbum function returns status 500 if idartista is not provided
    it('should return status 500 if idartista is not provided', async () => {
      const req = {
        params: { id: 'albumId' },
        body: { nombre: 'nombre', lanzamiento: 'lanzamiento', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateAlbum(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that updateAlbum function returns status 500 if nombre is not provided
    it('should return status 500 if nombre is not provided', async () => {
      const req = {
        params: { id: 'albumId' },
        body: { idartista: 'idartista', lanzamiento: 'lanzamiento', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateAlbum(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that updateAlbum function returns status 500 if lanzamiento is not provided
    it('should return status 500 if lanzamiento is not provided', async () => {
      const req = {
        params: { id: 'albumId' },
        body: { idartista: 'idartista', nombre: 'nombre', sellodiscografico: 'sellodiscografico' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateAlbum(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('deleteAlbum', () => {

    // Tests that the function successfully deletes an album with a valid id
    it('should delete an album with a valid id', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteAlbum(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM album WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Album Eliminado exitosamente' });
    });

    // Tests that the function handles an error when executing the query
    it('should handle an error when executing the query', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockRejectedValue();
  
      await deleteAlbum(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM album WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function returns the appropriate status code when an album is deleted
    it('should return the appropriate status code when an album is deleted', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteAlbum(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM album WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(204);
    });

    // Tests that the function executes the correct query
    it('should execute the correct query', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteAlbum(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM album WHERE id = 'validId';");
    });

    // Tests that the function returns the response message in the correct format
    it('should return the response message in the correct format', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteAlbum(req, res);
  
      expect(res.json).toHaveBeenCalledWith({ message: 'Album Eliminado exitosamente' });
    });
});




