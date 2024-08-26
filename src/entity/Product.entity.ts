import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { WishlistEntity } from './Wishlist.entity';

@Entity()
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  name: string;

  @Column()
  price: string;

  @Column()
  image: string;

  @ManyToMany(() => WishlistEntity, (wishlist) => wishlist.products)
  wishlists: WishlistEntity[];
}
