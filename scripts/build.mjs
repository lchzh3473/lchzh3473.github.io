import fs from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
const dir = fileURLToPath(new URL('.', import.meta.url));
const source = resolve(dir, '../public');
const target = resolve(dir, '../dist');
// fs.rmSync(target, { recursive: true, force: true });
// fs.mkdirSync(target);
fs.cpSync(source, target, { recursive: true });
