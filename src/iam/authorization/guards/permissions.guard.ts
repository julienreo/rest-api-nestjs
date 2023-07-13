import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Permission } from 'src/domain/resources/permissions/enums/permission.enum';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constants';
import { UserData } from 'src/iam/interfaces/user-data.interface';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Return a boolean indicating whether the current request is authorized or not
   *
   * @param context
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve from route handler the authorized permissions
    const contextPermissions = this.reflector.getAllAndOverride<Permission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    // If no permissions are needed, authorize request
    if (!contextPermissions) {
      return true;
    }

    // Check if user permissions match with the needed permissions
    const user: UserData = context.switchToHttp().getRequest()[
      REQUEST_USER_KEY
    ];
    return contextPermissions.every((permission) =>
      user.permissions?.includes(permission),
    );
  }
}
