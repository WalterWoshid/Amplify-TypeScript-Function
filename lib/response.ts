import { APIGatewayProxyHandler } from 'aws-lambda';

// Add cors header
export const cors = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  }
};

let _body: Object;
let _statusCode: number;
let _stack: string;

export function lambdaResponse(body: Object, statusCode: number = 200, stack?: string) {
  _body = body;
  _statusCode = statusCode;
  _stack = stack;
}

export function getHandler(): APIGatewayProxyHandler {
  return async (event, _context, callback) => {
    console.log(`Event: ${JSON.stringify(event, null, 2)}`);

    const result = {
      statusCode: _statusCode,
      body: JSON.stringify(_body),
      stack: _stack,
      ...cors,
    };

    callback(null, result);

    return result;
  };
}