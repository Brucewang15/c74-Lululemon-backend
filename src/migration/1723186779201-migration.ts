import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1723186779201 implements MigrationInterface {
  name = 'Migration1723186779201'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "temporary_shopping_cart_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_19878349b0eb5ed6232438eef8f" UNIQUE ("userId")
            )
        `)
    await queryRunner.query(`
            INSERT INTO "temporary_shopping_cart_entity"("id")
            SELECT "id"
            FROM "shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "shopping_cart_entity"
        `)
    await queryRunner.query(`
            ALTER TABLE "temporary_shopping_cart_entity"
                RENAME TO "shopping_cart_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "temporary_shopping_cart_entity" (
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "userId" integer,
                CONSTRAINT "UQ_19878349b0eb5ed6232438eef8f" UNIQUE ("userId"),
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
                CONSTRAINT "UQ_19878349b0eb5ed6232438eef8f" UNIQUE ("userId")
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
            ALTER TABLE "shopping_cart_entity"
                RENAME TO "temporary_shopping_cart_entity"
        `)
    await queryRunner.query(`
            CREATE TABLE "shopping_cart_entity" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)
        `)
    await queryRunner.query(`
            INSERT INTO "shopping_cart_entity"("id")
            SELECT "id"
            FROM "temporary_shopping_cart_entity"
        `)
    await queryRunner.query(`
            DROP TABLE "temporary_shopping_cart_entity"
        `)
  }
}
