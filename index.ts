import { lambdaHandler } from '@/lib/gateway';
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
    // Handle error
    return {
      message: e.message,
      statusCode: 500,
      stack: e.stack
    };
  }
});