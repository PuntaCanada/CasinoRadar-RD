# CasinoRadar RD

Independent gambling regulation and consumer information for the Dominican Republic, in Spanish, English, German, French and Italian. The site has no advertising, operator links or analytics. Requests are compared locally by exact DNS hostname, preserving all subdomains.

## Run and verify

Requires Node.js 22+ and curl. Cloudflare Pages serves the committed static site, with no server runtime or build dependency.

```sh
node scripts/import.mjs
node scripts/build.mjs
node --test scripts/*.test.mjs
python3 -m http.server 8000
```

The Radar workflow tests generated files and refreshes the public snapshot on the production branch once a day, or on manual dispatch. Each source has an attempt timestamp, a last successful download timestamp and a status. The importer rejects unrecognised layouts and keeps the last good copy when a source fails. A failed read or a copy older than 72 hours cannot establish a current domain match. Scheduled jobs rely on GitHub Actions and the existing Cloudflare Pages Git integration.

## Sources and scope

- DGJA news and PDFs linked by the DGJA news feed are imported via its official WordPress API. The legal radar dates imported PDFs by their announcement publication date. Older statutory entries link to the legislature or Ministry.
- The new DGJA online register is under construction as of the first import. The adapter accepts an explicit online-gambling table with a domain column. A replacement format will need an adapter update.
- The DCJA warning page is currently inaccessible to this environment. The February 2025 signed warning is separately archived, with the hostname spellings as published and duplicate hostnames removed. It describes the authority’s position at publication. It cannot establish a present licence or warning. The portal links to official channels to clarify current status.
- Source times displayed on the portal use Santo Domingo time. Authority titles stay in the original Spanish and are marked with their language.
