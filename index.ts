import { lambdaHandler, handleError } from '@/lib/amplify/gateway';
import '@/lib/extensions';

module.exports.handler = lambdaHandler(async (event, context) => {
  console.log(`Event: ${JSON.stringifyPretty(event)}`);
  console.debug(`Context: ${JSON.stringifyPretty(context)}`);

  try {
    // Your code here
    const message = 'Hello World';

    return {
      message: message,
      statusCode: 200
    };
  } catch (e) {
    return handleError(e);
  }
});