const pg = require("pg");

//Conexion con Base de Datos 
const execute = async (sql) => {
    const client = new pg.Client({
        host: 'appmusic.cdk5irdeokab.us-east-1.rds.amazonaws.com',
        port: 5432,
        user: 'postgres', 
        database: 'appmusic',
        password: 'apimusic',
      });

    await client.connect();
    const res = await client.query(sql);
    await client.end();
    return res
};

module.exports = { execute };