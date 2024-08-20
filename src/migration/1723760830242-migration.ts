import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1723760830242 implements MigrationInterface {
  name = 'Migration1723760830242'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_order_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                "orderId" integer,
                CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d" FOREIGN KEY ("orderId") REFERENCES "order_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_order_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId",
                    "orderId"
                )
            SELECT "id",
                "productId",
                "colorId",
                "size",
                "quantity",
                "price",
                "image",
                "name",
                "swatchName",
                "cartId",
                "orderId"
            FROM "order_item_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "order_item_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_order_item_entity"
                RENAME TO "order_item_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_order_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "orderId" integer,
                CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d" FOREIGN KEY ("orderId") REFERENCES "order_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_order_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "orderId"
                )
            SELECT "id",
                "productId",
                "colorId",
                "size",
                "quantity",
                "price",
                "image",
                "name",
                "swatchName",
                "orderId"
            FROM "order_item_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "order_item_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_order_item_entity"
                RENAME TO "order_item_entity"
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "order_item_entity"
                RENAME TO "temporary_order_item_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "order_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                "orderId" integer,
                CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d" FOREIGN KEY ("orderId") REFERENCES "order_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "order_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "orderId"
                )
            SELECT "id",
                "productId",
                "colorId",
                "size",
                "quantity",
                "price",
                "image",
                "name",
                "swatchName",
                "orderId"
            FROM "temporary_order_item_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_order_item_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "order_item_entity"
                RENAME TO "temporary_order_item_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "order_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                "orderId" integer,
                CONSTRAINT "FK_cd7ee8cfd1250200aa78d806f8d" FOREIGN KEY ("orderId") REFERENCES "order_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_6b9a4b54eb3904ae028a46a7c08" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "order_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId",
                    "orderId"
                )
            SELECT "id",
                "productId",
                "colorId",
                "size",
                "quantity",
                "price",
                "image",
                "name",
                "swatchName",
                "cartId",
                "orderId"
            FROM "temporary_order_item_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_order_item_entity"
        `)
  }
}
