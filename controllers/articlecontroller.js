const Article = require('../models/article')
const ObjectID = require('mongodb').ObjectID

class ArticleController {

  static addArticle(req, res, next) {

    let img = 'https://countrylakesdental.com/wp-content/uploads/2016/10/orionthemes-placeholder-image.jpg'
    if (req.file && req.file.gcsUrl) {
      img = req.file.gcsUrl
    }

    Article.create({
      user: req.decode.id,
      title: req.body.title,
      content: req.body.content,
      image: img,
    })
      .then(article => {
        res.status(200).json(article)
      })
      .catch(next)
  }

  static listArticles(req,res,next) {
    Article.find({
      user: req.decode.id
    })
      .then(articles => {
        res.status(200).json(articles)
      })
      .catch(next)
  }

  static deleteArticle(req,res,next) {
    Article.deleteOne({ 
      _id: ObjectID(req.params.id)
    })
      .then(deleted => {
        res.status(200).json(deleted)
      
      })
      .catch(next)
  }

  static editArticle(req,res,next) {
    let data = {
      title: req.body.title,
      content: req.body.content
    }

    if (req.file && req.file.gcsUrl) {
      data.image = req.file.gcsUrl
    }

    Article.updateOne({
      _id: ObjectID(req.params.id)
    }, data)
      .then(edited => {
        res.status(200).json(edited)
      })
      .catch(next)
  }
}

module.exports = ArticleController