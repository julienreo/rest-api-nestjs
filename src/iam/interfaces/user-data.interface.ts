import { Permission } from 'src/domain/resources/permissions/enums/permission.enum';
import { Role } from 'src/domain/resources/roles/enums/role.enum';

export interface UserData {
  // User ID
  id: string;

  // User email
  email: string;

  // User role
  role: Role;

  // User permissions
  permissions: Permission[];
}
