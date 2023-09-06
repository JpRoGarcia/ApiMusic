const pg = require("pg");

//Conexion con Base de Datos 
const execute = async (sql) => {
    const client = new pg.Client({
        user: 'postgres',
        host: 'appmusic.cdk5irdeokab.us-east-1.rds.amazonaws.com',
        database: 'appmusic',
        password: 'apimusic',
        port: 5432,
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