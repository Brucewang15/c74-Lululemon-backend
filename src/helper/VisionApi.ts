import { NextFunction, Request, response, Response } from "express";
import axios from "axios";
import vision from "@google-cloud/vision";

const google_api_key = process.env.GOOGLE_API_KEY;

const productSearchClient = new vision.ProductSearchClient();
const imageAnnotatorClient = new vision.ImageAnnotatorClient();

class VisionApi {
  static getSimilarProductsUri = async (img_uri) => {
    const projectId = "jay-lulu-test";
    const location = "us-east1";
    const productSetId = "lulu01";
    const productCategory = "apparel";
    const filter = "";
    const productSetPath = productSearchClient.productSetPath(
      projectId,
      location,
      productSetId,
    );

    const search_req = {
      image: { source: { imageUri: img_uri } },
      features: [{ type: "PRODUCT_SEARCH" as const }],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    };

    const content_req = {
      image: { source: { imageUri: img_uri } },
      features: [{ type: "SAFE_SEARCH_DETECTION" as const }],
    };

    const requests = [search_req, content_req];

    return await VisionApi.getSimilarProducts(requests);
  };
  static getSimilarProductsImage = async (img) => {
    const projectId = "jay-lulu-test";
    const location = "us-east1";
    const productSetId = "lulu01";
    const productCategory = "apparel";
    const filter = "";
    const productSetPath = productSearchClient.productSetPath(
      projectId,
      location,
      productSetId,
    );

    const search_req = {
      image: { content: img },
      features: [{ type: "PRODUCT_SEARCH" as const }],
      imageContext: {
        productSearchParams: {
          productSet: productSetPath,
          productCategories: [productCategory],
          filter: filter,
        },
      },
    };

    const content_req = {
      image: { content: img },
      features: [{ type: "SAFE_SEARCH_DETECTION" as const }],
    };

    const requests = [search_req, content_req];

    return await VisionApi.getSimilarProducts(requests);
  };

  static getSimilarProducts = async (requests) => {
    const responses = await imageAnnotatorClient.batchAnnotateImages({
      requests: requests,
    });

    const search_err = responses[0]["responses"][0]["error"];
    const content_err = responses[0]["responses"][1]["error"];

    if (search_err != null) {
      const error = search_err;
      console.log(error);
      throw { message: `Google Vision Error: ${error.message}`, code: 1 };
    }
    if (content_err != null) {
      const error = content_err;
      console.log(error);
      throw { message: `Google Vision Error: ${error.message}`, code: 1 };
    }

    const search_res =
      responses[0]["responses"][0]["productSearchResults"]["results"];
    const content_res = responses[0]["responses"][1]["safeSearchAnnotation"];
    // console.log(content_res)

    var inappropriate = false;
    for (const key in content_res) {
      if (key == "adult" || key == "violence") {
        if (content_res[key] == "VERY_LIKELY") {
          inappropriate = true;
          break;
        }
      }
    }

    if (inappropriate) {
      throw { message: `Content warning`, code: 2 };
    }

    // console.log(results)
    // console.log('\nSimilar product information:')
    // results.forEach(result => {
    //   console.log('Product id:', result['product'].name.split('/').pop())
    //   console.log('Product display name:', result['product'].displayName)
    //   console.log('Product description:', result['product'].description)
    //   console.log('Product category:', result['product'].productCategory)
    // })

    return search_res;
  };
}

export default VisionApi;
