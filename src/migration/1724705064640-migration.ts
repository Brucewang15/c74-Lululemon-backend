import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1724705064640 implements MigrationInterface {
    name = 'Migration1724705064640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "temporary_product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "wishlistId" integer,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_product_entity"(
                    "id",
                    "productId",
                    "price",
                    "image",
                    "name",
                    "wishlistId"
                )
            SELECT "id",
                "productId",
                "price",
                "image",
                "name",
                "wishlistId"
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
            CREATE TABLE "temporary_wishlist_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_bcb4db6bdd00a479b081f05528" UNIQUE ("userId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_wishlist_entity"("id", "userId")
            SELECT "id",
                "userId"
            FROM "wishlist_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "wishlist_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_wishlist_entity"
                RENAME TO "wishlist_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "wishlist_entity_products_product_entity" (
                "wishlistEntityId" integer NOT NULL,
                "productEntityId" integer NOT NULL,
                PRIMARY KEY ("wishlistEntityId", "productEntityId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b341a803c25bfb08a040edc5da" ON "wishlist_entity_products_product_entity" ("wishlistEntityId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_463e3b573a374a8fc0f7fe842b" ON "wishlist_entity_products_product_entity" ("productEntityId")
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" integer NOT NULL,
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
            CREATE TABLE "temporary_wishlist_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_wishlist_entity"("id")
            SELECT "id"
            FROM "wishlist_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "wishlist_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_wishlist_entity"
                RENAME TO "wishlist_entity"
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
        await queryRunner.query(`
            DROP INDEX "IDX_b341a803c25bfb08a040edc5da"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_463e3b573a374a8fc0f7fe842b"
        `);
        await queryRunner.query(`
            CREATE TABLE "temporary_wishlist_entity_products_product_entity" (
                "wishlistEntityId" integer NOT NULL,
                "productEntityId" integer NOT NULL,
                CONSTRAINT "FK_b341a803c25bfb08a040edc5da6" FOREIGN KEY ("wishlistEntityId") REFERENCES "wishlist_entity" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
                CONSTRAINT "FK_463e3b573a374a8fc0f7fe842b3" FOREIGN KEY ("productEntityId") REFERENCES "product_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
                PRIMARY KEY ("wishlistEntityId", "productEntityId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "temporary_wishlist_entity_products_product_entity"("wishlistEntityId", "productEntityId")
            SELECT "wishlistEntityId",
                "productEntityId"
            FROM "wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "temporary_wishlist_entity_products_product_entity"
                RENAME TO "wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b341a803c25bfb08a040edc5da" ON "wishlist_entity_products_product_entity" ("wishlistEntityId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_463e3b573a374a8fc0f7fe842b" ON "wishlist_entity_products_product_entity" ("productEntityId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "IDX_463e3b573a374a8fc0f7fe842b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b341a803c25bfb08a040edc5da"
        `);
        await queryRunner.query(`
            ALTER TABLE "wishlist_entity_products_product_entity"
                RENAME TO "temporary_wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "wishlist_entity_products_product_entity" (
                "wishlistEntityId" integer NOT NULL,
                "productEntityId" integer NOT NULL,
                PRIMARY KEY ("wishlistEntityId", "productEntityId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "wishlist_entity_products_product_entity"("wishlistEntityId", "productEntityId")
            SELECT "wishlistEntityId",
                "productEntityId"
            FROM "temporary_wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_463e3b573a374a8fc0f7fe842b" ON "wishlist_entity_products_product_entity" ("productEntityId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_b341a803c25bfb08a040edc5da" ON "wishlist_entity_products_product_entity" ("wishlistEntityId")
        `);
        await queryRunner.query(`
            ALTER TABLE "product_entity"
                RENAME TO "temporary_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" integer NOT NULL,
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
            ALTER TABLE "wishlist_entity"
                RENAME TO "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "wishlist_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_bcb4db6bdd00a479b081f05528" UNIQUE ("userId")
            )
        `);
        await queryRunner.query(`
            INSERT INTO "wishlist_entity"("id")
            SELECT "id"
            FROM "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "product_entity"
                RENAME TO "temporary_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "wishlistId" integer,
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
            DROP INDEX "IDX_463e3b573a374a8fc0f7fe842b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_b341a803c25bfb08a040edc5da"
        `);
        await queryRunner.query(`
            DROP TABLE "wishlist_entity_products_product_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "wishlist_entity"
                RENAME TO "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "wishlist_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "REL_bcb4db6bdd00a479b081f05528" UNIQUE ("userId"),
                CONSTRAINT "FK_bcb4db6bdd00a479b081f05528b" FOREIGN KEY ("userId") REFERENCES "user_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "wishlist_entity"("id", "userId")
            SELECT "id",
                "userId"
            FROM "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_wishlist_entity"
        `);
        await queryRunner.query(`
            ALTER TABLE "product_entity"
                RENAME TO "temporary_product_entity"
        `);
        await queryRunner.query(`
            CREATE TABLE "product_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "productId" varchar NOT NULL,
                "price" integer NOT NULL,
                "image" varchar NOT NULL,
                "name" varchar NOT NULL,
                "wishlistId" integer,
                CONSTRAINT "UQ_be9530eb583cbbfd320561c723a" UNIQUE ("productId"),
                CONSTRAINT "FK_e2bcc1470502de4c039ee23aedd" FOREIGN KEY ("wishlistId") REFERENCES "wishlist_entity" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);
        await queryRunner.query(`
            INSERT INTO "product_entity"(
                    "id",
                    "productId",
                    "price",
                    "image",
                    "name",
                    "wishlistId"
                )
            SELECT "id",
                "productId",
                "price",
                "image",
                "name",
                "wishlistId"
            FROM "temporary_product_entity"
        `);
        await queryRunner.query(`
            DROP TABLE "temporary_product_entity"
        `);
    }

}
