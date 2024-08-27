import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723329756054 implements MigrationInterface {
  name = "Migration1723329756054";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_cart_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar NOT NULL,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                CONSTRAINT "FK_eabcbd5dff337a605c509c85abf" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_cart_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId"
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
                "cartId"
            FROM "cart_item_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "cart_item_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_cart_item_entity"
                RENAME TO "cart_item_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "temporary_cart_item_entity" (
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
                CONSTRAINT "FK_eabcbd5dff337a605c509c85abf" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "temporary_cart_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId"
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
                "cartId"
            FROM "cart_item_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "cart_item_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_cart_item_entity"
                RENAME TO "cart_item_entity"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "cart_item_entity"
                RENAME TO "temporary_cart_item_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "cart_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar NOT NULL,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                CONSTRAINT "FK_eabcbd5dff337a605c509c85abf" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "cart_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId"
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
                "cartId"
            FROM "temporary_cart_item_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_cart_item_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "cart_item_entity"
                RENAME TO "temporary_cart_item_entity"
        `);
    await queryRunner.query(`
            CREATE TABLE "cart_item_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar NOT NULL,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer,
                CONSTRAINT "FK_eabcbd5dff337a605c509c85abf" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
    await queryRunner.query(`
            INSERT INTO "cart_item_entity"(
                    "id",
                    "productId",
                    "colorId",
                    "size",
                    "quantity",
                    "price",
                    "image",
                    "name",
                    "swatchName",
                    "cartId"
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
                "cartId"
            FROM "temporary_cart_item_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_cart_item_entity"
        `);
  }
}
