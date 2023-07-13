import { Logger, Module } from '@nestjs/common';
import { HashingService } from './hashing/hashing.service';
import { BcryptService } from './hashing/bcrypt.service';
import { AuthenticationController } from './authentication/authentication.controller';
import { AuthenticationService } from './authentication/authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/resources/users/user.model';
import { Company } from 'src/domain/resources/companies/company.model';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './authentication/guards/access-token/access-token.guard';
import { RedisService } from 'src/services/caching/redis.service';
import { CachingService } from 'src/services/caching/caching.service';
import cachingConfig from 'src/services/caching/config/caching.config';
import { PermissionsGuard } from './authorization/guards/permissions.guard';

@Module({
  imports: [
    // Register entities (repositories will be made available)
    TypeOrmModule.forFeature([User, Company]),
    // Configure JwtModule
    JwtModule.registerAsync(jwtConfig.asProvider()),
    // Load JWT config
    ConfigModule.forFeature(jwtConfig),
    // Load caching config
    ConfigModule.forFeature(cachingConfig),
  ],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    // Guards will be made available globally (not only in current module)
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    AuthenticationService,
    {
      provide: CachingService,
      useClass: RedisService,
    },
    Logger,
  ],
})
export class IamModule {}
