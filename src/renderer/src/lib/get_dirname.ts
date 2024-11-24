import { fileURLToPath } from 'url';
import { dirname } from 'path';

function getDirname(importMetaUrl) {
  const filename = fileURLToPath(importMetaUrl);
  return dirname(filename);
}
const __dirname = getDirname(import.meta.url);