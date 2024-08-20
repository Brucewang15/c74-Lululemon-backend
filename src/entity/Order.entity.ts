import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CartItemEntity } from "./CartItem.entity";
import { UserEntity } from "./User.entity";
import { ShippingAddressEntity } from "./ShippingAddress.entity";
import { OrderStatus, ShippingType } from "../helper/Enum";
import { OrderItemEntity } from "./OrderItem.entity";

@Entity()
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("decimal", { precision: 10, scale: 2 })
  taxAmount: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalBeforeTax: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAfterTax: number;

  @Column("decimal", {
    precision: 10,
    scale: 2,
    default: ShippingType.STANDARD,
  })
  shippingFee: number;

  @Column({ type: "text", default: OrderStatus.PENDING })
  orderStatus: OrderStatus; // pending, paid, shipped, delivered, cancelled, etc..

  @Column({ type: "boolean", default: false })
  isGift: boolean;

  @Column({ nullable: true })
  giftMessage: string;

  @Column({ nullable: true })
  giftFrom: string;

  @Column({ nullable: true })
  giftTo: string;

  @OneToMany(() => OrderItemEntity, (item) => item.order, { eager: true })
  orderItems: OrderItemEntity[];

  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  @ManyToOne(() => ShippingAddressEntity)
  @JoinColumn()
  shippingAddress: ShippingAddressEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  calcTotal() {
    const validShippingFee =
      typeof this.shippingFee === "number" && !isNaN(this.shippingFee)
        ? this.shippingFee
        : 0;

    if (
      typeof this.totalBeforeTax === "number" &&
      !isNaN(this.totalBeforeTax) &&
      typeof this.taxAmount === "number" &&
      !isNaN(this.taxAmount)
    ) {
      this.totalAfterTax =
        this.totalBeforeTax + this.taxAmount + validShippingFee;
    } else {
      throw new Error("Invalid value for total calculation");
    }
  }
}
