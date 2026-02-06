import * as fs from 'fs';
import Handlebars from 'handlebars';
import * as path from 'path';

const TEMPLATES_DIR = path.join(__dirname, '..', 'email-templates');

export function renderEmailTemplate(
  templateName: 'welcome' | 'new-article',
  lang: string,
  data: Record<string, unknown>,
): string {
  const filename = `${templateName}-${lang}.hbs`;
  const filepath = path.join(TEMPLATES_DIR, filename);
  const raw = fs.readFileSync(filepath, 'utf-8');
  const template = Handlebars.compile(raw);
  return template(data);
}
