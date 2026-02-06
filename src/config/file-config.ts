import * as fs from 'fs';
import * as path from 'path';

export function readConfigFile<T>(filename: string, configDir: string): T | null {
  const filePath = path.join(configDir, filename);
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
