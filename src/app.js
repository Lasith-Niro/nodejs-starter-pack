import express from 'express'

import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'

import db from './db/index'
import dashboard from './routes/dashboard'


// initialize mongoose
db.mongo.init()

var app = express()

// enable cors
var corsOption = {
  origin: '*',
}
app.use(cors(corsOption))

// view engine setup
app.set('view engine', 'pug')

// app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
  res.send('bconic location sdk API')
})

app.use('/v1/dashboard', dashboard)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app;
