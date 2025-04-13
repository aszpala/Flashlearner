require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var setsRouter = require('./routes/sets');

//START
var app = express();

//CORS --> łaczenie frontendu i backendu
const cors = require("cors");
const corsOptions = {origin: ["http://localhost:5173", "http://localhost:63342"]}; //frontend, jetbrains webstorm
app.use(cors(corsOptions));

//baza
const fs = require('fs');
const db = require('./database/db');
const schemaPath = path.resolve(__dirname, './database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf-8');
const dbPath = path.resolve(__dirname, './database/data.db');

// swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/sets', setsRouter);


module.exports = app;