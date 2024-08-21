import { NextFunction, Request, Response } from 'express'

import VisionApi from '../helper/VisionApi'

class ImageAIController {
  static index = (req: Request, res: Response) => {
    res.send('NOT IMPLEMENTED')
  }

  static handleImageSearch = async (req: Request, res: Response, doUriSearch: boolean) => {
    
    var errMsg = ""
    for (var i = 0; i < 3; i++) {
      try {
        var result
        if (doUriSearch) {
          const { image_uri } = req.body
          result = await VisionApi.getSimilarProductsUri(image_uri)
        } else {
          const imageBase64 = req.body.toString('base64')
          result = await VisionApi.getSimilarProductsImage(imageBase64)
        }
        res.status(200).send(result)
        return

      } catch (err) {
        console.log(err)
        if (err.code == 1) {
          errMsg = err.message
        } else if (err.code == 2) {
          res.status(406).send(err.message)
          return
        } else {
          res.status(400).send(err.message)
          return
        }
      }
    }

    res.status(503).send(errMsg)
  }
}

export default ImageAIController
