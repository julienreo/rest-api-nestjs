import { Company } from 'src/domain/resources/companies/company.model';
import { Permission } from 'src/domain/resources/permissions/permission.model';
import { Role } from 'src/domain/resources/roles/role.model';
import { User } from 'src/domain/resources/users/user.model';
import { CreateTables1689026610082 } from 'src/migrations/1689026610082-CreateTables';
import { SeedTables1689112394770 } from 'src/migrations/1689112394770-SeedTables';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pass',
  database: 'postgres',
  entities: [User, Company, Role, Permission],
  migrations: [CreateTables1689026610082, SeedTables1689112394770],
});
