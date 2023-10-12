// index.js
const express = require('express');

const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const technicianRouter = require('./routes/technicianRoutes');
const serviceRoutes = require('./routes/serviceRoutes');

const app = express();
app.use(express.json());

app.use('/api', artistRoutes);
app.use('/api', albumRoutes);
app.use('/api', technicianRouter);
app.use('/api', serviceRoutes);

app.get('/', function (req, res) {
  res.send('(: API de Artistas Y Album :)');
})


const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  //console.log(`API node: http://localhost:${PORT}/`);
  console.log(`API node: http://localhost:${PORT}/api/artists`);
  console.log(`API node: http://localhost:${PORT}/api/albums`);
});