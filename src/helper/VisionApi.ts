import { NextFunction, Request, Response } from 'express'
import axios from 'axios'
import vision from '@google-cloud/vision'

const google_api_key = process.env.GOOGLE_API_KEY

const productSearchClient = new vision.ProductSearchClient()
const imageAnnotatorClient = new vision.ImageAnnotatorClient()

class VisionApi {
  static getSimilarProductsUri = async (img_uri) => {
    const projectId = 'jay-lulu-test'
    const location = 'us-east1'
    const productSetId = 'lulu01'
    const productCategory = 'apparel'
    const filter = ''
    const productSetPath = productSearchClient.productSetPath(
      projectId,
      location,
      productSetId,
    )

    const request = {
      image: { source: { imageUri: img_uri } },
      features: [{ type: 'PRODUCT_SEARCH' as const }],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    }

    return await VisionApi.getSimilarProducts(request)
  }

  static getSimilarProductsImage = async (img) => {
    const projectId = 'jay-lulu-test'
    const location = 'us-east1'
    const productSetId = 'lulu01'
    const productCategory = 'apparel'
    const filter = ''
    const productSetPath = productSearchClient.productSetPath(
      projectId,
      location,
      productSetId,
    )

    const request = {
      image: { content: img },
      features: [{ type: 'PRODUCT_SEARCH' as const }],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    }

    return await VisionApi.getSimilarProducts(request)
  }

  static getSimilarProducts = async (request) => {
    /**
     * TODO(developer): Uncomment the following line before running the sample.
     */
    const requests = [request]

    const responses = await imageAnnotatorClient.batchAnnotateImages({
      requests: requests,
    })

    if (responses[0]['responses'][0]['error'] != null) {
      const error = responses[0]['responses'][0]['error']
      console.log(error)
      throw { message: `Google Vision Error: ${error.message}`, code: 1 }
    }
    const results =
      responses[0]['responses'][0]['productSearchResults']['results']
      
    // console.log(results)
    // console.log('\nSimilar product information:')
    // results.forEach(result => {
    //   console.log('Product id:', result['product'].name.split('/').pop())
    //   console.log('Product display name:', result['product'].displayName)
    //   console.log('Product description:', result['product'].description)
    //   console.log('Product category:', result['product'].productCategory)
    // })

    return results
  }
}

export default VisionApi
