const Article = require('../models/article')
const ObjectID = require('mongodb').ObjectID

module.exports = {
    authorization(req,res,next) {
        Article.findOne({
            _id: req.params.id
        })
            .then(article => {
                if(article) {
                    const {id} = req.decode
                    let strObj = article.user + ''
      
                    if(strObj === id) {                    
                        next()
                    }
                    else {
                        next({status: 401, message: "unauthorized"})
                    }
                }
                else {
                    next({code: 404})
                }
            })
            .catch(err => {
                next({status: 401, message: "unauthorized"})
            })
    }
}