globalThis.ErrorWithStatusCode = class {
    name: string;
    message: string;
    statusCode?: number;
  
    constructor(message: string, statusCode?: number) {
      const error = new Error(message);
  
      Object.assign(error, { statusCode });
  
      return error as ErrorWithStatusCode;
    }
  };
  
  declare var ErrorWithStatusCode: ErrorWithStatusCodeConstructor;
  
  interface ErrorWithStatusCodeConstructor {
    new(message: string, statusCode?: number): ErrorWithStatusCode;
  }
  
  interface ErrorWithStatusCode extends Error {
    statusCode?: number;
  }