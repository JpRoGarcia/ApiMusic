const {getAllArtists,  getArtistById, createArtist, updateArtist, deleteArtist} = require('../controllers/artistController');
const db = require('../services/db');

jest.mock('../services/db');

describe('getArtistById', () => {
  test('should get an artist by ID', async () => {
    const artistId = '1';
    const mockArtist = {
      id: artistId,
      nombre: 'John Doe',
      generomusica: 'Rock',
      nacimiento: '1990-05-15',
      paisorigen: 'USA',
    };
    db.execute.mockResolvedValue({ rows: [mockArtist] });

    const req = {
      params: { id: artistId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getArtistById(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM artist'));
    expect(res.json).toHaveBeenCalledWith(mockArtist);
  });
});

describe('createArtist', () => {
  test('should create an artist and return a 201 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const req = {
      body: {
        id: 1,
        nombre: 'John Doe',
        generomusica: 'Rock',
        nacimiento: '1990-05-15',
        paisorigen: 'USA',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createArtist(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO artist'));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Artista creado exitosamente' });
  });
});

describe('updateArtist', () => {
  test('should update an artist and return a 201 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const artistId = '1';
    const req = {
      params: { id: artistId },
      body: {
        nombre: 'Updated Artist',
        generomusica: 'Pop',
        nacimiento: '1995-03-20',
        paisorigen: 'UK',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await updateArtist(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE artist SET'));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Artista Editado exitosamente' });
  });
});

describe('deleteArtist', () => {
  test('should delete an artist and return a 204 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const artistId = '1';
    const req = {
      params: { id: artistId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deleteArtist(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM artist'));
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Artista Eliminado exitosamente' });
  });
});




