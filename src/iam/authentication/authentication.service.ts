import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { DB_ERROR_CODES } from 'src/constants/app.constants';
import { User } from 'src/domain/resources/users/user.model';
import { Repository } from 'typeorm';
import jwtConfig from '../config/jwt.config';
import { HashingService } from '../hashing/hashing.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { randomUUID } from 'crypto';
import { CachingService } from 'src/services/caching/caching.service';
import { ConflictError } from 'src/domain/errors/conflict.error';
import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token.error';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';
import { RefreshTokenData } from '../interfaces/refresh-token-data.interface';
import { UserData } from '../interfaces/user-data.interface';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly cachingService: CachingService,
    private readonly logger: Logger,
  ) {}

  /**
   * Sign user up
   *
   * @param signUpDto
   */
  async signUp(signUpDto: SignUpDto) {
    try {
      const user = {
        ...signUpDto,
        password: await this.hashingService.hash(signUpDto.password),
      };
      await this.userRepository.save(user);
    } catch (err) {
      // If email already exists, PostgreSQL will raise a 23505 error
      if (err.code === DB_ERROR_CODES.UNIQUE_VIOLATION_CODE) {
        throw new ConflictError('User already exists');
      }
      throw err;
    }
  }

  /**
   * Sign user in
   *
   * @param signInDto
   */
  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    // Check that user exists
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
      // Password needs to be set explicitly as we do not return it by default for security reasons
      select: ['id', 'email', 'password'],
      relations: { role: { permissions: true } },
    });
    if (!user) {
      throw new InvalidCredentialsError('Invalid email');
    }

    // Validate user password
    const isValid = await this.hashingService.compare(password, user.password);
    if (!isValid) {
      throw new InvalidCredentialsError('Invalid password');
    }

    // Generate access and refresh tokens
    return {
      accessToken: await this.generateAccessToken(user),
      refreshToken: await this.generateRefreshToken(user),
    };
  }

  /**
   * Generate access tokens
   *
   * @param user
   */
  private async generateAccessToken(user: User) {
    // Generate access token and include user email in its payload
    const accessToken = await this.signToken<Partial<UserData>>(
      user.id,
      this.jwtConfiguration.accessTokenTtl,
      { email: user.email },
    );

    // Store user data in caching system with a TTL that equals access token TTL
    const userData: UserData = {
      id: user.id,
      email: user.email,
      role: user.role?.name,
      permissions: user.role?.permissions?.map(({ name }) => name),
    };
    await this.cachingService.set(
      `user:${user.id}:userData`,
      JSON.stringify(userData),
      this.jwtConfiguration.accessTokenTtl,
    );

    return accessToken;
  }

  /**
   * Generate refresh tokens
   *
   * @param user
   */
  private async generateRefreshToken(user: User) {
    const refreshTokenId = randomUUID();

    // Generate refresh token and include its ID within the payload
    const refreshToken = await this.signToken<Partial<RefreshTokenData>>(
      user.id,
      this.jwtConfiguration.refreshTokenTtl,
      { refreshTokenId },
    );
    // Store refresh token ID in caching system with a TTL that equals refresh token TTL
    await this.cachingService.set(
      `user:${user.id}:refreshTokenId`,
      refreshTokenId,
      this.jwtConfiguration.refreshTokenTtl,
    );

    return refreshToken;
  }

  /**
   * Sign a token
   *
   * @param userId
   * @param expiresIn
   * @param payload
   */
  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  /**
   * Generate new access and refresh tokens
   *
   * @param refreshToken
   */
  async refreshTokens(refreshToken: string) {
    try {
      // Validate and decode refresh token
      const { sub, refreshTokenId }: RefreshTokenData =
        await this.jwtService.verifyAsync<RefreshTokenData>(
          refreshToken,
          this.jwtConfiguration,
        );
      if (!sub || !refreshTokenId) {
        throw new InvalidRefreshTokenError();
      }

      // Retrieve corresponding user
      const user = await this.userRepository.findOne({
        where: { id: sub },
        relations: { role: { permissions: true } },
      });
      if (!user) {
        throw new InvalidRefreshTokenError();
      }

      // Check that refresh token matches the one stored in caching system
      const isRefreshTokenValid = await this.validateRefreshToken(
        `user:${user.id}:refreshTokenId`,
        refreshTokenId,
      );
      // If so, delete it from cache as it must only serve once
      if (isRefreshTokenValid) {
        await this.cachingService.delete(`user:${user.id}:refreshTokenId`);
      } else {
        throw new InvalidRefreshTokenError();
      }

      // Generate and return new access and refresh tokens
      return {
        accessToken: await this.generateAccessToken(user),
        refreshToken: await this.generateRefreshToken(user),
      };
    } catch (err) {
      this.logger.error(err);
      throw new InvalidRefreshTokenError();
    }
  }

  /**
   * Validate refresh token
   *
   * @param key
   * @param value
   */
  private async validateRefreshToken(
    key: string,
    value: string,
  ): Promise<boolean> {
    // Retrieve refresh token from caching system
    const refreshTokenId = await this.cachingService.get(key);
    if (!refreshTokenId) {
      throw new InvalidRefreshTokenError();
    }
    // Check that it matches the one supplied
    return refreshTokenId === value;
  }
}
