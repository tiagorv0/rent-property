import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(entity: string, id: string | number) {
    super(
      {
        status: HttpStatus.NOT_FOUND,
        error: `The requested ${entity} with ID ${id} was not found`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class EntityAlreadyExistsException extends HttpException {
  constructor(entity: string, field: string, value: string) {
    super(
      {
        status: HttpStatus.CONFLICT,
        error: `${entity} with ${field} '${value}' already exists`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: 'Invalid credentials',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class InsufficientPermissionsException extends HttpException {
  constructor() {
    super(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Insufficient permissions to perform this action',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
