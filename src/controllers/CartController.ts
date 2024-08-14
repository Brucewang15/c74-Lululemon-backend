import { NextFunction, Request, Response } from 'express'
import { ResponseClass } from '../helper/Response'
import { CartItemEntity } from '../entity/CartItem.entity'
import { validate } from 'class-validator'
import gDB from '../InitDataSource'
import { ShoppingCartEntity } from '../entity/ShoppingCart.entity'
import { CLog } from '../AppHelper'
import { instanceToPlain } from 'class-transformer'

export class CartController {
  static async getItem(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params
    if (!cartId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include the cart Id you are trying to search',
          ),
        )
    }
    let shoppingCart = null
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    try {
      shoppingCart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems', 'savedItems'],
      })
      CLog.info('shopping cart items', shoppingCart.cartItems)
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            'finding cart items successfully',
            shoppingCart.cartItems,
          ),
        )
    } catch (e) {
      CLog.bad('loading shopping cart items failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'loading shopping cart items failed'))
    }
  }

  // add items to a shopping cart, finding shopping cart with cart id
  static async addSingleItem(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params
    const {
      productId,
      colorId,
      size,
      quantity,
      price,
      image,
      name,
      swatchName,
    } = req.body

    if (!cartId) {
      return res.status(400).send(new ResponseClass(400, 'No Cart Found'))
    }

    if (
      !productId ||
      !colorId ||
      !quantity ||
      !price ||
      !image ||
      !name ||
      !swatchName ||
      (size === undefined && size !== null)
    ) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'You are missing product attributes, please check and include them all',
          ),
        )
    }
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    const cartItemRepo = gDB.getRepository(CartItemEntity)

    try {
      // find if the item is already in the db
      const existingItem = await cartItemRepo.findOne({
        where: {
          productId: productId,
          colorId: colorId,
          size: size || null,
          cart: { id: +cartId },
        },
      })
      // find if the item is already in the db
      if (existingItem) {
        existingItem.quantity += 1
        await cartItemRepo.save(existingItem)
        return res
          .status(200)
          .send(new ResponseClass(200, 'Item added Successfully', existingItem))
      }
      // if it is not in the db, then make a new cartItem entity and save it to db
      else {
        let shoppingCart = await cartRepo.findOneOrFail({
          where: { id: +cartId },
          relations: ['cartItems'],
        })
        const cartItem = new CartItemEntity()
        cartItem.image = image
        cartItem.colorId = colorId
        cartItem.size = size || null
        cartItem.quantity = quantity
        cartItem.price = price
        cartItem.name = name
        cartItem.swatchName = swatchName
        cartItem.productId = productId
        cartItem.cart = shoppingCart

        const errors = await validate(cartItem)
        if (errors.length > 0)
          return res
            .status(400)
            .send(
              new ResponseClass(
                400,
                'CartItem validation failed, check your item attributes',
                errors,
              ),
            )

        shoppingCart.cartItems.push(cartItem)

        await cartRepo.save(shoppingCart)
        await cartItemRepo.save(cartItem)

        // avoid Circular Structure, so sanitize it before sending it back
        const sanitizedShoppingCart = instanceToPlain(shoppingCart.cartItems)
        const sanitizedNewItem = instanceToPlain(cartItem)
        return res
          .status(200)
          .send(
            new ResponseClass(200, 'Add Item Successfully', sanitizedNewItem),
          )
      }
    } catch (e) {
      CLog.bad('Adding Items failed:', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'Adding Cart Item failed', e))
    }
  }

  // delete a cart item by cartId && cartItem id

  static async deleteItem(req: Request, res: Response, next: NextFunction) {
    const { cartId, itemId } = req.params
    if (!cartId || !itemId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include both shoppingCart ID and itemID to delete an cartItem in the shopping cart',
          ),
        )
    }
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    const cartItemRepo = gDB.getRepository(CartItemEntity)
    let cart = null
    let cartItem = null
    try {
      // find the cart item entity in the db and delete it
      cartItem = await cartItemRepo.findOneOrFail({
        where: { id: +itemId },
        relations: ['cart'],
      })
      CLog.info('CartItem before deletion:', {
        id: cartItem.id,
        productId: cartItem.productId,
        colorId: cartItem.colorId,
        size: cartItem.size,
        cartId: cartItem.cart ? cartItem.cart.id : null,
      })

      if (cartItem.cart && cartItem.cart.id === +cartId) {
        await cartItemRepo.delete(cartItem.id)
      } else {
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              'CartItem does not belong to the specified Cart',
            ),
          )
      }
      await cartItemRepo.delete(cartItem)

      const checkDeleted = await cartItemRepo.findOne({
        where: { id: +itemId },
      })
      if (checkDeleted) {
        return res
          .status(500)
          .send(new ResponseClass(500, 'Failed to delete the cart item.'))
      }

      CLog.info('The item you deleted ==>', cartItem)

      // find the shopping cart entity in the db, and filter the new cartItems
      cart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems'],
      })

      cart.cartItems = cart.cartItems.filter((item) => {
        return item.id !== +itemId
      })
      await cartRepo.save(cart)

      const sanitizedCartItems = instanceToPlain(cart.cartItems)

      return res.status(200).send(
        new ResponseClass(200, 'Deleting cart item successfully', {
          updatedCart: sanitizedCartItems,
          deletedItem: cartItem,
        }),
      )
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, 'deleting cart item failed, try again'))
    }
  }

  // update an item's quantity
  static async updateQuantity(req: Request, res: Response, next: NextFunction) {
    const { cartId, itemId } = req.params
    const { quantity } = req.body
    if (!cartId || !itemId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Please include both Cart ID and Item ID in params to update your cartitem',
          ),
        )
    }
    const cartItemRepo = gDB.getRepository(CartItemEntity)
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    try {
      let existingItem = await cartItemRepo.findOneOrFail({
        where: { id: +itemId },
      })
      existingItem.quantity = +quantity
      await cartItemRepo.save(existingItem)
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            'item quantity updated successfully',
            existingItem,
          ),
        )
    } catch (e) {
      CLog.bad('updating item quantity failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'update item quantity failed'))
    }
  }

  static async updateItemAttributes(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { colorId, productId, size, image, swatchName } = req.body.newItem
    const { cartId, itemId } = req.params
    let cartItem = null
    const cartItemRepo = gDB.getRepository(CartItemEntity)
    let shoppingCart = null
    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    try {
      cartItem = await cartItemRepo.findOneOrFail({
        where: { id: +itemId },
      })
      cartItem.colorId = colorId
      cartItem.size = size
      cartItem.image = image
      cartItem.swatchName = swatchName
      const errors = await validate(cartItem)
      if (errors.length > 0) {
        return res
          .status(400)
          .send(
            new ResponseClass(400, 'CartItem Information validation failed'),
          )
      }

      // here : test if the updated item is already in the db(same color same productId, same size), if yes, then merge those two items and add their quantity together, then delete the existing/or new one.
      shoppingCart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems'],
      })
      const existingItem = shoppingCart.cartItems.find((item) => {
        return (
          item.productId === cartItem.productId &&
          item.colorId === cartItem.colorId &&
          item.size === cartItem.size &&
          item.id !== cartItem.id
        )
      })
      if (existingItem) {
        existingItem.quantity += cartItem.quantity
        await cartItemRepo.delete({ id: cartItem.id })
        await cartItemRepo.save(existingItem)
        // Verify the deletion
        const deletedItem = await cartItemRepo.findOne({
          where: { id: cartItem.id },
        })
        if (!deletedItem) {
          console.log('Item successfully deleted')
        } else {
          console.log('Failed to delete the item')
        }
        return res
          .status(200)
          .send(
            new ResponseClass(200, 'Merging items successfully', existingItem),
          )
      } else {
        await cartItemRepo.save(cartItem)
        return res
          .status(200)
          .send(new ResponseClass(200, 'updating item successfully', cartItem))
      }
    } catch (e) {
      CLog.bad('updating item attributes failed', e)
      return res
        .status(400)
        .send(new ResponseClass(400, 'updating item attributes failed'))
    }
  }

  static async syncCart(req: Request, res: Response, next: NextFunction) {
    const { cartId } = req.params
    const { items } = req.body
    console.log('Received items for sync:', items)

    if (!cartId || !items || !Array.isArray(items)) {
      CLog.bad(
        'Invalid date, please make sure you enter cart id, items from localStoarge and items is an array',
      )
      return res
        .status(400)
        .send(new ResponseClass(400, 'Invalid date, no cart id or items array'))
    }

    const cartRepo = gDB.getRepository(ShoppingCartEntity)
    const cartItemRepo = gDB.getRepository(CartItemEntity)

    try {
      const cart = await cartRepo.findOneOrFail({
        where: { id: +cartId },
        relations: ['cartItems'],
      })
      for (const localItem of items) {
        const existingItem = cart.cartItems.find((item) => {
          return (
            item.productId === localItem.productId &&
            item.size === localItem.size &&
            item.colorId === localItem.colorId
          )
        })

        if (existingItem) {
          existingItem.quantity += localItem.quantity
          await cartItemRepo.save(existingItem)
        } else {
          const newCartItem = new CartItemEntity()
          newCartItem.productId = localItem.productId
          newCartItem.colorId = localItem.colorId
          newCartItem.size = localItem.size || null
          newCartItem.quantity = localItem.quantity
          newCartItem.price = localItem.price
          newCartItem.image = localItem.image
          newCartItem.name = localItem.name
          newCartItem.swatchName = localItem.swatchName
          newCartItem.cart = cart
          await cartItemRepo.save(newCartItem)
          cart.cartItems.push(newCartItem)
        }
      }
      await cartRepo.save(cart)
      const sanitizedCartItems = instanceToPlain(cart.cartItems)
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            'Cart merged successfully',
            sanitizedCartItems,
          ),
        )
    } catch (e) {
      CLog.bad('merging cart failed', e)
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            'Merging cart from localStorage failed',
            e.message,
          ),
        )
    }
  }
}
