import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724097931138 implements MigrationInterface {
  name = "Migration1724097931138";

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
                    "city"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city"
            FROM "shipping_address_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "shipping_address_entity"
        `);
    await queryRunner.query(`
            ALTER TABLE "temporary_shipping_address_entity"
                RENAME TO "shipping_address_entity"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
                    "city"
                )
            SELECT "id",
                "firstName",
                "lastName",
                "phoneNumber",
                "address",
                "province",
                "postalCode",
                "userId",
                "city"
            FROM "temporary_shipping_address_entity"
        `);
    await queryRunner.query(`
            DROP TABLE "temporary_shipping_address_entity"
        `);
  }
}
