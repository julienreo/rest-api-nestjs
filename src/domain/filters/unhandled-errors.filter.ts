import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  NotFoundException,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { InvalidCredentialsError } from 'src/iam/errors/invalid-credentials.error';
import { InvalidRefreshTokenError } from 'src/iam/errors/invalid-refresh-token.error';
import { BadRequestError } from '../errors/bad-request.error';
import { ConflictError } from '../errors/conflict.error';
import { NotFoundError } from '../errors/not-found.error';

@Catch(
  NotFoundError,
  ConflictError,
  BadRequestError,
  InvalidRefreshTokenError,
  InvalidCredentialsError,
)
export class UnhandledErrorsFilter<
  T extends NotFoundError | ConflictError | UnauthorizedException,
> implements ExceptionFilter
{
  /**
   * Catch a Business error and throw its corresping HTTP exception
   *
   * @param exception
   * @param host
   */
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { name, message } = exception;

    const errorsHandlers = {
      NotFoundError: () => {
        const httpException = new NotFoundException(message);
        return response
          .status(httpException.getStatus())
          .json(httpException.getResponse());
      },
      ConflictError: () => {
        const httpException = new ConflictException(message);
        return response
          .status(httpException.getStatus())
          .json(httpException.getResponse());
      },
      BadRequestError: () => {
        const httpException = new BadRequestException(message);
        return response
          .status(httpException.getStatus())
          .json(httpException.getResponse());
      },
      InvalidRefreshTokenError: () => {
        const httpException = new UnauthorizedException(message);
        return response
          .status(httpException.getStatus())
          .json(httpException.getResponse());
      },
      InvalidCredentialsError: () => {
        const httpException = new UnauthorizedException(message);
        return response
          .status(httpException.getStatus())
          .json(httpException.getResponse());
      },
    };

    if (errorsHandlers[name]) {
      return errorsHandlers[name]();
    }
  }
}
