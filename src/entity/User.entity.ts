import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { IsEmail, Length, Max, Min } from 'class-validator'
import * as bcrypt from 'bcrypt'

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(1, 300)
  firstName: string

  @Column()
  @Length(1, 300)
  lastName: string

  @Column({ nullable: false, unique: true })
  @IsEmail()
  @Length(5, 500)
  email: string

  @Column({ nullable: false })
  @Min(1)
  @Max(150)
  age: number

  @Column({ nullable: true })
  gender: string

  @Column()
  @Length(6, 100)
  password: string

  hashPassword() {
    const salt = 10
    this.password = bcrypt.hashSync(this.password, salt)
  }

  validatePlainPassword(plainText: string): boolean {
    // 这里会return true 和 false
    return bcrypt.compare(plainText, this.password)
  }
}
