import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { localizedTitle } from './titles.mjs';
await mkdir('screenshots', {recursive:true});
const browser = await chromium.launch({headless:true});
try {
  for (const width of [360,390,430]) {
    for (const lang of ['es','en','de','fr','it']) {
      const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://127.0.0.1:8000/'+(lang==='es'?'':lang+'/'),{waitUntil:'networkidle'});
      assert.equal(await page.locator('html').getAttribute('lang'),lang);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      const foreign=page.locator('#legal h3[lang="es"], #news h3[lang="es"]');
      if(lang!=='es') {
        for(const el of await foreign.all()) {
          assert.equal(await el.evaluate(e=>e.nextElementSibling?.hasAttribute('data-translation-pending')),true);
        }
        assert.ok(await page.locator('#legal h3').filter({hasText:localizedTitle('Ley núm. 86-26',lang).text}).count());
      }
      assert.deepEqual(errors,[]);
      await page.screenshot({path:'screenshots/'+lang+'-'+width+'.png',fullPage:true});
      await page.close();
    }
  }
} finally { await browser.close(); }
