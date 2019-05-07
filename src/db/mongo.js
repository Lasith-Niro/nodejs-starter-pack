import mongoose from 'mongoose';

// make bluebird default Promise
import Promise from 'bluebird'; // eslint-disable-line no-global-assign
import config from '../../config'

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connection string
const connUrl = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.db}`;

// mongoose
const mongooseInit = () => {
  // connect to mongo db
  mongoose.connect(connUrl, { server: { socketOptions: { keepAlive: 1 } } });
  mongoose.connection.on('error', (e) => {
    console.error(`unable to connect to mongodb database: ${connUrl}`)
    console.error(e)
    process.exit(-1)
  })
}

module.exports = {
  init: mongooseInit
}
