import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724182267501 implements MigrationInterface {
    name = 'Migration1724182267501'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_shipping_address_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "phoneNumber" varchar NOT NULL,
                "address" varchar NOT NULL,
                "province" varchar NOT NULL,
                "postalCode" varchar NOT NULL,
                "userId" integer,
                "city" varchar NOT NULL,
                "country" varchar NOT NULL,
                CONSTRAINT "FK_c220b8a1a2f4ec8fa25cc0cfa36" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_shipping_address_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "address",
                    "province",
                    "postalCode",
                    "userId",
                    "city",
                    "country"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city",
                "country"
            FROM "shipping_address_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "shipping_address_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_shipping_address_entity"
                RENAME TO "shipping_address_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "payment_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "paymentStatus" text NOT NULL DEFAULT ('pending'),
                "paymentMethod" text,
                "totalAmount" decimal(10, 2) NOT NULL,
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userIdId" integer
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_shipping_address_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "phoneNumber" varchar NOT NULL,
                "address" varchar NOT NULL,
                "province" varchar NOT NULL,
                "postalCode" varchar NOT NULL,
                "userId" integer,
                "city" varchar NOT NULL,
                "country" varchar,
                CONSTRAINT "FK_c220b8a1a2f4ec8fa25cc0cfa36" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_shipping_address_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "address",
                    "province",
                    "postalCode",
                    "userId",
                    "city",
                    "country"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city",
                "country"
            FROM "shipping_address_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "shipping_address_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_shipping_address_entity"
                RENAME TO "shipping_address_entity"
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
                "userIdId" integer
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
            ALTER TABLE "shipping_address_entity"
                RENAME TO "temporary_shipping_address_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "shipping_address_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "phoneNumber" varchar NOT NULL,
                "address" varchar NOT NULL,
                "province" varchar NOT NULL,
                "postalCode" varchar NOT NULL,
                "userId" integer,
                "city" varchar NOT NULL,
                "country" varchar NOT NULL,
                CONSTRAINT "FK_c220b8a1a2f4ec8fa25cc0cfa36" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "shipping_address_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "address",
                    "province",
                    "postalCode",
                    "userId",
                    "city",
                    "country"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city",
                "country"
            FROM "temporary_shipping_address_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_shipping_address_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "payment_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "shipping_address_entity"
                RENAME TO "temporary_shipping_address_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "shipping_address_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "firstName" varchar NOT NULL,
                "lastName" varchar NOT NULL,
                "phoneNumber" varchar NOT NULL,
                "address" varchar NOT NULL,
                "province" varchar NOT NULL,
                "postalCode" varchar NOT NULL,
                "userId" integer,
                "city" varchar NOT NULL,
                "country" varchar NOT NULL,
                CONSTRAINT "FK_c220b8a1a2f4ec8fa25cc0cfa36" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "shipping_address_entity"(
                    "id",
                    "firstName",
                    "lastName",
                    "phoneNumber",
                    "address",
                    "province",
                    "postalCode",
                    "userId",
                    "city",
                    "country"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city",
                "country"
            FROM "temporary_shipping_address_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_shipping_address_entity"
        `);
    }

}
