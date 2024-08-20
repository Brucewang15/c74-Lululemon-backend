import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Min } from "class-validator";

@Entity()
@Unique(["productId"])
export class ProductEntity {
  @Column()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  colorId: string;

  @Column()
  size: string;

  @Column()
  @Min(0)
  quantity: number;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  name: string;

  @Column()
  swatchName: string;
}
