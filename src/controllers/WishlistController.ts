import { Request, Response } from 'express'
import gDB from '../InitDataSource'
import { UserEntity } from '../entity/User.entity'
import { WishlistEntity } from '../entity/Wishlist.entity'
import { ProductEntity } from '../entity/Product.entity'

interface AuthenticatedRequest extends Request {
  userId?: number
}

export class WishlistController {
  static async getWishlist(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    try {
      const user = gDB.getRepository(UserEntity).findOne({
        where: { id: userId },
        relations: ['wishlist', 'wishlist.products'],
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json((await user).wishlist?.products || [])
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async addProductToWishlist(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId
    const { productId, name, price, image } = req.body
    try {
      const userRepo = gDB.getRepository(UserEntity)
      const wishlistRepo = gDB.getRepository(WishlistEntity)
      const productRepo = gDB.getRepository(ProductEntity)

      let user = await userRepo.findOne({
        where: { id: userId },
        relations: ['wishlist', 'wishlist.products'],
      })

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // create new wishlist if wishlist not found
      if (!user.wishlist) {
        const newWishlist = wishlistRepo.create()
        user.wishlist = newWishlist
        await userRepo.save(user)
      }
      // add product to wishlist
      const wishlistProduct = productRepo.create({
        productId,
        name,
        price,
        image,
        wishlist: user.wishlist,
      })

      await productRepo.save(wishlistProduct)

      res.status(201).json(wishlistProduct)
    } catch (e) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  static async removeFromWishlist(req: AuthenticatedRequest, res: Response) {
    const userId = req.userId
    const { productId } = req.params

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: 'UserId and ProductId are required' })
    }

    try {
      const wishlistRepository = gDB.getRepository(WishlistEntity)
      const productRepository = gDB.getRepository(ProductEntity)

      const wishlist = await wishlistRepository.findOne({
        where: { user: { id: userId } },
        relations: ['products'],
      })

      if (!wishlist) {
        return res.status(404).json({ message: 'Wishlist not found' })
      }

      wishlist.products = wishlist.products.filter(
        (product) => product.id !== +productId,
      )
      await wishlistRepository.save(wishlist)

      res.status(200).json({
        message: 'Product removed from wishlist',
        wishlist: wishlist.products,
      })
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      res.status(500).json({ message: 'Error removing from wishlist' })
    }
  }
}
