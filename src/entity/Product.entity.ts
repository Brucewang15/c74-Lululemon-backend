import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { WishlistEntity } from "./Wishlist.entity";

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  image: string;

  // Relation with WishlistEntity
  @ManyToOne(() => WishlistEntity, (wishlist) => wishlist.products, {
    cascade: true,
  })
  wishlist: WishlistEntity;
}
