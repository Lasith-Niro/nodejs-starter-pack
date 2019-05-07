import mongoose from 'mongoose';
var Schema = mongoose.Schema;
import shortid from 'shortid';
// make bluebird default Promise
import Promise from 'bluebird'; // eslint-disable-line no-global-assign
// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

const apiKeySchema = new mongoose.Schema({
    _id : {
        type : String,
        required : true,
        default: shortid.generate
    },
    type : {
        type : String
    },
    appName : {
        type : String,
        unique : true,
        sparse: true
    },
    pkgName : {
        type : String,
        unique : true,
        sparse: true
    },
    SHA1_fingerprint : {
        type : String,
        unique : true,
        sparse: true
    },
    bundleIdentifier : {
        type : String,
        unique : true,
        sparse: true
    },
    apiKey : {
        type : String,
        required : true,
        unique : true,
        sparse: true
    },
    orgId : {
        type : String
    }
});

// on every save, add the date
apiKeySchema.pre('save', function (next) {
  // get the current date
  var currentDate = new Date();

  // change the updated_at field to current date
  this.updatedAt = currentDate;

  // if created_at doesn't exist, add to that field
  if (! this.createdAt) {
    this.createdAt = currentDate;
  }

  next();
});


/**
 * Statics
 */
apiKeySchema.statics = {
  /**
   * Get answer
   * @param {ObjectId} id - The objectId of Organization.
   * @returns {Promise<Organization, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((loc) => {
        if (loc) {
          return loc;
        }
        const err = new APIError('No such answer exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List answer in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of answers to be skipped.
   * @param {number} limit - Limit number of answers to be returned.
   * @returns {Promise<Survey[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find({deleted: false})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }
};


/**
 * @typedef Organization
 */
export default mongoose.model('apiKeyObject', apiKeySchema, 'apiKeys');
