import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import jwtConfig from 'src/iam/config/jwt.config';
import { REQUEST_USER_KEY } from 'src/iam/constants/iam.constants';
import { AccessTokenData } from 'src/iam/interfaces/access-token-data.interface';
import { UserData } from 'src/iam/interfaces/user-data.interface';
import { CachingService } from 'src/services/caching/caching.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly cachingService: CachingService,
  ) {}

  /**
   * Return a boolean indicating whether the current request is authorized or not
   *
   * @param context
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let tokenPayload: AccessTokenData;

    // If route is public, authorize request
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) {
      return true;
    }

    // Retrieve access token from cookie, throw if none is found
    const request = context.switchToHttp().getRequest();
    const token = AccessTokenGuard.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // Verify and decode access token
      tokenPayload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
    } catch {
      throw new UnauthorizedException();
    }

    // With payload subject ID, retrieve user data stored in caching system
    const userData: UserData = JSON.parse(
      await this.cachingService.get(`user:${tokenPayload.sub}:userData`),
    );
    if (!userData) {
      throw new UnauthorizedException();
    }

    // Store user data on request 'user' property
    request[REQUEST_USER_KEY] = userData;

    // Authorize request
    return true;
  }

  /**
   * Extract access token from cookie
   *
   * @param request
   */
  private static extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies?.accessToken;
  }
}
