require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Zestora backend running on port ${PORT}`));
