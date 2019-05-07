import mongoose from 'mongoose';
var Schema = mongoose.Schema;

// make bluebird default Promise
import Promise from 'bluebird'; // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

/**
 * Organization Schema
 */
const OrganizationSchema = new mongoose.Schema({
 orgName: {
   type: String,
   required: true,
   unique : true,
 },
 createdAt: {
   type: Date,
   default: Date.now,
   required : true
 }

});

// on every save, add the date
OrganizationSchema.pre('save', function (next) {
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
OrganizationSchema.statics = {
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
export default mongoose.model('Organization', OrganizationSchema, 'org');
