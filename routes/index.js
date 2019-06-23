const router = require('express').Router()
const articleRouter = require('../routes/articlerouter')
const userRouter = require('../routes/userrouter')

router.use('/article', articleRouter)
router.use('/user', userRouter)

module.exports = router