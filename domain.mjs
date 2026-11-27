// Compare DNS hostnames only. Preserve every subdomain, including www.
export function hostname(input) {
  const text = input.trim();
  if (!text || /[\s\\@%]/u.test(text)) return null;
  const address = /^https?:\/\//i.test(text) ? text : 'https://' + text;
  if (!/^https?:\/\/[^/:?#]+(?:[/?#]|$)/i.test(address)) return null;
  try {
    const host = new URL(address).hostname.replace(/\.$/, '');
    if (host.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(host)) return null;
    return host;
  } catch {
    return null;
  }
}

export function fresh(source, now = Date.now()) {
  const checked = Date.parse(source?.checkedAt);
  const retrieved = Date.parse(source?.retrievedAt);
  return source?.status === 'ok' && Number.isFinite(retrieved) &&
    retrieved <= checked && checked <= now && now - retrieved < 72 * 3600_000;
}

export function lookup(domain, data, now = Date.now()) {
  const registry = data.registry.records.includes(domain);
  const warning = data.warnings.records.includes(domain);
  const warningCurrent = warning && fresh(data.warnings, now);
  const registryCurrent = registry && fresh(data.registry, now);
  if (warning && registry) return 'conflict';
  if (warningCurrent) return 'warning';
  if (warning || data.archive.some(document => document.domains.includes(domain))) return 'historical';
  if (registryCurrent) return 'listed';
  if (registry || !fresh(data.registry, now) || !fresh(data.warnings, now)) return 'unavailable';
  return 'unknown';
}
