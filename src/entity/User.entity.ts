import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { IsEmail, Length, Matches, Max, Min } from 'class-validator'
import * as bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'
import { Address } from 'node:cluster'
import { ShippingAddressEntity } from './ShippingAddress.entity' // For generating secure tokens

@Entity()
export class UserEntity {
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
  @Min(1)
  @Max(150)
  age: number

  @Column({ nullable: true })
  gender: string

  @OneToMany(
    () => ShippingAddressEntity,
    (shippingAddress) => shippingAddress.user,
    { cascade: true },
  )
  shippingAddresses: Address[]

  @Column()
  @Length(8, 100, { groups: ['signUp'] })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/, {
    message:
      'Password must contain at least 8 characters, including 1 uppercase letter, 1 lowercase letter, and 1 number',
    groups: ['signUp'],
  })
  password: string

  hashPassword() {
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
  }

  validatePlainPassword(plainText: string): boolean {
    // 这里会return true 和 false
    return bcrypt.compare(plainText, this.password)
  }

  @Column({ nullable: true })
  resetToken: string

  generateResetToken() {
    this.resetToken = randomBytes(20).toString('hex')
  }

  changePassword(plainText: string) {
    this.password = plainText
  }

  checking(plainText: string): boolean {
    return bcrypt.compareSync(plainText, this.password)
  }
}
