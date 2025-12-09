import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ExternalApiNotFoundError,
  ExternalApiRequestFailedError,
} from 'src/common/external-api.errors';
import { ApiNotFoundError } from '../api.errors';

@Catch(ExternalApiNotFoundError, ExternalApiRequestFailedError)
export class ExternalApiExceptionFilter implements ExceptionFilter {
  catch(excepetion: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const pokemonId = request.params.id;
    const response = ctx.getResponse();

    if (excepetion instanceof ExternalApiNotFoundError) {
      // Build response body
      const notFoundError = new NotFoundException(
        `Pokémon with id ${pokemonId} not found. Reason: ${excepetion.message}`,
      );
      const status = notFoundError.getStatus();
      const body = notFoundError.getResponse();
      return response.status(status).json(body);
    }

    if (excepetion instanceof ExternalApiRequestFailedError) {
      // Build response body
      const internalServerError = new InternalServerErrorException(
        `Failed to fetch Pokémon with id ${pokemonId}. Reason: ${excepetion.message}`,
      );

      const status = internalServerError.getStatus();
      const body = internalServerError.getResponse();
      return response.status(status).json(body);
    }

    if (excepetion instanceof ApiNotFoundError) {
      const notFoundError = new NotFoundException(
        `Pokémon with id ${pokemonId} not found.`,
      );
      const status = notFoundError.getStatus();
      const body = notFoundError.getResponse();
      return response.status(status).json(body);
    }

    // Fallback
    const genericError = new InternalServerErrorException();
    const status = genericError.getStatus();
    const body = genericError.getResponse();

    return response.status(status).json(body);
  }
}

@Catch(ApiNotFoundError)
export class ApiExceptionFilter implements ExceptionFilter {
  catch(excepetion: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const pokemonId = request.params.id;
    const response = ctx.getResponse();

    if (excepetion instanceof ApiNotFoundError) {
      const notFoundError = new NotFoundException(
        `Pokémon with id ${pokemonId} not found.`,
      );
      const status = notFoundError.getStatus();
      const body = notFoundError.getResponse();
      return response.status(status).json(body);
    }

    // Fallback
    const genericError = new InternalServerErrorException();
    const status = genericError.getStatus();
    const body = genericError.getResponse();

    return response.status(status).json(body);
  }
}
