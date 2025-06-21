

const express = require('express');
const path = require('path');
const serverless = require('serverless-http');

const mainRoutes = require('../../routes/index');

require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, '../../views'));


app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRoutes);

module.exports.handler = serverless(app);

if (require.main === module) {
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor local iniciado en http://localhost:${PORT}`);
    });
  }