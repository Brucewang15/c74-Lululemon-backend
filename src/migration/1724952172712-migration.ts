import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724952172712 implements MigrationInterface {
    name = 'Migration1724952172712'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" varchar NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_product_entity"("id", "productId", "price", "image", "name")
            SELECT "id",
                "productId",
                "price",
                "image",
                "name"
            FROM "product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "product_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_product_entity"
                RENAME TO "product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_payment_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "paymentStatus" text NOT NULL DEFAULT ('pending'),
                "paymentMethod" text,
                "totalAmount" decimal(10, 2) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userIdId" integer,
                "apiSecret" text,
                CONSTRAINT "FK_711a840f91198d761aa6b253cf0" FOREIGN KEY ("userIdId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_payment_entity"(
                    "id",
                    "paymentStatus",
                    "paymentMethod",
                    "totalAmount",
                    "createdAt",
                    "updatedAt",
                    "userIdId"
                )
            SELECT "id",
                "paymentStatus",
                "paymentMethod",
                "totalAmount",
                "createdAt",
                "updatedAt",
                "userIdId"
            FROM "payment_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_payment_entity"
                RENAME TO "payment_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" varchar NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_product_entity"("id", "productId", "price", "image", "name")
            SELECT "id",
                "productId",
                "price",
                "image",
                "name"
            FROM "product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "product_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_product_entity"
                RENAME TO "product_entity"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "product_entity"
                RENAME TO "temporary_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" varchar NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "product_entity"("id", "productId", "price", "image", "name")
            SELECT "id",
                "productId",
                "price",
                "image",
                "name"
            FROM "temporary_product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_product_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "payment_entity"
                RENAME TO "temporary_payment_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "paymentStatus" text NOT NULL DEFAULT ('pending'),
                "paymentMethod" text,
                "totalAmount" decimal(10, 2) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userIdId" integer,
                CONSTRAINT "FK_711a840f91198d761aa6b253cf0" FOREIGN KEY ("userIdId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "payment_entity"(
                    "id",
                    "paymentStatus",
                    "paymentMethod",
                    "totalAmount",
                    "createdAt",
                    "updatedAt",
                    "userIdId"
                )
            SELECT "id",
                "paymentStatus",
                "paymentMethod",
                "totalAmount",
                "createdAt",
                "updatedAt",
                "userIdId"
            FROM "temporary_payment_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_payment_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "product_entity"
                RENAME TO "temporary_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" varchar NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "product_entity"("id", "productId", "price", "image", "name")
            SELECT "id",
                "productId",
                "price",
                "image",
                "name"
            FROM "temporary_product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_product_entity"
        `);
    }

}
