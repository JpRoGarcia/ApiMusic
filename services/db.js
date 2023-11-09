const pg = require("pg");

//Conexion con Base de Datos 
const execute = async (sql) => {
    const client = new pg.Client({
      max: 300,
      connectionTimeoutMillis: 5000,
    
      host: 'dev-rds-instance.cpb0e26kno9k.us-east-1.rds.amazonaws.com',
      port: 5432,
      user: 'ApiMusicUser',
      password: 'ApiMusicPassword',
      database: 'ApiMusicData',
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


