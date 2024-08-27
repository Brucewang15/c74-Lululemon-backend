import gDB from "../InitDataSource";
import { OrderEntity } from "../entity/Order.entity";
import { NextFunction, Request, Response } from "express";
import { ResponseClass } from "../helper/Response";
import { CLog } from "../AppHelper";
import { UserEntity } from "../entity/User.entity";
import { ShippingAddressEntity } from "../entity/ShippingAddress.entity";
import { validate } from "class-validator";
import { ShoppingCartEntity } from "../entity/ShoppingCart.entity";
import { OrderItemEntity } from "../entity/OrderItem.entity";
import { instanceToPlain } from "class-transformer";
import { CartItemEntity } from "../entity/CartItem.entity";

export class OrderController {
  // get one order by order id
  static async getOrder(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    if (!orderId) {
      return res
        .status(400)
        .send(new ResponseClass(404, "include your order id to search"));
    }
    const orderRepo = gDB.getRepository(OrderEntity);
    try {
      const order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
      });
      if (!order) {
        return res.status(404).send(new ResponseClass(404, "No order found"));
      }
      return res.status(200).send(
        new ResponseClass(200, "Searching Order Successful", {
          order,
        }),
      );
    } catch (e) {
      CLog.bad("loading order failed", e);
      return res
        .status(400)
        .send(new ResponseClass(400, "Loading order failed", e.message));
    }
  }

  // place an order by userId
  static async placeOrder(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    const orderData = req.body.orderData;
    // required data {
    //     "orderData": {
    //         "taxAmount": 20,
    //         "totalBeforeTax": 300.97,
    //         "shippingAddressId":25,
    //         "isGift": true, (required)
    //         "giftTo":"Dan", (optional)
    //         "giftFrom":"Ben"(optional),
    //         "giftMessage":"happy bday"(optional)
    //          "shippingFee" : 20, 30, etc. come from front end
    //     }
    // }
    if (!userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            "Please log in or include a user id to place an order",
          ),
        );
    }
    const userRepo = gDB.getRepository(UserEntity);
    const orderRepo = gDB.getRepository(OrderEntity);
    const addressRepo = gDB.getRepository(ShippingAddressEntity);
    const orderItemRepo = gDB.getRepository(OrderItemEntity);
    const cartItemRepo = gDB.getRepository(CartItemEntity);

    try {
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ["shoppingCart"],
      });

      if (!user) {
        return res.status(404).send(new ResponseClass(404, "no user found"));
      }

      if (user.shoppingCart.cartItems.length === 0) {
        return res
          .status(400)
          .send(
            new ResponseClass(
              400,
              "Your shopping cart is empty, cannot place order",
            ),
          );
      }
      const shippingAddress = await addressRepo.findOneOrFail({
        where: { id: +orderData.shippingAddressId },
      });

      const order = new OrderEntity();

      order.taxAmount = orderData.taxAmount;
      order.totalBeforeTax = orderData.totalBeforeTax;
      order.shippingAddress = shippingAddress;
      order.isGift = orderData.isGift;
      order.user = user;

      if (orderData.shippingFee !== undefined) {
        order.shippingFee = orderData.shippingFee;
      }

      if (order.isGift) {
        order.giftFrom = orderData.giftFrom;
        order.giftTo = orderData.giftTo;
        order.giftMessage = orderData.giftMessage;
      }

      order.calcTotal();

      order.orderItems = [];

      for (const cartItem of user.shoppingCart.cartItems) {
        const orderItem = new OrderItemEntity();
        orderItem.productId = cartItem.productId;
        orderItem.colorId = cartItem.colorId;
        orderItem.size = cartItem.size;
        orderItem.quantity = cartItem.quantity;
        orderItem.price = cartItem.price;
        orderItem.image = cartItem.image;
        orderItem.name = cartItem.name;
        orderItem.swatchName = cartItem.swatchName;
        orderItem.order = order;

        await orderItemRepo.save(orderItem);

        order.orderItems.push(orderItem);
        // remove shopping cart when they placed an order
        await cartItemRepo.remove(cartItem);
      }

      const errors = await validate(order);
      if (errors.length > 0) {
        CLog.bad("order format validation failed", errors);
        return res.status(400).send("Order format validation failed");
      }
      console.log("Saving Order:", order);

      const savedOrder = await orderRepo.save(order);
      const sanitizedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      savedOrder.user = sanitizedUser as any;
      const sanitizedOrderInfo = instanceToPlain(savedOrder);
      return res.status(200).send(
        new ResponseClass(200, "Placed Order Successfully!", {
          order: sanitizedOrderInfo,
          orderId: savedOrder.id,
        }),
      );
    } catch (e) {
      CLog.bad("placing an order failed", e);
      return res
        .status(400)
        .send(new ResponseClass(400, "Placing an order failed", e.message));
    }
  }

  // update an order's shipping address

  static async updateOrderAddress(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { orderId, userId } = req.params;
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      province,
      postalCode,
      city,
      country,
    } = req.body;

    if (!orderId || !userId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            "please include both order id and user id to update an address",
          ),
        );
    }

    const orderRepo = gDB.getRepository(OrderEntity);
    const shippingAddressRepo = gDB.getRepository(ShippingAddressEntity);
    const userRepo = gDB.getRepository(UserEntity);

    try {
      // find the order
      const order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
        relations: ["shippingAddress"],
      });
      if (!order)
        return res
          .status(404)
          .send(new ResponseClass(404, "We cannot find your order, try again"));

      // create a new address entity
      let newAddress = new ShippingAddressEntity();
      if (firstName !== undefined) newAddress.firstName = firstName;
      if (lastName !== undefined) newAddress.lastName = lastName;
      if (phoneNumber !== undefined) newAddress.phoneNumber = phoneNumber;
      if (address !== undefined) newAddress.address = address;
      if (province !== undefined) newAddress.province = province;
      if (postalCode !== undefined) newAddress.postalCode = postalCode;
      if (city !== undefined) newAddress.city = city;
      if (country !== undefined) newAddress.country = country;

      // validate the new address format
      const errors = await validate(newAddress);
      if (errors.length > 0) {
        CLog.bad("validating address format failed", errors);
        return res
          .status(400)
          .send(new ResponseClass(400, "Validating new address failed"));
      }
      // find the user
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ["shippingAddresses"],
      });
      if (!user) {
        return res
          .status(404)
          .send(
            new ResponseClass(404, "No user found, enter the right user id"),
          );
      }
      // save the new address to the user
      user.shippingAddresses.push(newAddress);
      await userRepo.save(user);
      // replace the order address
      order.shippingAddress = newAddress;
      await orderRepo.save(order);

      return res.status(200).send(
        new ResponseClass(200, "editing order address successfully", {
          order,
        }),
      );
    } catch (e) {
      CLog.bad("editing order address failed", e);
      return res
        .status(400)
        .send(new ResponseClass(400, "Editing order address failed", e));
    }
  }

  //   update order (just the order status: pending, paid, shipped, delivered, cancelled
  static async updateOrderStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { orderId } = req.params;
    const { orderStatus } = req.body;
    if (!orderId) {
      return res.status(400).send("order id required to update an order");
    }
    const orderRepo = gDB.getRepository(OrderEntity);
    try {
      const order = await orderRepo.findOneOrFail({ where: { id: +orderId } });
      if (!order) {
        return res.status(404).send(new ResponseClass(400, "Order not found"));
      }
      order.orderStatus = orderStatus;
      await orderRepo.save(order);
      return res
        .status(200)
        .send(
          new ResponseClass(
            200,
            "Order status updated successfully",
            order.orderStatus,
          ),
        );
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, "update order status failed", e.message));
    }
  }

  // Update order's shipping fee

  static async updateShippingFee(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { orderId } = req.params;
    const { shippingFee } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .send(
          new ResponseClass(
            400,
            "include your orderId to update the shipping fee",
          ),
        );
    }

    const orderRepo = gDB.getRepository(OrderEntity);

    try {
      // find the order
      let order = await orderRepo.findOneOrFail({ where: { id: +orderId } });
      if (!order) {
        return res
          .status(404)
          .send(new ResponseClass(404, "No order found, check your order id"));
      }

      // change the order's fee to the new fee
      order.shippingFee = shippingFee;

      // re-calculate the total
      order.calcTotal();

      await orderRepo.save(order);
      const sanitizedOrderInfo = instanceToPlain(order);
      return res.status(200).send(
        new ResponseClass(200, "Shipping fee updated successfully", {
          order: sanitizedOrderInfo,
        }),
      );
    } catch (error) {
      CLog.bad("updating shipping fee failed", error);
      return res
        .status(400)
        .send(
          new ResponseClass(400, "Updating shipping fee failed", error.message),
        );
    }
  }

  static async deleteOrder(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;
    if (!orderId) {
      return res
        .status(400)
        .send(new ResponseClass(400, "Please include an order Id to delete"));
    }
    const orderRepo = gDB.getRepository(OrderEntity);
    const orderItemRepo = gDB.getRepository(OrderItemEntity);
    try {
      const order = await orderRepo.findOneOrFail({
        where: { id: +orderId },
        relations: ["orderItems"],
      });
      if (!order) {
        return res
          .status(404)
          .send(
            new ResponseClass(404, "no order found, check your order number"),
          );
      }
      for (const orderItem of order.orderItems) {
        await orderItemRepo.remove(orderItem);
      }
      await orderRepo.remove(order);
      return res.status(200).send(
        new ResponseClass(200, "Order deleted successfully", {
          deletedOrder: order,
        }),
      );
    } catch (e) {
      CLog.bad("deleting order failed", e);
      return res
        .status(400)
        .send(new ResponseClass(400, "deleting order failed", e.message));
    }
  }

  // get all orders from ONE user by their user id
  static async getUserAllOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const { userId } = req.params;
    const userRepo = gDB.getRepository(UserEntity);
    if (!userId) {
      return res
        .status(400)
        .send("Please include a user id when searching for orders");
    }

    try {
      const user = await userRepo.findOneOrFail({
        where: { id: +userId },
        relations: ["orders"],
      });
      if (!user) {
        return res
          .status(404)
          .send(
            new ResponseClass(
              404,
              "No user found by this user id, check your user id",
            ),
          );
      }
      // pagination
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 5;

      const startIndex: number = (page - 1) * limit;
      const endIndex: number = page * limit;
      const totalOrders = user.orders.length;
      const totalPages = Math.ceil(totalOrders / limit);
      const prevPage = startIndex > 0 ? page - 1 : "No prev page";
      const nextPage = endIndex < totalOrders ? page + 1 : "No next page";
      const paginatedOrders = user.orders.slice(startIndex, endIndex);

      if (page > totalPages) {
        return res
          .status(404)
          .send(
            new ResponseClass(
              404,
              "The page number you entered is bigger than total page, try again",
              { totalPages },
            ),
          );
      }

      const paginationInfo = {
        totalOrders: totalOrders,
        previousPage: prevPage,
        currentPage: page,
        nextPage: nextPage,
        totalPages: totalPages,
        paginatedOrders,
      };
      return res.status(200).send(
        // new ResponseClass(200, 'Your order info is found', {
        //   orders: user.orders,
        //   paginatedOrders,
        // }),

        new ResponseClass(200, "All orders found", {
          paginationInfo,
          allOrdersWithoutPagination: user.orders,
        }),
      );
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, "loading orders failed", e.message));
    }
  }

  static async getAllOrders(req: Request, res: Response, next: NextFunction) {
    // query, default page = 1 && limit (page size ) = 5
    let { page = 1, limit = 5 } = req.query;

    // transform page and limit to Numbers
    page = +page;
    limit = +limit;

    const orderRepo = gDB.getRepository(OrderEntity);

    //find all orders
    try {
      const allOrders = await orderRepo.find();
      if (!allOrders) {
        return res.status(404).send("No orders in the database");
      }
      const startIndex: number = (page - 1) * limit;
      const endIndex: number = page * limit;
      const totalOrders: number = allOrders.length;
      const totalPage: number = Math.ceil(totalOrders / limit);
      const prevPage: any =
        startIndex > 0 ? page - 1 : "You are on the first page now";
      const nextPage: any =
        endIndex < totalOrders ? page + 1 : "You are on the last page now";
      const paginatedOrders = allOrders.slice(startIndex, endIndex);
      const paginationInfo = {
        totalPage,
        prevPage,
        currentPage: page,
        nextPage,
        limit,
        ordersByPage: paginatedOrders,
      };

      return res.status(200).send(
        new ResponseClass(200, "All orders found successfully,", {
          ordersWithPage: paginationInfo,
          ordersWithoutPage: allOrders,
        }),
      );
    } catch (e) {
      return res
        .status(400)
        .send(new ResponseClass(400, "Get all orders failed", e.message));
    }
  }
}
