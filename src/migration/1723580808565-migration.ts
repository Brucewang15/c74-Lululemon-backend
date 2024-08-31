import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1723580808565 implements MigrationInterface {
  name = 'Migration1723580808565'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "save_for_later_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer
            )
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_save_for_later_entity" (
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
                CONSTRAINT "FK_28478d67e62eb27f256c19f2633" FOREIGN KEY ("cartId") REFERENCES "shopping_cart_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_save_for_later_entity"(
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
            FROM "save_for_later_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "save_for_later_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_save_for_later_entity"
                RENAME TO "save_for_later_entity"
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "save_for_later_entity"
                RENAME TO "temporary_save_for_later_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "save_for_later_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "colorId" varchar NOT NULL,
                "size" varchar,
                "quantity" integer NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "swatchName" varchar NOT NULL,
                "cartId" integer
            )
        `)
    await queryRunner.query(`
            INSERT INTO "save_for_later_entity"(
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
            FROM "temporary_save_for_later_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_save_for_later_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "save_for_later_entity"
        `)
  }
}
