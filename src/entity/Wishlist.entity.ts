import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn } from 'typeorm';
import { ProductEntity } from './Product.entity';
import { UserEntity } from './User.entity';

@Entity()
export class WishlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => ProductEntity, (product) => product.wishlists, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  products: ProductEntity[];

  @OneToOne(() => UserEntity, (user) => user.wishlist)
  user: UserEntity;
}
