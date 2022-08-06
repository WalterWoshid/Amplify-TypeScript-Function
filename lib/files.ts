import { promises as fs } from 'fs';
import * as path from 'path'

export async function getFile(filePath: string, base64: boolean = false): Promise<string> {
  const file = await fs.readFile(path.resolve(__dirname, filePath));

  return base64 ? file.toString('base64') : file.toString();
}