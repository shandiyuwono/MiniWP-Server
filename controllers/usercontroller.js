const User = require('../models/user')
const {verifyPassword} = require('../helpers/bcrypt')
const {generateToken} = require('../helpers/jwt')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const generatePassword = require('../helpers/password')


class UserController {
  static register(req,res,next){
    const {firstName, lastName, email, password} = req.body
    const input = {firstName, lastName, email, password}
    User.create(input)
      .then(newUser => {
        res.status(200).json(newUser)
      })
      .catch(next)
  }

  static login(req,res,next){
    User.findOne({
      email: req.body.email
    })
      .then(user => {
        if(user) {
          if(verifyPassword(req.body.password, user.password)) {
            const payload = {
              email : user.email,
              id: user.id
            }
            const token = generateToken(payload)
            res.status(200).json({
              firstName: user.firstName,
              lastName: user.lastName,
              accessToken: token
            })
          }
          else{
            next()
          }
        }
        else{
          next()
        }
      })
      .catch(next)
  }

  static googleToken(req, res, next) {
    // console.log(req.body)
    client
      .verifyIdToken({
        idToken: req.body.idToken,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      .then(function (ticket) {
        const { email } = ticket.getPayload()
        const password = generatePassword()

        User.findOne({
          email: email
        })
          .then(user => {
            if (user) {
              const payload = {
                email: user.email,
                id: user.id
              }
              const token = generateToken(payload)
              res.status(200).json({
                firstName: user.firstName,
                lastName: user.lastName,
                accessToken: token
              })
            }
            else {
              User.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: email,
                password: password
              })
                .then(newUser => {
                  const payload = {
                    email: newUser.email,
                    id: newUser.id
                  }
                  console.log(newUser)
                  const token = generateToken(payload)
                  res.status(200).json({
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    accessToken: token
                  })
                })
                .catch(next)
            }
          })
      })
      .catch(next)
    }
}

module.exports = UserController