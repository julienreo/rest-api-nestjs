import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1689026610082 implements MigrationInterface {
  name = 'CreateTables1689026610082';

  /**
   * Create all needed tables
   *
   * @param queryRunner
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."permission_name_enum" AS ENUM('GET_USER', 'LIST_USERS', 'CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'GET_COMPANY', 'LIST_COMPANIES', 'CREATE_COMPANY', 'UPDATE_COMPANY', 'DELETE_COMPANY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."permission_name_enum" NOT NULL, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_name_enum" AS ENUM('ADMIN', 'EMPLOYEE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "public"."role_name_enum" NOT NULL DEFAULT 'EMPLOYEE', "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "companyId" uuid, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying NOT NULL, "lastname" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "companyId" uuid, "roleId" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "company" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "address" character varying NOT NULL, "postcode" character varying NOT NULL, "city" character varying NOT NULL, "country" character varying NOT NULL, "createdAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP(3) WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions_permission" ("roleId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("roleId", "permissionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("roleId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permissionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_6d29d31feb24503b868472091bc" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_86586021a26d1180b0968f98502" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  /**
   * Drop tables
   *
   * @param queryRunner
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_86586021a26d1180b0968f98502"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_6d29d31feb24503b868472091bc"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`,
    );
    await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
    await queryRunner.query(`DROP TABLE "company"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TYPE "public"."role_name_enum"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(`DROP TYPE "public"."permission_name_enum"`);
  }
}
