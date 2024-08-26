import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CartItemEntity } from "./CartItem.entity";
import { UserEntity } from "./User.entity";
import { SaveForLaterEntity } from "./SaveForLater.entity";

@Entity()
export class ShoppingCartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Relations :
  @OneToMany(() => CartItemEntity, (cartItem) => cartItem.cart, {
    eager: true,
  })
  cartItems: CartItemEntity[];

  @OneToMany(() => SaveForLaterEntity, (savedItem) => savedItem.cart, {
    eager: true,
  })
  savedItems: SaveForLaterEntity[];

  @OneToOne(() => UserEntity, (user) => user.shoppingCart)
  @JoinColumn()
  user: UserEntity;
}
