const {getAllArtists,  getArtistById, createArtist, updateArtist, deleteArtist} = require('../controllers/artistController');
const db = require('../services/db');

describe('getAllArtists', () => {

    // Tests that the function returns all artists from the database
    it('should return all artists from the database', async () => {
      const mockResult = { rows: ['artist1', 'artist2', 'artist3'] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockJson = jest.fn();
      const res = { json: mockJson };

      await getAllArtists({}, res);

      expect(db.execute).toHaveBeenCalledWith('SELECT * FROM artist');
      expect(mockJson).toHaveBeenCalledWith(mockResult.rows);
    });

    // Tests that the function returns a JSON response with the artists' data
    it('should return a JSON response with the artists\' data', async () => {
      const mockResult = { rows: ['artist1', 'artist2', 'artist3'] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockJson = jest.fn();
      const res = { json: mockJson };

      await getAllArtists({}, res);

      expect(mockJson).toHaveBeenCalledWith(mockResult.rows);
    });

    // Tests that the function handles errors when executing the query
    it('should handle errors when executing the query', async () => {
      const mockError = new Error('Database error');
      db.execute = jest.fn().mockRejectedValue(mockError);
      const mockStatus = jest.fn().mockReturnThis();
      const mockJson = jest.fn();
      const res = { status: mockStatus, json: mockJson };

      await getAllArtists({}, res);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function handles empty results from the database
    it('should handle empty results from the database', async () => {
      const mockResult = { rows: [] };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockJson = jest.fn();
      const res = { json: mockJson };

      await getAllArtists({}, res);

      expect(mockJson).toHaveBeenCalledWith(mockResult.rows);
    });

    // Tests that the function handles unexpected data types in the response
    it('should handle unexpected data types in the response', async () => {
      const mockResult = { rows: 123 };
      db.execute = jest.fn().mockResolvedValue(mockResult);
      const mockJson = jest.fn();
      const res = { json: mockJson };

      await getAllArtists({}, res);

      expect(mockJson).toHaveBeenCalledWith(mockResult.rows);
    });
});

describe('getArtistById', () => {

    // Tests that the function returns the artist object when a valid id is provided
    it('should return the artist object when a valid id is provided', async () => {
      const req = { params: { id: 'validId' } };
      const res = { json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [{ id: 'validId', name: 'Artist' }] });

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = 'validId'");
      expect(res.json).toHaveBeenCalledWith({ id: 'validId', name: 'Artist' });
    });

    // Tests that the function returns a 404 error when an invalid id is provided
    it('should return a 404 error when an invalid id is provided', async () => {
      const req = { params: { id: 'invalidId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = 'invalidId'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Artist not found' });
    });

    // Tests that the function handles an empty result set from the database
    it('should handle an empty result set from the database', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [] });

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = 'validId'");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Artist not found' });
    });

    // Tests that the function handles errors thrown by the database
    it('should handle errors thrown by the database', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockRejectedValue(new Error('Database error'));

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = 'validId'");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function sanitizes input to prevent SQL injection attacks
    it('should sanitize input to prevent SQL injection attacks', async () => {
      const req = { params: { id: "'; DROP TABLE artist; --" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [{ id: 'validId', name: 'Artist' }] });

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = '\'; DROP TABLE artist; --'");
      expect(res.json).toHaveBeenCalledWith({ id: 'validId', name: 'Artist' });
    });

    // Tests that the function handles non-numeric id inputs
    it('should handle non-numeric id inputs', async () => {
      const req = { params: { id: 'nonNumericId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const db = require('../services/db');
      db.execute = jest.fn().mockResolvedValue({ rows: [{ id: 'validId', name: 'Artist' }] });

      await getArtistById(req, res);

      expect(db.execute).toHaveBeenCalledWith("SELECT * FROM artist WHERE id = 'nonNumericId'");
      expect(res.json).toHaveBeenCalledWith({ id: 'validId', name: 'Artist' });
    });
});

describe('createArtist', () => {

    // Tests that createArtist function successfully creates an artist with valid input data
    it('should create an artist with valid input data', async () => {
      // Mock req and res objects
      const req = {
        body: {
          id: '1',
          nombre: 'John Doe',
          generomusica: 'Rock',
          nacimiento: '1990-01-01',
          paisorigen: 'USA'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Call the createArtist function
      await createArtist(req, res);

      // Assert that the correct SQL query is generated
      expect(db.execute).toHaveBeenCalledWith(`INSERT INTO artist(id, nombre, generomusica, nacimiento, paisorigen) VALUES('1', 'John Doe', 'Rock', '1990-01-01', 'USA')`);

      // Assert that the response status is 201
      expect(res.status).toHaveBeenCalledWith(201);

      // Assert that the response message is correct
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista creado exitosamente' });
    });

    // Tests that createArtist function returns an error when attempting to create an artist with a duplicate ID
    it('should return an error when attempting to create an artist with a duplicate ID', async () => {
      // Mock req and res objects
      const req = {
        body: {
          id: '1',
          nombre: 'John Doe',
          generomusica: 'Rock',
          nacimiento: '1990-01-01',
          paisorigen: 'USA'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock db.execute to throw an error indicating duplicate ID
      db.execute.mockRejectedValueOnce(new Error('Duplicate entry for ID'));

      // Call the createArtist function
      await createArtist(req, res);

      // Assert that the response status is 500
      expect(res.status).toHaveBeenCalledWith(500);

      // Assert that the response error message is correct
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that createArtist function generates the correct SQL query for creating an artist
    it('should generate the correct SQL query for creating an artist', async () => {
      // Mock req and res objects
      const req = {
        body: {
          id: '1',
          nombre: 'John Doe',
          generomusica: 'Rock',
          nacimiento: '1990-01-01',
          paisorigen: 'USA'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Call the createArtist function
      await createArtist(req, res);

      // Assert that the correct SQL query is generated
      expect(db.execute).toHaveBeenCalledWith(`INSERT INTO artist(id, nombre, generomusica, nacimiento, paisorigen) VALUES('1', 'John Doe', 'Rock', '1990-01-01', 'USA')`);
    });

    // Tests that createArtist function returns the correct error message when an error occurs during artist creation
    it('should return the correct error message when an error occurs during artist creation', async () => {
      // Mock req and res objects
      const req = {
        body: {
          id: '1',
          nombre: 'John Doe',
          generomusica: 'Rock',
          nacimiento: '1990-01-01',
          paisorigen: 'USA'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      // Mock db.execute to throw an error
      db.execute.mockRejectedValueOnce(new Error('Database error'));

      // Call the createArtist function
      await createArtist(req, res);

      // Assert that the response status is 500
      expect(res.status).toHaveBeenCalledWith(500);

      // Assert that the response error message is correct
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('updateArtist', () => {

    // Tests that the artist information is successfully updated with valid input
    it('should update artist information with valid input', async () => {
      const req = {
        params: { id: 'artistId' },
        body: { 
          nombre: 'New Name',
          generomusica: 'New Genre',
          nacimiento: 'New Date',
          paisorigen: 'New Country'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn();
  
      await updateArtist(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE artist SET nombre = 'New Name', generomusica = 'New Genre', nacimiento = 'New Date' , paisorigen = 'New Country' WHERE id = 'artistId'`);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Editado exitosamente' });
    });

    // Tests that a 500 error is returned if the database query fails
    it('should return a 500 error if the database query fails', async () => {
      const req = {
        params: { id: 'artistId' },
        body: { 
          nombre: 'New Name',
          generomusica: 'New Genre',
          nacimiento: 'New Date',
          paisorigen: 'New Country'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn().mockRejectedValue(new Error('Database query failed'));
  
      await updateArtist(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE artist SET nombre = 'New Name', generomusica = 'New Genre', nacimiento = 'New Date' , paisorigen = 'New Country' WHERE id = 'artistId'`);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that a 500 error is returned if the artistId is not provided
    it('should return a 500 error if the artistId is not provided', async () => {
      const req = {
        params: {},
        body: { 
          nombre: 'New Name',
          generomusica: 'New Genre',
          nacimiento: 'New Date',
          paisorigen: 'New Country'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateArtist(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that a 500 error is returned if any required field is missing in the request body
    it('should return a 500 error if any required field is missing in the request body', async () => {
      const req = {
        params: { id: 'artistId' },
        body: { 
          generomusica: 'New Genre',
          nacimiento: 'New Date',
          paisorigen: 'New Country'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
  
      await updateArtist(req, res);
  
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function handles special characters in input fields
    it('should handle special characters in input fields', async () => {
      const req = {
        params: { id: 'artistId' },
        body: { 
          nombre: 'New Name with special characters: !@#$%^&*()',
          generomusica: 'New Genre with special characters: !@#$%^&*()',
          nacimiento: 'New Date with special characters: !@#$%^&*()',
          paisorigen: 'New Country with special characters: !@#$%^&*()'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn();
  
      await updateArtist(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE artist SET nombre = 'New Name with special characters: !@#$%^&*()', generomusica = 'New Genre with special characters: !@#$%^&*()', nacimiento = 'New Date with special characters: !@#$%^&*()' , paisorigen = 'New Country with special characters: !@#$%^&*()' WHERE id = 'artistId'`);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Editado exitosamente' });
    });

    // Tests that the function handles empty input fields
    it('should handle empty input fields', async () => {
      const req = {
        params: { id: 'artistId' },
        body: { 
          nombre: '',
          generomusica: '',
          nacimiento: '',
          paisorigen: ''
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const db = require('../services/db');
      db.execute = jest.fn();
  
      await updateArtist(req, res);
  
      expect(db.execute).toHaveBeenCalledWith(`UPDATE artist SET nombre = '', generomusica = '', nacimiento = '' , paisorigen = '' WHERE id = 'artistId'`);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Editado exitosamente' });
    });
});

describe('deleteArtist', () => {

    // Tests that the function successfully deletes an artist with a valid id
    it('should delete an artist with a valid id', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteArtist(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM artist WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Eliminado exitosamente' });
    });

    // Tests that the function returns a 500 error if the database query fails
    it('should return a 500 error if the database query fails', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockRejectedValue();
  
      await deleteArtist(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM artist WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function returns a success message in the response body
    it('should return a success message in the response body', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteArtist(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM artist WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Eliminado exitosamente' });
    });

    // Tests that the function constructs a query string that includes the artist id from the request object
    it('should construct a query string that includes the artist id from the request object', async () => {
      const req = { params: { id: 'validId' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const executeMock = jest.spyOn(db, 'execute').mockResolvedValue();
  
      await deleteArtist(req, res);
  
      expect(executeMock).toHaveBeenCalledWith("DELETE FROM artist WHERE id = 'validId';");
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ message: 'Artista Eliminado exitosamente' });
    });
});




