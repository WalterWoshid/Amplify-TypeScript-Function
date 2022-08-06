import { StatusCodes } from 'http-status-codes';

const globalAny: any = global;

globalAny.ErrorWithStatusCode = class {
  name: string;
  message: string;
  statusCode?: StatusCodes;

  constructor(message: string, statusCode?: number) {
    const error = new Error(message);

    Object.assign(error, { statusCode });

    return error as ErrorWithStatusCode;
  }
};

declare global {
  let ErrorWithStatusCode: ErrorWithStatusCodeConstructor;

  interface ErrorWithStatusCodeConstructor {
    new(message: string, statusCode?: StatusCodes): ErrorWithStatusCode;
  }

  interface ErrorWithStatusCode extends Error {
    statusCode?: StatusCodes;
  }
}