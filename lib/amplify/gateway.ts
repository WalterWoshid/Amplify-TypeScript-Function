import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context } from 'aws-lambda';

// Add cors header
const cors = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*"
  }
};

export function lambdaHandler(lambdaHandlerCallback: LambdaHandlerCallback): APIGatewayProxyHandler {
  return async (event, context, callback) => {
    const handlerResult = await lambdaHandlerCallback(event, context);

    const result = {
      statusCode: handlerResult.statusCode || 200,
      body: JSON.stringify(handlerResult.message),
      stack: handlerResult.stack,
      ...cors,
    };

    callback(null, result);

    return result;
  };
}

type LambdaHandlerCallback = (
  event: APIGatewayProxyEvent,
  context: Context
) => Promise<LambdaResponse>;

type LambdaResponse = {
  message: any,
  statusCode?: number,
  stack?: string
}

export function handleError(error: ErrorWithStatusCode): LambdaResponse {
  return {
    message: error.message,
    statusCode: error.statusCode || 500,
    stack: error.stack
  };
}