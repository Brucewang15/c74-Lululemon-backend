import { Request, Response } from "express";
import gDB from "../InitDataSource";
import { UserEntity } from "../entity/User.entity";
import { WishlistEntity } from "../entity/Wishlist.entity";
import { ProductEntity } from "../entity/Product.entity";

export class WishlistController {
  static async getWishlist(req: Request, res: Response) {
    // const userId = req.userId;
    const userId = Number(req.params.userId);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const user = await gDB.getRepository(UserEntity).findOne({
        where: { id: +userId },
        relations: ["wishlist", "wishlist.products"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user.wishlist?.products || []);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async addProductToWishlist(req: Request, res: Response) {
    //const userId = req.userId;
    const userId = Number(req.params.userId);
    const { productId, name, price, image } = req.body;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const userRepo = gDB.getRepository(UserEntity);
      const wishlistRepo = gDB.getRepository(WishlistEntity);
      const productRepo = gDB.getRepository(ProductEntity);

      let user = await userRepo.findOne({
        where: { id: +userId },
        relations: ["wishlist", "wishlist.products"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // create new wishlist if wishlist not found
      if (!user.wishlist) {
        const newWishlist = wishlistRepo.create();
        newWishlist.user = user;
        user.wishlist = newWishlist;
        //await wishlistRepo.save(newWishlist);
        await userRepo.save(user);
      }

      const wishlist = await wishlistRepo.findOne({
        where: { id: user.wishlist.id },
        relations: ["products"],
      });

      // Check if the product already exists in the products table
      const existingProduct = await productRepo.findOne({
        where: { productId },
      });
      let wishlistProduct = existingProduct;

      if (!existingProduct) {
        wishlistProduct = productRepo.create({ productId, name, price, image });
        await productRepo.save(wishlistProduct);
      }

      if (
        wishlist.products.some((product) => product.id === wishlistProduct.id)
      ) {
        return res.status(400).json({ message: "Product already in wishlist" });
      }

      wishlist.products.push(wishlistProduct);
      await wishlistRepo.save(wishlist);

      res.status(201).json(wishlistProduct);

      //res.status(201).json(wishlistProduct);
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async removeFromWishlist(req: Request, res: Response) {
    //const userId = req.userId;
    const userId = Number(req.params.userId);
    const productId = req.params.productId;
    console.log("REMOVING FROM WISHLIST");
    console.log(userId);
    console.log(productId);
    // const { productId } = req.params;

    if (!userId || !productId) {
      return res
        .status(400)
        .json({ message: "UserId and ProductId are required" });
    }

    try {
      const wishlistRepository = gDB.getRepository(WishlistEntity);
      const productRepository = gDB.getRepository(ProductEntity);

      const wishlist = await wishlistRepository.findOne({
        where: { user: { id: +userId } },
        relations: ["products"],
      });

      if (!wishlist) {
        return res.status(404).json({ message: "Wishlist not found" });
      }

      const product = await productRepository.findOne({ where: { productId } });

      if (!product) {
        return res
          .status(404)
          .json({ message: "Product not found in wishlist" });
      }

      wishlist.products = wishlist.products.filter((p) => p.id !== product.id);
      await wishlistRepository.save(wishlist);

      res.status(200).json({
        message: "Product removed from wishlist",
        wishlist: wishlist.products,
      });
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      res.status(500).json({ message: "Error removing from wishlist" });
    }
  }
}
