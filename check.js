import { fresh, hostname, lookup } from './domain.mjs';

const translations = Object.fromEntries([...document.querySelectorAll('#messages [data-key]')]
  .map(element => [element.dataset.key, element.textContent]));
const form = document.querySelector('#check');
const field = document.querySelector('#domain');
const submit = document.querySelector('#submit');
const result = document.querySelector('#result');
const evidence = document.querySelector('#evidence');
const dateFormat = new Intl.DateTimeFormat(document.documentElement.lang, {
  dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Santo_Domingo'
});
let snapshot;

function stamp(value) {
  return dateFormat.format(new Date(value)) + ' (AST)';
}

function addSource(parent, source, label) {
  if (parent.childNodes.length) parent.append(' · ');
  const link = document.createElement('a');
  link.href = source.url;
  link.textContent = label;
  parent.append(link);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  evidence.replaceChildren();
  const domain = hostname(field.value);
  if (!domain) {
    field.setAttribute('aria-invalid', 'true');
    result.textContent = translations.invalid;
    result.dataset.state = 'unavailable';
    return;
  }
  field.removeAttribute('aria-invalid');
  const state = snapshot ? lookup(domain, snapshot) : 'unavailable';
  result.dataset.state = state;
  result.textContent = domain + ' — ' + translations[state];
  if (!snapshot) return;
  const archived = snapshot.archive.filter(item => item.domains.includes(domain));
  for (const source of [snapshot.registry, snapshot.warnings]) {
    if (source.records.includes(domain)) addSource(evidence, source, translations.proof + ' · ' + stamp(source.retrievedAt));
  }
  for (const item of archived) addSource(evidence, item, item.reference + ' · ' + item.date);
});

field.addEventListener('input', () => {
  field.removeAttribute('aria-invalid');
  result.textContent = translations.pending;
  delete result.dataset.state;
  evidence.replaceChildren();
});

function updateStatus() {
  for (const element of document.querySelectorAll('[data-source]')) {
    const source = snapshot?.[element.dataset.source];
    const status = fresh(source) ? 'statusOk' : source?.retrievedAt ? 'statusStale' : 'statusUnavailable';
    const notes = [translations[status]];
    if (source?.checkedAt) notes.push(translations.checked + ' · ' + stamp(source.checkedAt));
    if (source?.retrievedAt) notes.push(translations.retrieved + ' · ' + stamp(source.retrievedAt));
    element.textContent = notes.join(' — ');
  }
  document.querySelector('#news-stale').hidden = fresh(snapshot?.news);
  const panel = document.querySelector('#active-warnings');
  panel.replaceChildren();
  if (fresh(snapshot?.warnings)) {
    const list = document.createElement('ul');
    for (const domain of snapshot.warnings.records) {
      const item = document.createElement('li');
      item.textContent = domain;
      list.append(item);
    }
    panel.append(list);
  }
}

try {
  const response = await fetch('/data/snapshot.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error('Snapshot unavailable');
  const payload = await response.json();
  if (![payload.registry, payload.warnings, payload.news].every(source => Array.isArray(source?.records)) ||
      !Array.isArray(payload.archive)) throw new Error('Invalid snapshot');
  snapshot = payload;
} catch {
  result.textContent = translations.unavailable;
}
updateStatus();
submit.disabled = false;
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    updateStatus();
    if (result.dataset.state) form.requestSubmit();
  }
});
