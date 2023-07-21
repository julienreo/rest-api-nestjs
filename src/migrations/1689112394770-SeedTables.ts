import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedTables1689112394770 implements MigrationInterface {
  /**
   * Seed tables
   *
   * @param queryRunner
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create companies entities
    const biblioCompany = await queryRunner.manager
      .getRepository('company')
      .save({
        name: 'Biblio',
        address: '2 Quai des Francs-Bourgeois',
        city: 'Mérignac',
        postcode: '33281',
        country: 'France',
      });
    const infinitySportCompany = await queryRunner.manager
      .getRepository('company')
      .save({
        id: 'f80e79b5-809f-4334-beb3-7e4c54ed87ec',
        name: 'Infinity Sport',
        address: '4 Impasse des Grands Augustins',
        postcode: '92012',
        city: 'Boulogne-Billancourt',
        country: 'France',
      });

    // Create permissions entities
    const getUserPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'GET_USER',
      });
    const listUsersPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'LIST_USERS',
      });
    const createUserPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'CREATE_USER',
      });
    const updateUserPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'UPDATE_USER',
      });
    const deleteUserPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'DELETE_USER',
      });
    const getCompanyPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'GET_COMPANY',
      });
    const listCompaniesPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'LIST_COMPANIES',
      });
    const createCompanyPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'CREATE_COMPANY',
      });
    const updateCompanyPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'UPDATE_COMPANY',
      });
    const deleteCompanyPermission = await queryRunner.manager
      .getRepository('permission')
      .save({
        name: 'DELETE_COMPANY',
      });

    // Create roles entities
    const biblioAdminRole = await queryRunner.manager
      .getRepository('role')
      .save({
        name: 'ADMIN',
        company: biblioCompany,
        permissions: [
          getUserPermission,
          listUsersPermission,
          createUserPermission,
          updateUserPermission,
          deleteUserPermission,
          getCompanyPermission,
          listCompaniesPermission,
          updateCompanyPermission,
          createCompanyPermission,
          deleteCompanyPermission,
        ],
      });
    const infinitySportEmployeeRole = await queryRunner.manager
      .getRepository('role')
      .save({
        name: 'EMPLOYEE',
        company: infinitySportCompany,
      });

    // Create users entities
    await queryRunner.manager.getRepository('user').save({
      firstname: 'Charlotte',
      lastname: 'Buisson',
      email: 'charlotte.buisson@biblio.com',
      password: '$2b$10$WVN6lt1weamTzUB69rzMjOO7hZSY2DY3cZF.o3osXtgNyxdj3liSS',
      company: biblioCompany,
      role: biblioAdminRole,
    });
    await queryRunner.manager.getRepository('user').save({
      id: '90371519-694f-42f9-8c52-aca2a7f8ff67',
      firstname: 'Antonin',
      lastname: 'Martin',
      email: 'antonin.martin@infinity-sport.com',
      password: '$2b$10$qJCSxCnnYfrozefsca.Ytepvn3vwCO7xSYVKThrRMcIylTyOBX6Ty',
      company: infinitySportCompany,
      role: infinitySportEmployeeRole,
    });
  }

  /**
   * Truncate tables
   *
   * @param queryRunner
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop first foreign keys constraints in order to be able to truncate tables
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

    // Truncate tables
    await queryRunner.clearTable('role_permissions_permission');
    await queryRunner.clearTable('permission');
    await queryRunner.clearTable('user');
    await queryRunner.clearTable('role');
    await queryRunner.clearTable('company');

    // Recreate foreign keys constraints
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
}
