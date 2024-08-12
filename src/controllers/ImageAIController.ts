import { NextFunction, Request, Response } from 'express'

import VisionApi from '../helper/VisionApi'

class ImageAIController {
  static index = (req: Request, res: Response) => {
    res.send('NOT IMPLEMENTED')
  }

  static imageSearch_uri = async (req: Request, res: Response) => {

    const { image_uri } = req.body

    try {
      var result = await VisionApi.getSimilarProductsUri(image_uri)
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send(err)
    }
    
  }
  
  static imageSearch_image = async (req: Request, res: Response) => {

    const imageBase64 = req.body.toString('base64')

      // console.log(req.body)
      // console.log(imageBase64)
      
    try {
      var result = await VisionApi.getSimilarProductsImage(imageBase64)
      // console.log(result)
      res.status(200).send(result)
    } catch (err) {
      res.status(400).send(err)
    }
    
  }
}

export default ImageAIController
