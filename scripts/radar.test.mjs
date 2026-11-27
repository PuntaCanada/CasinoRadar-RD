import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hostname, fresh, lookup } from '../domain.mjs';
import { domainList, newsItems } from './import.mjs';

const now = Date.parse('2026-11-27T10:00:00Z');
const iso = age => new Date(now - age * 3600_000).toISOString();
const source = (records, age = 1) => ({ records, status: 'ok', checkedAt: iso(age), retrievedAt: iso(age) });

test('normalize case, IDN and trailing DNS dot without collapsing www or other subdomains', () => {
  assert.equal(hostname(' https://WWW.Example.COM./path?q=1 '), 'www.example.com');
  assert.equal(hostname('bücher.example'), 'xn--bcher-kva.example');
  assert.equal(hostname('sub.example.com'), 'sub.example.com');
  for (const value of ['localhost', '127.0.0.1', 'https://example.com:443', 'https://example.com@other.com', 'ftp://example.com', 'example..com', '//example.com', 'https:///example.com', 'ex%61mple.com', 'example.com\\other.com']) {
    assert.equal(hostname(value), null, value);
  }
});

test('reject stale, future or failed source reads', () => {
  assert.equal(fresh(source([]), now), true);
  assert.equal(fresh(source([], 72), now), false);
  assert.equal(fresh(source([], -1), now), false);
  assert.equal(fresh({ ...source([]), status: 'unavailable' }, now), false);
  assert.equal(fresh({ ...source([]), checkedAt: iso(2) }, now), false);
});

test('distinguish exact, missing, historical and conflicting matches', () => {
  const data = {
    registry: source(['listed.example', 'both.example']),
    warnings: source(['warn.example', 'both.example']),
    archive: [{ domains: ['old.example'] }]
  };
  assert.equal(lookup('listed.example', data, now), 'listed');
  assert.equal(lookup('www.listed.example', data, now), 'unknown');
  assert.equal(lookup('listed.example.other.test', data, now), 'unknown');
  assert.equal(lookup('warn.example', data, now), 'warning');
  assert.equal(lookup('both.example', data, now), 'conflict');
  assert.equal(lookup('old.example', data, now), 'historical');
  data.registry = source(['listed.example'], 73);
  data.warnings = source(['warn.example'], 73);
  assert.equal(lookup('listed.example', data, now), 'unavailable');
  assert.equal(lookup('warn.example', data, now), 'historical');
  assert.equal(lookup('new.example', data, now), 'unavailable');
});

test('import only explicit source rows and deduplicate normalized domains', () => {
  const table = '<h2>Juegos de Azar por Internet</h2><table><tr><th>Nombre</th><th>Dominio</th></tr><tr><td>name.example</td><td>www.Example.com</td></tr><tr><td>Next</td><td>https://www.example.com/</td></tr></table>';
  assert.deepEqual(domainList(table, 'registry'), ['www.example.com']);
  assert.throws(() => domainList('<p>www.example.com</p>', 'registry'));
  assert.throws(() => domainList('<main>Access denied</main>', 'warnings'));
  assert.throws(() => domainList(table, 'warnings'));
  assert.deepEqual(domainList(table.replace('<h2>', '<h2>Sitios no autorizados de '), 'warnings'), ['www.example.com']);
  assert.throws(() => domainList(table.replace('www.Example.com', 'invalid'), 'registry'));
});

test('validate and deduplicate official items and their documents', () => {
  const pdf = 'https://dgja.gob.do/wp-content/uploads/2026/file.pdf';
  const item = {
    link: 'https://dgja.gob.do/noticias/test/',
    date_gmt: '2026-10-20T10:00:00',
    title: { rendered: 'Texto &amp; fecha' },
    content: { rendered: '<a href="' + pdf + '">PDF</a><a href="' + pdf + '">PDF</a>' }
  };
  assert.deepEqual(newsItems([item, item]), [{ date: '2026-10-20', title: 'Texto & fecha', url: item.link, documents: [pdf] }]);
  assert.throws(() => newsItems([{ ...item, link: 'https://example.com/noticias/test/' }]));
});

test('all five localized static pages have SEO and protected browser-only input', async () => {
  for (const lang of ['es', 'en', 'de', 'fr', 'it']) {
    const path = lang === 'es' ? '/' : '/' + lang + '/';
    const html = await readFile(new URL('..' + path + 'index.html', import.meta.url), 'utf8');
    assert.ok(html.includes('<html lang="' + lang + '">'));
    assert.ok(html.includes('<link rel="canonical" href="https://casinoradar-rd.pages.dev' + path + '">'));
    assert.equal([...html.matchAll(/rel="alternate" hreflang=/g)].length, 6);
    assert.match(html, /<input id="domain" (?![^>]*name=)/);
    for (const id of ['warnings', 'legal', 'news', 'protection', 'privacy', 'sources']) assert.ok(html.includes('id="' + id + '"'));
  }
});
