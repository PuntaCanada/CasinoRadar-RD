import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, rename, writeFile } from 'node:fs/promises';
import { hostname } from '../domain.mjs';
import * as source from './sources.mjs';

const curl = promisify(execFile);
const path = new URL('../data/snapshot.json', import.meta.url);
const snapshot = JSON.parse(await readFile(path, 'utf8'));
const checkedAt = new Date().toISOString();

export function plain(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/&(?:amp|quot|apos|nbsp|#\d+|#x[0-9a-f]+);/gi, entity => {
    const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&nbsp;': ' ' };
    if (named[entity]) return named[entity];
    const hexadecimal = entity[2]?.toLowerCase() === 'x';
    const code = Number.parseInt(entity.slice(hexadecimal ? 3 : 2, -1), hexadecimal ? 16 : 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' ';
  }).replace(/\s+/g, ' ').trim();
}

export function domainList(content, kind) {
  // Only import cells in a table with an explicit domain column for the DGJA register.
  // For the DCJA warning page, read list items from its editorial content.
  const entries = [];
  if (kind === 'registry') {
    for (const table of content.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)) {
      const rows = [...table[1].matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)];
      const cells = row => [...row.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(match => plain(match[1]));
      const first = rows.shift();
      const column = first ? cells(first[1]).findIndex(value => /^(dominio|sitio web|página web|url)$/i.test(value)) : -1;
      if (column < 0) continue;
      for (const row of rows) entries.push(cells(row[1])[column] ?? '');
    }
  } else {
    const body = content.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? '';
    if (!/operadores no autorizados/i.test(body)) throw new Error('Missing warnings heading');
    for (const list of body.matchAll(/<ol\b[^>]*>([\s\S]*?)<\/ol>/gi)) {
      for (const item of list[1].matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)) entries.push(plain(item[1]));
    }
  }
  const records = [...new Set(entries.map(hostname).filter(Boolean))].sort();
  if (!records.length || (kind === 'warnings' && records.length < 10)) throw new Error('No recognized official domain list');
  return records;
}

export function newsItems(payload) {
  if (!Array.isArray(payload) || !payload.length) throw new Error('Empty DGJA news feed');
  const records = new Map();
  for (const item of payload) {
    const link = new URL(item.link);
    if (link.origin !== 'https://dgja.gob.do' || !/^\/noticias\/[^/]+\/$/.test(link.pathname)) throw new Error('Unexpected DGJA news URL');
    const date = item.date_gmt?.slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date))) throw new Error('Invalid DGJA publication date');
    const title = plain(item.title.rendered);
    if (!title) throw new Error('Missing DGJA title');
    const documents = [...new Set([...item.content.rendered.matchAll(/href="(https:\/\/dgja\.gob\.do\/wp-content\/uploads\/[^"<> ]+\.pdf)"/gi)].map(match => match[1]))];
    records.set(link.pathname, { title, date, url: link.origin + link.pathname, documents });
  }
  return [...records.values()].sort((a, b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url));
}

async function download(url) {
  const { stdout } = await curl('curl', ['--fail', '--silent', '--show-error', '--max-time', '24',
    '--retry', '1', '--max-filesize', '4000000', url], { maxBuffer: 4_100_000, timeout: 55_000 });
  return stdout;
}

async function refresh(key, load) {
  try {
    const records = await load();
    if (key !== 'news' && records.length < snapshot[key].records.length / 2) throw new Error('Unexpected drop in records');
    snapshot[key] = { ...snapshot[key], status: 'ok', records, retrievedAt: checkedAt, checkedAt };
    console.log(key + ': ' + records.length + ' records');
  } catch (error) {
    snapshot[key] = { ...snapshot[key], status: 'unavailable', checkedAt };
    console.warn(key + ': ' + error.message.split('\n')[0]);
  }
}

if (process.argv[1] && new URL(import.meta.url).pathname === process.argv[1]) {
  await Promise.all([
    refresh('news', async () => newsItems(JSON.parse(await download(source.newsApi)))),
    refresh('registry', async () => {
      const payload = JSON.parse(await download(source.registryApi));
      const page = payload.length === 1 && payload[0];
      if (page.link !== source.registry) throw new Error('Unexpected register');
      const content = page.content.rendered;
      if (/en construcci[oó]n|en mantenimiento/i.test(plain(content))) throw new Error('DGJA register under construction');
      if (!/juegos de azar por internet|juegos (en l[ií]nea|por internet)/i.test(plain(content))) throw new Error('Missing online gambling scope');
      return domainList(content, 'registry');
    }),
    refresh('warnings', async () => domainList(await download(source.warnings), 'warnings'))
  ]);
  const temporary = new URL('../data/snapshot.tmp', import.meta.url);
  await writeFile(temporary, JSON.stringify(snapshot, null, 2) + '\n');
  await rename(temporary, path);
  if (snapshot.news.status !== 'ok' && process.env.RADAR_REQUIRE_NEWS) process.exitCode = 1;
}
