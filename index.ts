import { getHandler, lambdaResponse } from './lib/response';

try {
  // Your code goes here
  const message = 'Hello World';



  lambdaResponse(
    { message: message }, 
    200
  );
} catch (e) {
  // Handle error
  lambdaResponse(
    { message: e.message }, 
    e.statusCode ?? 500, 
    e.stack
  );
}

// This is the handler that AWS Lambda will call
// Keep it at the bottom of the file
module.exports.handler = getHandler();