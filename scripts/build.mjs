import { readFile, writeFile } from 'node:fs/promises';
import { copy } from './copy.mjs';
import { registry, warnings, news } from './sources.mjs';

const origin = 'https://casinoradar-rd.pages.dev';
const urls = { es: '/', en: '/en/', de: '/de/', fr: '/fr/', it: '/it/' };
const names = { es: 'Español', en: 'English', de: 'Deutsch', fr: 'Français', it: 'Italiano' };
const snapshot = JSON.parse(await readFile(new URL('../data/snapshot.json', import.meta.url), 'utf8'));
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const link = (url, label) => `<a href="${escape(url)}">${escape(label)} <span aria-hidden="true">↗</span></a>`;
const alternates = Object.entries(urls).map(([locale, path]) => `<link rel="alternate" hreflang="${locale}" href="${origin + path}">`).join('\n');
const anchors = [['warnings', 'warnings'], ['legal', 'legal'], ['news', 'news'], ['protection', 'protection']];
const legal = [
  ['Ley núm. 86-26', '2026-09-22', 'https://diputadosrd.gob.do/sil/iniciativa/158517'],
  ['Resolución núm. 184-2026 · Sistema Nacional de Autoexclusión', '2026-05-05', 'https://www.hacienda.gob.do/marco-legal/resolucion-num-184-2026/'],
  ['Resolución núm. 136-2024 · Juegos de Azar por Internet', '2024-03-26', 'https://www.hacienda.gob.do/marco-legal/resolucion-num-136-2024/']
];

for (const [lang, t] of Object.entries(copy)) {
  const formatDate = date => new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(date));
  const date = value => `<time datetime="${escape(value)}">${escape(formatDate(value))}</time>`;
  const articles = snapshot.news.records.slice(0, 8).map(item => `<li><p class="stamp">${date(item.date)}</p><h3 lang="es">${escape(item.title)}</h3>${link(item.url, t.more)}</li>`).join('\n');
  const onlineLegal = snapshot.news.records.flatMap(item => item.documents.map((url, i) => [item.documents.length === 1 ? item.title : item.title + ' (' + (i + 1) + ')', item.date, url]));
  const documents = [...new Map(onlineLegal.map(item => [item[2], item])).values(), ...legal];
  const docs = documents.map(([title, day, url]) => `<li><p class="stamp">${date(day)}</p><h3 lang="es">${escape(title)}</h3>${link(url, t.proof)}</li>`).join('\n');
  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(t.check)} · CasinoRadar RD</title>
<meta name="description" content="${escape(t.intro)}">
<link rel="canonical" href="${origin + urls[lang]}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${origin}/">
<meta property="og:title" content="${escape(t.hero)} · CasinoRadar RD">
<meta property="og:description" content="${escape(t.intro)}">
<meta property="og:url" content="${origin + urls[lang]}">
<meta property="og:type" content="website">
<meta name="theme-color" content="#102923">
<link rel="icon" href="/radar.svg" type="image/svg+xml">
<link rel="stylesheet" href="/style.css">
<script type="module" src="/check.js"></script>
</head>
<body>
<a class="skip" href="#main">${t.skip}</a>
<header class="top"><div class="wrap masthead">
<a class="brand" href="${urls[lang]}"><img src="/radar.svg" alt="" width="35" height="35"> CasinoRadar <span>RD</span></a>
<nav class="languages" aria-label="Idioma / Language">${Object.entries(urls).map(([locale, path]) => `<a href="${path}" lang="${locale}" hreflang="${locale}" aria-label="${names[locale]}"${lang === locale ? ' aria-current="page"' : ''}>${locale.toUpperCase()}</a>`).join('')}</nav>
</div></header>
<main id="main">
<div class="hero"><div class="wrap hero-grid">
<div class="hero-copy"><p class="country">${t.country}</p><h1>${t.hero}</h1><p>${t.intro}</p></div>
<section class="lookup" id="lookup" aria-labelledby="lookup-title"><h2 id="lookup-title">${t.check}</h2>
<form id="check">
<label for="domain">${t.label}</label><div class="controls"><input id="domain" required maxlength="2048" type="text" inputmode="url" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="example.com"><button id="submit" disabled>${t.submit}</button></div>
</form>
<p class="micro">${t.privacyHint}</p>
<p id="result" role="status">${t.pending}</p>
<p id="evidence"></p>
${link(registry, t.fallback)}
<noscript><p>${t.unavailable}</p></noscript>
</section></div></div>
<div class="wrap content">
<nav class="sections" aria-label="CasinoRadar RD">${anchors.map(([id, key]) => `<a href="#${id}">${t[key]} <span aria-hidden="true">↓</span></a>`).join('')}</nav>
<div class="columns">
<section class="panel warnings" id="warnings"><h2>${t.warnings}</h2><p data-source="warnings"></p>
<h3>${t.archive}</h3><p>${t.archiveNote}</p>
<ul class="archive">${snapshot.archive.map(item => `<li>${date(item.date)} · ${link(item.url, item.reference)}</li>`).join('')}</ul>
<div id="active-warnings"></div>
<p>${link(warnings, t.proof)}</p></section>
<section class="panel player" id="protection"><h2>${t.protection}</h2><p>${t.helpText}</p><ul class="resources">
<li>${link('https://www.casinos.gob.do/juego-responsable/herramientas-de-ayuda-y-soporte/', t.help)}</li>
<li>${link('https://www.casinos.gob.do/juego-responsable/formulario-de-autoexclusion/', t.self)}<p>${t.selfText}</p></li>
<li>${link('https://www.casinos.gob.do/denuncias-y-sugerencias/', t.complaint)}<p>${t.complaintText}</p></li>
</ul></section>
</div>
<section class="panel feed" id="legal"><h2>${t.legal}</h2><p>${t.original}</p><ol class="items">${docs}</ol></section>
<section class="panel feed" id="news"><h2>${t.news}</h2><p>${t.original}</p>
<p data-source="news"></p><p id="news-stale" hidden>${t.stale}</p>
<ol class="items">${articles}</ol><p>${link(news, t.publications)}</p></section>
<section class="panel" id="sources"><h2>${t.sources}</h2><h3>${t.method}</h3><p>${t.methodText}</p>
<ul class="source-list">
<li>${link(registry, t.fallback)}<p data-source="registry"></p></li>
<li>${link(warnings, t.warnings)}<p data-source="warnings"></p></li>
<li>${link(news, t.publications)}<p data-source="news"></p></li>
</ul></section>
<section class="panel" id="privacy"><h2>${t.privacy}</h2><p>${t.privacyText}</p>${link('https://www.cloudflare.com/privacypolicy/', 'Cloudflare')}</section>
</div>
</main>
<footer><div class="wrap"><p class="brand">CasinoRadar <span>RD</span></p><p>${t.independence}</p><a href="#privacy">${t.privacy}</a></div></footer>
<div id="messages" hidden>${Object.entries(t).map(([key, value]) => `<span data-key="${key}">${escape(value)}</span>`).join('')}</div>
</body>
</html>
`;
  await writeFile(new URL('..' + urls[lang] + 'index.html', import.meta.url), html);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Object.values(urls).map(path => '  <url><loc>' + origin + path + '</loc></url>').join('\n')}\n</urlset>\n`;
await writeFile(new URL('../sitemap.xml', import.meta.url), sitemap);
