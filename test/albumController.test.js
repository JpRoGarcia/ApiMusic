const {getAllAlbums,  getAlbumById, createAlbum, updateAlbum, deleteAlbum} = require('../controllers/albumController');
const db = require('../services/db');

jest.mock('../services/db');

describe('getAlbumById', () => {
  test('should get an album by ID', async () => {
    const albumId = '1';
    const mockAlbum = {
      id: albumId,
      idartista: 101,
      nombre: 'Test Album',
      lanzamiento: '2023-01-01',
      sellodiscografico: 'Sello A',
    };
    db.execute.mockResolvedValue({ rows: [mockAlbum] });

    const req = {
      params: { id: albumId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await getAlbumById(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM album'));
    expect(res.json).toHaveBeenCalledWith(mockAlbum);
  });
});

describe('createAlbum', () => {
  test('should create an album and return a 201 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const req = {
      body: {
        id: 1,
        idartista: 101,
        nombre: 'Test Album',
        lanzamiento: '2023-01-01',
        sellodiscografico: 'Sello A',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await createAlbum(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO album'));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Album creado exitosamente' });
  });
});

describe('updateAlbum', () => {
  test('should update an album and return a 201 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const albumId = '1';
    const req = {
      params: { id: albumId },
      body: {
        idartista: 101,
        nombre: 'Updated Album',
        lanzamiento: '2023-08-17',
        sellodiscografico: 'Sello B',
      },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await updateAlbum(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('UPDATE album SET'));
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Album Editado exitosamente' });
  });
});

describe('deleteAlbum', () => {
  test('should delete an album and return a 204 status code', async () => {
    db.execute.mockResolvedValue({}); // Simulate a successful response from the database

    const albumId = '1';
    const req = {
      params: { id: albumId },
    };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    await deleteAlbum(req, res);

    expect(db.execute).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM album'));
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.json).toHaveBeenCalledWith({ message: 'Album Eliminado exitosamente' });
  });
});





