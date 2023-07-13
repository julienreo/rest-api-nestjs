import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from 'src/common/decorators/public.decorator';
import { InvalidRefreshTokenError } from '../errors/invalid-refresh-token.error';
import { setCookie } from './authentication.helpers';
import { AuthenticationService } from './authentication.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  // Declare route as public
  @Public()
  @ApiOperation({ summary: 'Sign a user up' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully signed up.',
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  // Return HTTP 200 response status code and not 201 as it is by default
  @HttpCode(HttpStatus.OK)
  @Public()
  @ApiOperation({ summary: 'Sign a user in' })
  @ApiResponse({
    status: 200,
    description: 'User has been successfully signed in.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('sign-in')
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() signInDto: SignInDto,
  ) {
    // Generate access and refresh tokens
    const tokens = await this.authService.signIn(signInDto);
    // Use HttpOnly cookies to store them in user's browser
    setCookie(response, 'accessToken', tokens.accessToken);
    setCookie(response, 'refreshToken', tokens.refreshToken);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh user tokens' })
  @ApiResponse({
    status: 200,
    description:
      'Access token and refresh token have been successfully renewed.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @Post('refresh-tokens')
  async refreshTokens(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Retrieve refresh token from cookies
    const refreshToken: string | undefined = request.cookies?.refreshToken;
    if (!refreshToken) {
      throw new InvalidRefreshTokenError();
    }
    // Generate access and refresh tokens
    const tokens = await this.authService.refreshTokens(refreshToken);
    // Use HttpOnly cookies to store them in user's browser
    setCookie(response, 'accessToken', tokens.accessToken);
    setCookie(response, 'refreshToken', tokens.refreshToken);
  }
}
