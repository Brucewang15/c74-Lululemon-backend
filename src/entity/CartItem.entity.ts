import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ShoppingCartEntity } from "./ShoppingCart.entity";
import { Exclude } from "class-transformer";
import { OrderEntity } from "./Order.entity";

@Entity()
export class CartItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  colorId: string;

  @Column({ nullable: true })
  size: string | null;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  swatchName: string;

  @ManyToOne(() => ShoppingCartEntity, (cart) => cart.cartItems, {
    cascade: true,
  })
  @Exclude()
  cart: ShoppingCartEntity;
}
