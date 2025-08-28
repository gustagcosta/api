export enum ErrorTypes {
  ExpectedError = 400,
  NotAllowedError = 401,
  NotFoundError = 404,
  ConflictError = 409,
  UnprocessableEntityError = 422
}

export class ApplicationError extends Error {
  code: number;
  extras?: any;

  constructor(message: string, type: ErrorTypes, extras?: any) {
    super(message);
    this.code = type;
    this.name = ErrorTypes[type];
    this.extras = extras;
  }
}