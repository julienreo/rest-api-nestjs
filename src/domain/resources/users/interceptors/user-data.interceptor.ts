import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/**
 * Remove user password from data to return as setting 'select' to false in User
 * model password column metadata is not enough for POST and PATCH requests.
 */
@Injectable()
export class UserDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((user) => {
        const { password, ...rest } = user;
        return rest;
      }),
    );
  }
}
