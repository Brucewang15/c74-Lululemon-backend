import {Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {OrderEntity} from "./Order.entity";
import {UserEntity} from "./User.entity";

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid'
}

export enum PaymentMethod {
    CREDIT_CARD = 'credit_card',
    PAYPAL = 'paypal',
    STRIPE = 'stripe'
}
@Entity()
export class PaymentEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'text', default: PaymentStatus.PENDING})
    paymentStatus: PaymentStatus

    @Column({type: 'text', nullable: true})
    paymentMethod: PaymentMethod

    @Column({type: 'decimal', precision: 10, scale: 2, nullable: false})
    totalAmount: number

    @OneToOne(() => OrderEntity, OrderEntity => OrderEntity.id)
    orderId: OrderEntity

    @ManyToOne(() => UserEntity, UserEntity => UserEntity.payments)
    userId: UserEntity

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}