const {getAllArtists,  getArtistById, createArtist, updateArtist, deleteArtist} = require('../controllers/artistController');
const db = require('../services/db');

describe('getArtistById', () => {
    // Tests that the function returns a 500 error when the database query fails
    it('should return a 500 error when the database query fails', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        db.execute = jest.fn().mockRejectedValue(new Error('Database error'));
        await getArtistById(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

describe('createArtist', () => {

    // Tests that a new artist can be successfully inserted into the database and the created artist object is returned
    it('should insert a new artist and return the created artist object', async () => {
        const req = {
            body: {
                nombre: 'Test Artist',
                generomusica: 'Test Genre',
                nacimiento: '2000-01-01',
                paisorigen: 'Test Country'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const expectedArtist = {
            id: 1,
            nombre: 'Test Artist',
            generomusica: 'Test Genre',
            nacimiento: '2000-01-01',
            paisorigen: 'Test Country'
        };
        db.execute = jest.fn().mockResolvedValueOnce({ rows: [expectedArtist] });

        await createArtist(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expectedArtist);
    });

    // Tests that a 500 Internal server error is returned if an error occurs during the database insertion
    it('should return a 500 error when an error occurs during database insertion', async () => {
        const req = {
            body: {
                nombre: 'Test Artist',
                generomusica: 'Test Genre',
                nacimiento: '2000-01-01',
                paisorigen: 'Test Country'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        db.execute = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        await createArtist(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

    // Tests that the correct SQL query is being executed with the correct parameters
    it('should execute the correct SQL query with the correct parameters', async () => {
        const req = {
            body: {
                nombre: 'Test Artist',
                generomusica: 'Test Genre',
                nacimiento: '2000-01-01',
                paisorigen: 'Test Country'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const expectedQuery = 'INSERT INTO artist(nombre, generomusica, nacimiento, paisorigen) VALUES ($1, $2, $3, $4) RETURNING *';
        const expectedValues = ['Test Artist', 'Test Genre', '2000-01-01', 'Test Country'];
        db.execute = jest.fn().mockResolvedValueOnce({ rows: [] });

        await createArtist(req, res);

        expect(db.execute).toHaveBeenCalledWith(expectedQuery, expectedValues);
    });

    // Tests that the returned artist object contains all the expected fields and has the correct field values
    it('should return an artist object with all the expected fields and correct field values', async () => {
        const req = {
            body: {
                nombre: 'Test Artist',
                generomusica: 'Test Genre',
                nacimiento: '2000-01-01',
                paisorigen: 'Test Country'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const expectedArtist = {
            id: 1,
            nombre: 'Test Artist',
            generomusica: 'Test Genre',
            nacimiento: '2000-01-01',
            paisorigen: 'Test Country'
        };
        db.execute = jest.fn().mockResolvedValueOnce({ rows: [expectedArtist] });

        await createArtist(req, res);

        expect(res.json).toHaveBeenCalledWith(expectedArtist);
    });
});

describe('updateArtist', () => {

    // Tests that the function successfully updates an artist with valid input
    it('should update an artist with valid input', async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                nombre: 'New Name',
                generomusica: 'New Genre',
                nacimiento: '1990-01-01',
                paisorigen: 'New Country'
            }
        };
        const res = {
            json: jest.fn()
        };
        const mockExecute = jest.fn().mockResolvedValue({ rows: [{ id: 1, ...req.body }] });
        db.execute = mockExecute;
        await updateArtist(req, res);
        expect(mockExecute).toHaveBeenCalledWith('UPDATE artist SET nombre = $1, generomusica = $2, nacimiento = $3, paisorigen = $4 WHERE id = $5 RETURNING *', ['New Name', 'New Genre', '1990-01-01', 'New Country', 1]);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    // Tests that the function returns the updated artist object
    it('should return the updated artist object', async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                nombre: 'New Name',
                generomusica: 'New Genre',
                nacimiento: '1990-01-01',
                paisorigen: 'New Country'
            }
        };
        const res = {
            json: jest.fn()
        };
        const mockExecute = jest.fn().mockResolvedValue({ rows: [{ id: 1, ...req.body }] });
        db.execute = mockExecute;
        await updateArtist(req, res);
        expect(res.json).toHaveBeenCalledWith({ id: 1, ...req.body });
    });

    // Tests that the function returns a 500 Internal server error on database failure
    it('should return a 500 Internal server error on database failure', async () => {
        const req = {
            params: {
                id: 1
            },
            body: {
                nombre: 'New Name',
                generomusica: 'New Genre',
                nacimiento: '1990-01-01',
                paisorigen: 'New Country'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockExecute = jest.fn().mockRejectedValue(new Error('Database error'));
        db.execute = mockExecute;
        await updateArtist(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });

});

describe('deleteArtist', () => {

    // Tests that the function deletes an artist with a valid id and returns status code 204
    it('should delete an artist with a valid id and return status code 204', async () => {
        const req = { params: { id: 1 } };
        const res = { sendStatus: jest.fn() };
        const executeMock = jest.spyOn(db, 'execute').mockResolvedValueOnce();

        await deleteArtist(req, res);

        expect(executeMock).toHaveBeenCalledWith('DELETE FROM artist WHERE id = $1', [1]);
        expect(res.sendStatus).toHaveBeenCalledWith(204);
    });

    // Tests that the function returns status code 500 if an error occurs during deletion
    it('should return status code 500 if an error occurs during deletion', async () => {
        const req = { params: { id: 1 } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const executeMock = jest.spyOn(db, 'execute').mockRejectedValueOnce();

        await deleteArtist(req, res);

        expect(executeMock).toHaveBeenCalledWith('DELETE FROM artist WHERE id = $1', [1]);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
});

