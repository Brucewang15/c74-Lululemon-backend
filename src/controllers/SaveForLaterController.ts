import { NextFunction, Request, Response } from 'express'
import { CartItemEntity } from '../entity/CartItem.entity'
import gDB from '../InitDataSource'
import { ShoppingCartEntity } from '../entity/ShoppingCart.entity'
import { SaveForLaterEntity } from '../entity/SaveForLater.entity'
import { ResponseClass } from '../helper/Response'
import { CLog } from '../AppHelper'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class SaveForLaterController {
  static async moveToSaveForLater(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    // This item Id should get from fetchCartItems API
    const { cartId, itemId } = req.params
    const cartItemRepo = gDB.getRepository(CartItemEntity)
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    const savedItemRepo = gDB.getRepository(SaveForLaterEntity)

    if (!cartId || !itemId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include cartId and itemId to save this item',
          ),
        )
    }

    try {
      const item = await cartItemRepo.findOneOrFail({
        where: {
          id: +itemId,
        },
        relations: ['cart'],
      })
      const cart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems', 'savedItems'],
      })
      const savedItem = new SaveForLaterEntity()
      savedItem.cart = item.cart
      savedItem.colorId = item.colorId
      savedItem.image = item.image
      savedItem.name = item.name
      savedItem.price = item.price
      savedItem.productId = item.productId
      savedItem.size = item.size
      savedItem.swatchName = item.swatchName
      savedItem.quantity = item.quantity
      console.log('saved Items before saving ==>', cart.savedItems)
      await savedItemRepo.save(savedItem)

      cart.cartItems = cart.cartItems.filter((i) => i.id !== +itemId)
      cart.savedItems = [...cart.savedItems, savedItem]
      await cartRepo.save(cart)
      await cartItemRepo.remove(item)

      const sanitizedSavedItems = instanceToPlain(cart.savedItems)
      // const sanitizedCart = instanceToPlain(cart)

      return res.status(200).send(
        new ResponseClass(200, 'Item moved to save for later successfully', {
          savedItems: sanitizedSavedItems,
        }),
      )
    } catch (e) {
      CLog.bad('save for later failed:', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Save for later failed'))
    }
  }

  static async moveBackToCart(req: Request, res: Response, next: NextFunction) {
    // this item Id should get from fetch Save for later api
    const { cartId, savedItemId } = req.params
    if (!(cartId && savedItemId)) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include both cartId and saved itemId to move back to cart',
          ),
        )
    }

    try {
      const itemRepo = gDB.getRepository(CartItemEntity)
      const itemCartRepo = gDB.getRepository(ShoppingCartEntity)
      const savedItemRepo = gDB.getRepository(SaveForLaterEntity)

      const cart = await itemCartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems', 'savedItems'],
      })
      const savedItem = await savedItemRepo.findOneOrFail({
        where: { id: +savedItemId },
        relations: ['cart'],
      })
      const newItem = new CartItemEntity()
      newItem.cart = savedItem.cart
      newItem.colorId = savedItem.colorId
      newItem.image = savedItem.image
      newItem.name = savedItem.name
      newItem.price = savedItem.price
      newItem.productId = savedItem.productId
      newItem.size = savedItem.size
      newItem.swatchName = savedItem.swatchName
      newItem.quantity = savedItem.quantity

      await itemRepo.save(newItem)

      cart.cartItems = [...cart.cartItems, newItem]
      cart.savedItems = cart.savedItems.filter((i) => i.id !== +savedItemId)
      await itemCartRepo.save(cart)

      await savedItemRepo.remove(savedItem)

      const sanitizedSavedItems = instanceToPlain(cart.savedItems)
      const sanitizedCartItems = instanceToPlain(cart.cartItems)
      return res.status(200).send(
        new ResponseClass(200, 'Move back to cart successfully', {
          shoppingCart: sanitizedCartItems,
          savedItems: sanitizedSavedItems,
        }),
      )
    } catch (e) {
      CLog.bad('Moved back to cart failed:', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Move back to Cart failed'))
    }
  }

  static async getSavedItems(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params
    if (!cartId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include your cart Id to search all saved Items',
          ),
        )
    }

    try {
      const cartRepo = gDB.getRepository(ShoppingCartEntity)
      const cart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['savedItems'],
      })

      return res.status(200).send(
        new ResponseClass(200, 'Load saved items successfully', {
          savedItems: cart.savedItems,
        }),
      )
    } catch (e) {
      CLog.bad('Load all saved items failed:', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Load saved items failed'))
    }
  }

  static async deleteSavedItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { cartId, savedItemId } = req.params
    if (!(cartId && savedItemId)) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include both cartId and Saved Item id to delete it',
          ),
        )
    }

    try {
      const cartRepo = gDB.getRepository(ShoppingCartEntity)
      const savedItemRepo = gDB.getRepository(SaveForLaterEntity)
      const cart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['savedItems'],
      })
      const savedItem = await savedItemRepo.findOneOrFail({
        where: { id: +savedItemId },
      })
      cart.savedItems = cart.savedItems.filter((i) => i.id !== +savedItemId)
      await savedItemRepo.remove(savedItem)

      return res.status(200).send(
        new ResponseClass(200, 'Deleting a saved item successfully', {
          savedItems: cart.savedItems,
        }),
      )
    } catch (e) {
      CLog.bad('deleting a saved item failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Deleting a saved item failed'))
    }
  }
}
