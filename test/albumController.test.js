const {getAllAlbums,  getAlbumById, createAlbum, updateAlbum, deleteAlbum} = require('../controllers/albumController');
const db = require('../services/db');

describe('getAllAlbums', () => {

    // Tests that the function returns all albums in the database
    it('should return all albums in the database', async () => {
        const req = {};
        const res = {
            json: jest.fn()
        };
        const expectedResult = [{ id: 1, name: 'Album 1' }, { id: 2, name: 'Album 2' }];
        const db = require('../services/db');
        db.execute = jest.fn().mockResolvedValue({ rows: expectedResult });
        await getAllAlbums(req, res);
        expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    // Tests that the function returns albums in the correct format
    it('should return albums in the correct format', async () => {
        const req = {};
        const res = {
            json: jest.fn()
        };
        const expectedResult = [{ id: 1, name: 'Album 1' }, { id: 2, name: 'Album 2' }];
        const db = require('../services/db');
        db.execute = jest.fn().mockResolvedValue({ rows: expectedResult });
        await getAllAlbums(req, res);
        expect(res.json.mock.calls[0][0]).toEqual(expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String)
            })
        ]));
    });

    // Tests that the function returns a JSON object
    it('should return a JSON object', async () => {
        const req = {};
        const res = {
            json: jest.fn()
        };
        const expectedResult = [{ id: 1, name: 'Album 1' }, { id: 2, name: 'Album 2' }];
        const db = require('../services/db');
        db.execute = jest.fn().mockResolvedValue({ rows: expectedResult });
        await getAllAlbums(req, res);
        expect(res.json.mock.calls[0][0]).toBeInstanceOf(Object);
    });

    // Tests that the function handles an empty album table
    it('should return an empty array if no albums are found', async () => {
        const req = {};
        const res = {
            json: jest.fn()
        };
        const expectedResult = [];
        const db = require('../services/db');
        db.execute = jest.fn().mockResolvedValue({ rows: expectedResult });
        await getAllAlbums(req, res);
        expect(res.json).toHaveBeenCalledWith(expectedResult);
    });

    // Tests that the function handles errors from db.execute()
    it('should return a 500 error if db.execute() throws an error', async () => {
        const req = {};
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const errorMessage = 'Database error';
        const db = require('../services/db');
        db.execute = jest.fn().mockRejectedValue(new Error(errorMessage));
        await getAllAlbums(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function returns an empty array if no albums are found
});

describe('getAlbumById', () => {

    // Tests that the function returns album object when valid album id is provided
    it('should return album object when valid album id is provided', async () => {
        const req = { params: { id: 1 } };
        const res = { json: jest.fn() };
        const expectedAlbum = { id: 1, name: 'Album 1' };
        db.execute = jest.fn().mockResolvedValue({ rows: [expectedAlbum] });
        await getAlbumById(req, res);
        expect(res.json).toHaveBeenCalledWith(expectedAlbum);
    });

    // Tests that the function returns 404 error when album id is not found in database
    it('should return 404 error when album id is not found in database', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.execute = jest.fn().mockResolvedValue({ rows: [] });
        await getAlbumById(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'Album not found' });
    });

    // Tests that the function returns 500 error when database query fails
    it('should return 500 error when database query fails', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.execute = jest.fn().mockRejectedValue(new Error('Database error'));
        await getAlbumById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the function handles album id parameter with leading/trailing spaces
    it('should handle album id parameter with leading/trailing spaces', async () => {
        const req = { params: { id: ' 1 ' } };
        const res = { json: jest.fn() };
        const expectedAlbum = { id: 1, name: 'Album 1' };
        db.execute = jest.fn().mockResolvedValue({ rows: [expectedAlbum] });
        await getAlbumById(req, res);
        expect(res.json).toHaveBeenCalledWith(expectedAlbum);
    });
});

describe('createAlbum', () => {
    // Tests that a 201 status code is returned when a new album is created
    it('should return a 201 status code when a new album is created', async () => {
        const req = {
            body: {
                idartista: 1,
                nombre: 'Test Album',
                lanzamiento: '2022-01-01',
                sellodiscografico: 'Test Label'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await createAlbum(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    // Tests that a 500 status code and an error message is returned when an error occurs during album creation
    it('should return a 500 status code and an error message when an error occurs during album creation', async () => {
        const req = {
            body: {
                idartista: 1,
                nombre: 'Test Album',
                lanzamiento: '2022-01-01',
                sellodiscografico: 'Test Label'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        db.execute = jest.fn().mockRejectedValue(new Error('Database error'));
        await createAlbum(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that a 500 status code and an error message is returned when the request body is missing required fields
    it('should return a 500 status code and an error message when the request body is missing required fields', async () => {
        const req = {
            body: {}
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        await createAlbum(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('updateAlbum', () => {

    // Tests that the function updates an album with valid input
    it('should update an album with valid input', async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                idartista: 1,
                nombre: 'Album 1',
                lanzamiento: '2022-01-01',
                sellodiscografico: 'Sello 1'
            }
        };
        const res = {
            json: jest.fn()
        };
        const mockExecute = jest.spyOn(db, 'execute').mockResolvedValueOnce({
            rows: [{
                id: 1,
                idartista: 1,
                nombre: 'Album 1',
                lanzamiento: '2022-01-01',
                sellodiscografico: 'Sello 1'
            }]
        });
        await updateAlbum(req, res);
        expect(mockExecute).toHaveBeenCalledWith('UPDATE album SET idartista = $1, nombre = $2, lanzamiento = $3, sellodiscografico = $4 WHERE id = $5 RETURNING *', [1, 'Album 1', '2022-01-01', 'Sello 1', 1]);
        expect(res.json).toHaveBeenCalledWith({
            id: 1,
            idartista: 1,
            nombre: 'Album 1',
            lanzamiento: '2022-01-01',
            sellodiscografico: 'Sello 1'
        });
    });

    // Tests that the function returns 500 if the database query fails
    it('should return 500 if the database query fails', async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                idartista: 1,
                nombre: 'Album 1',
                lanzamiento: '2022-01-01',
                sellodiscografico: 'Sello 1'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockExecute = jest.spyOn(db, 'execute').mockRejectedValueOnce(new Error('Database error'));
        await updateAlbum(req, res);
        expect(mockExecute).toHaveBeenCalledWith('UPDATE album SET idartista = $1, nombre = $2, lanzamiento = $3, sellodiscografico = $4 WHERE id = $5 RETURNING *', [1, 'Album 1', '2022-01-01', 'Sello 1', 1]);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('deleteAlbum', () => {

    // Tests that deleteAlbum function deletes an album with a valid id
    it('should delete an album with a valid id', async () => {
        const req = { params: { id: 1 } };
        const res = { sendStatus: jest.fn() };
        const executeMock = jest.spyOn(db, 'execute').mockResolvedValueOnce();

        await deleteAlbum(req, res);

        expect(executeMock).toHaveBeenCalledWith('DELETE FROM album WHERE id = $1', [1]);
        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    // Tests that deleteAlbum function returns a 204 status code on successful deletion
    it('should return a 204 status code on successful deletion', async () => {
        const req = { params: { id: 1 } };
        const res = { sendStatus: jest.fn() };
        jest.spyOn(db, 'execute').mockResolvedValueOnce();

        await deleteAlbum(req, res);

        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    // Tests that deleteAlbum function returns a 500 status code if an error occurs during deletion
    it('should return a 500 status code if an error occurs during deletion', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        jest.spyOn(db, 'execute').mockRejectedValueOnce();

        await deleteAlbum(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });



});



