import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Length } from "class-validator";
import { UserEntity } from "./User.entity";

@Entity()
export class ShippingAddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Length(1, 100)
  firstName: string;

  @Column({ nullable: false })
  @Length(1, 100)
  lastName: string;

  @Column({ nullable: false })
  //have to be  123-456-7890
  @Length(9, 13)
  phoneNumber: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  province: string;

  @Column({ nullable: true })
  country: string

  @Column({ nullable: false })
  @Length(5, 7)
  // either US zip code, or canada Postal code
  postalCode: string;

  @ManyToOne(() => UserEntity, (user) => user.shippingAddresses)
  user: UserEntity;
}
