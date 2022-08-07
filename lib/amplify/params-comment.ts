import { existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';

const commentStart = '/* Amplify Params - DO NOT EDIT';
const commentEnd = 'Amplify Params - DO NOT EDIT */';

export function generateAmplifyComment() {
  const js = resolve(dirname(__dirname), 'index.js');
  const ts = resolve(dirname(__dirname), 'index.ts');
  if (existsSync(js) && hasAmplifyComment(js)) {
    return getAmplifyComment(js);
  } else if (existsSync(ts) && hasAmplifyComment(ts)) {
    return getAmplifyComment(ts);
  }

  return '';
}

// Starts with '/* Amplify Params - DO NOT EDIT'
// Ends with 'Amplify Params - DO NOT EDIT */'
// There can be multiple of these comments
// Find the first one
function hasAmplifyComment(filePath: string) {
  const file = readFileSync(filePath, 'utf8');
  const start = file.indexOf(commentStart);
  const end = file.indexOf(commentEnd);
  return start !== -1 && end !== -1;
}

function getAmplifyComment(filePath: string) {
  const file = readFileSync(filePath, 'utf8');
  const start = file.indexOf(commentStart);
  const end = file.indexOf(commentEnd);
  return file.substring(start, end + commentEnd.length);
}