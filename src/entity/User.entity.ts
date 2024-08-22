import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm'
import { IsEmail, IsOptional, Length, Matches, Max, Min } from 'class-validator'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Address } from 'node:cluster'
import { ShippingAddressEntity } from './ShippingAddress.entity'
import { ShoppingCartEntity } from './ShoppingCart.entity'
import { CartItemEntity } from './CartItem.entity'
import { OrderEntity } from './Order.entity'
import { PaymentEntity } from './Payment.entity' // For generating secure tokens

@Entity()
export class UserEntity {
  // Columns :
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true })
  @Length(0, 300)
  firstName: string

  @Column({ nullable: true })
  @Length(0, 300)
  lastName: string

  @Column({ nullable: false, unique: true })
  @IsEmail({}, { groups: ['signUp'] })
  @Length(5, 500, { groups: ['signUp'] })
  email: string

  @Column({ nullable: true })
  @IsOptional()
  @Min(1)
  @Max(150)
  age: number

  @Column({ nullable: true })
  gender: string

  @Column()
  @Length(8, 100, { groups: ['signUp'] })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number',
    groups: ['signUp'],
  })
  password: string

  @Column({ nullable: true })
  resetToken: string

  // Methods:
  hashPassword() {
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
  }

  validatePlainPassword(plainText: string): boolean {
    // 这里会return true 和 false
    return bcrypt.compare(plainText, this.password)
  }

  generateResetToken() {
    this.resetToken = randomBytes(20).toString('hex')
  }

  changePassword(plainText: string) {
    this.password = plainText
  }

  checking(plainText: string): boolean {
    return bcrypt.compareSync(plainText, this.password)
  }

  // Relations :

  @OneToMany(
    () => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.user,
    { cascade: true },
  )
  shippingAddresses: ShippingAddressEntity[]

  @OneToOne(() => ShoppingCartEntity, (shoppingCart) => shoppingCart.user, {
    cascade: true,
  })
  @JoinColumn()
  shoppingCart: ShoppingCartEntity

  @OneToMany(() => OrderEntity, (order) => order.user)
  orders: OrderEntity[]

  @OneToMany(() => PaymentEntity, (PaymentEntity) => PaymentEntity.id)
  payments: PaymentEntity[]
}
