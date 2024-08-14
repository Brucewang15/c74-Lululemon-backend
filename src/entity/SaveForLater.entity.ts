import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm'
import { ShoppingCartEntity } from './ShoppingCart.entity'
import { Exclude } from 'class-transformer'

@Entity()
export class SaveForLaterEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: string

  @Column()
  colorId: string

  @Column({ nullable: true })
  size: string | null

  @Column()
  quantity: number

  @Column()
  price: number

  @Column()
  image: string

  @Column()
  name: string

  @Column()
  swatchName: string

  @ManyToOne(() => ShoppingCartEntity, (cart) => cart.savedItems, {
    cascade: true,
  })
  @Exclude()
  cart: ShoppingCartEntity
}
