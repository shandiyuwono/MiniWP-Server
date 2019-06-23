const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: String,
  content: String,
  image: String,
  createdAt: Date
}, {
  timestamps: true
})

const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article