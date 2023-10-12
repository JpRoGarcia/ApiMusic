const pg = require("pg");

//Conexion con Base de Datos 
const execute = async (sql) => {
    const client = new pg.Client({
      max: 300,
      connectionTimeoutMillis: 5000,
    
      host: 'c-cluster-api-music.exjg3sujbtld6v.postgres.cosmos.azure.com',
      port: 5432,
      user: 'citus',
      password: '@p1Mus1c',
      database: 'data-api-music',
      ssl: true,
      });

    await client.connect((err) => {
      if(err) {
        console.log(err.message);
        return;
      }
      console.log("Base Datos Conectada")
    });
    const res = await client.query(sql);
    await client.end();
    return res
};

module.exports = { execute };


