import ImageAIController from '../controllers/ImageAIController'

import { Router } from 'express'
import fileUpload from 'express-fileupload'

const bodyParser = require('body-parser')

const router = Router()

router.get('/', ImageAIController.index)

router.post('/search/uri', (req, res) => {
  ImageAIController.handleImageSearch(req, res, true)
})
router.post(
  '/search/img',
  bodyParser.raw({ type: ['image/jpeg', 'image/png'], limit: '4mb' }),
  (req, res) => {
    ImageAIController.handleImageSearch(req, res, false)
  },
)

export default router
