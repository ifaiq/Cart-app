var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    required: true
  },
  admin: {
    type: Number,
    default:1
  }
});

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};


console.log(userSchema);
module.exports = mongoose.model('User', userSchema);
