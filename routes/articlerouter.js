const router = require('express').Router()
const ArticleController = require('../controllers/articlecontroller')
const {authentication} = require('../middlewares/authentication')
const {authorization} = require('../middlewares/authorization')
const Multer = require('multer')
const multer = Multer({
  storage: Multer.MemoryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Maximum file size is 10MB
  },
});

const gcsMiddlewares = require('../middlewares/google-cloud-storage')

router.use(authentication)
router.post('/', multer.single('image'), gcsMiddlewares.sendUploadToGCS, ArticleController.addArticle)
router.get('/', ArticleController.listArticles)
router.delete('/:id', authorization, ArticleController.deleteArticle)

router.patch('/:id', authorization, multer.single('image'), gcsMiddlewares.sendUploadToGCS, ArticleController.editArticle)

module.exports = router