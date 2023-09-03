const pg = require("pg");

//Conexion con Base de Datos 
const execute = async (sql) => {
    const client = new pg.Client({
        user: 'postgres',
        host: 'dataBase',
        database: 'apimusic',
        password: 'apimusic',
        port: 5432,
      });

    await client.connect();
    const res = await client.query(sql);
    await client.end();
    return res
};

module.exports = { execute };