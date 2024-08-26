import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { ProductEntity } from './Product.entity'
import { UserEntity } from './User.entity'

@Entity()
export class WishlistEntity {
  @PrimaryGeneratedColumn()
  id: number

  // Relation with ProductEntity
  @OneToMany(() => ProductEntity, (product) => product.wishlist, {
    eager: true,
  })
  products: ProductEntity[]

  // Relation with UserEntity
  @OneToOne(() => UserEntity, (user) => user.wishlist)
  @JoinColumn()
  user: UserEntity
}
