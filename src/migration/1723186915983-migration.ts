import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1723186915983 implements MigrationInterface {
  name = 'Migration1723186915983'

  public async up(queryRunner: QueryRunner): Promise<void> {
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
                "cartId" integer
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "shopping_cart_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_d9eec5f3c543d48561503aaf3a" UNIQUE ("userId")
            )
        `)
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
        `)
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
        `)
    await queryRunner.query(`
            DROP TABLE "cart_item_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_cart_item_entity"
                RENAME TO "cart_item_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_shopping_cart_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_d9eec5f3c543d48561503aaf3a" UNIQUE ("userId"),
                CONSTRAINT "FK_d9eec5f3c543d48561503aaf3a7" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_shopping_cart_entity"("id", "userId")
            SELECT "id",
                "userId"
            FROM "shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "shopping_cart_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_shopping_cart_entity"
                RENAME TO "shopping_cart_entity"
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "shopping_cart_entity"
                RENAME TO "temporary_shopping_cart_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "shopping_cart_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_d9eec5f3c543d48561503aaf3a" UNIQUE ("userId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "shopping_cart_entity"("id", "userId")
            SELECT "id",
                "userId"
            FROM "temporary_shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_shopping_cart_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "cart_item_entity"
                RENAME TO "temporary_cart_item_entity"
        `)
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
                "cartId" integer
            )
        `)
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
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_cart_item_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "cart_item_entity"
        `)
  }
}
