// index.js
const express = require('express');

const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');

const app = express();
app.use(express.json());

app.use('/api', artistRoutes);
app.use('/api', albumRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  //console.log(`API node: http://localhost:${PORT}/`);
  console.log(`API node: http://localhost:${PORT}/api/artists`);
  console.log(`API node: http://localhost:${PORT}/api/albums`);
});