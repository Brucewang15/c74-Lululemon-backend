import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1723751745282 implements MigrationInterface {
    name = 'Migration1723751745282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_order_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "taxAmount" decimal(10, 2) NOT NULL,
                "shippingFee" decimal(10, 2) NOT NULL DEFAULT (0),
                "orderStatus" text NOT NULL DEFAULT ('pending'),
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userId" integer,
                "totalBeforeTax" decimal(10, 2) NOT NULL,
                "totalAfterTax" decimal(10, 2) NOT NULL,
                "giftMessage" varchar,
                "giftFrom" varchar,
                "giftTo" varchar,
                "shippingAddressId" integer,
                "isGift" boolean NOT NULL DEFAULT (0),
                CONSTRAINT "FK_73e54f71063005717a0d0cbee70" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping_address_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_c8ab590f1e10afcf1637e71a71e" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_order_entity"(
                    "id",
                    "taxAmount",
                    "shippingFee",
                    "orderStatus",
                    "createdAt",
                    "updatedAt",
                    "userId",
                    "totalBeforeTax",
                    "totalAfterTax",
                    "giftMessage",
                    "giftFrom",
                    "giftTo",
                    "shippingAddressId"
                )
            SELECT "id",
                "taxAmount",
                "shippingFee",
                "orderStatus",
                "createdAt",
                "updatedAt",
                "userId",
                "totalBeforeTax",
                "totalAfterTax",
                "giftMessage",
                "giftFrom",
                "giftTo",
                "shippingAddressId"
            FROM "order_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "order_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_order_entity"
                RENAME TO "order_entity"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "order_entity"
                RENAME TO "temporary_order_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "order_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "taxAmount" decimal(10, 2) NOT NULL,
                "shippingFee" decimal(10, 2) NOT NULL DEFAULT (0),
                "orderStatus" text NOT NULL DEFAULT ('pending'),
                "createdAt" datetime NOT NULL DEFAULT (datetime('now')),
                "updatedAt" datetime NOT NULL DEFAULT (datetime('now')),
                "userId" integer,
                "totalBeforeTax" decimal(10, 2) NOT NULL,
                "totalAfterTax" decimal(10, 2) NOT NULL,
                "giftMessage" varchar,
                "giftFrom" varchar,
                "giftTo" varchar,
                "shippingAddressId" integer,
                CONSTRAINT "FK_73e54f71063005717a0d0cbee70" FOREIGN KEY ("shippingAddressId") REFERENCES "shipping_address_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                CONSTRAINT "FK_c8ab590f1e10afcf1637e71a71e" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "order_entity"(
                    "id",
                    "taxAmount",
                    "shippingFee",
                    "orderStatus",
                    "createdAt",
                    "updatedAt",
                    "userId",
                    "totalBeforeTax",
                    "totalAfterTax",
                    "giftMessage",
                    "giftFrom",
                    "giftTo",
                    "shippingAddressId"
                )
            SELECT "id",
                "taxAmount",
                "shippingFee",
                "orderStatus",
                "createdAt",
                "updatedAt",
                "userId",
                "totalBeforeTax",
                "totalAfterTax",
                "giftMessage",
                "giftFrom",
                "giftTo",
                "shippingAddressId"
            FROM "temporary_order_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_order_entity"
        `);
    }

}
