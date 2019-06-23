const mongoose = require('mongoose')
const Schema = mongoose.Schema
const {hashPassword} = require('../helpers/bcrypt')

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: ['true', 'First name is required']
  },
  lastName: {
    type: String,
    required: ['true', 'Last name is required']
  },
  email: {
    type: String,
    validate: {
      validator: 
        function(value){
          return User.findOne({
            email: value
          })
            .then(user => {
              if(user) {
                return false
              }
            }) 
      },
      message: props => `${props.value} is already registered. Please use another email.`
    },
    required: ['true', 'Email is required']
  },
  password: {
    type: String,
    required: ['true', 'Password is required']
  }
})

UserSchema.pre('save', function(next) {
  let hash = hashPassword(this.password)
  this.password = hash
  next()
})

const User = mongoose.model('User', UserSchema)

module.exports = User