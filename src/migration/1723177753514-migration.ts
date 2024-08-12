import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1723177753514 implements MigrationInterface {
  name = 'Migration1723177753514'

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
            CREATE TABLE "shopping_cart_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar,
                "lastName" varchar,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                "shoppingCartId" integer,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"),
                CONSTRAINT "UQ_ecc361f829f3b661c58c863d82a" UNIQUE ("shoppingCartId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken"
            FROM "user_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "user_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_user_entity"
                RENAME TO "user_entity"
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
            CREATE TABLE "temporary_user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar,
                "lastName" varchar,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                "shoppingCartId" integer,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"),
                CONSTRAINT "UQ_ecc361f829f3b661c58c863d82a" UNIQUE ("shoppingCartId"),
                CONSTRAINT "FK_4e80851de2a5e046a4ac8c0b9a2" FOREIGN KEY ("shoppingCartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken",
                    "shoppingCartId"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken",
                "shoppingCartId"
            FROM "user_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "user_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_user_entity"
                RENAME TO "user_entity"
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "user_entity"
                RENAME TO "temporary_user_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar,
                "lastName" varchar,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                "shoppingCartId" integer,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"),
                CONSTRAINT "UQ_ecc361f829f3b661c58c863d82a" UNIQUE ("shoppingCartId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken",
                    "shoppingCartId"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken",
                "shoppingCartId"
            FROM "temporary_user_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_user_entity"
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
            ALTER TABLE "user_entity"
                RENAME TO "temporary_user_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "user_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar,
                "lastName" varchar,
                "email" varchar NOT NULL,
                "age" integer,
                "gender" varchar,
                "password" varchar NOT NULL,
                "resetToken" varchar,
                CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "user_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "email",
                    "age",
                    "gender",
                    "password",
                    "resetToken"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "email",
                "age",
                "gender",
                "password",
                "resetToken"
            FROM "temporary_user_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_user_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "cart_item_entity"
        `)
  }
}
