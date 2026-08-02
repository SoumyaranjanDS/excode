import satori from 'satori';
import { html } from 'satori-html';

async function testUrl(url) {
  try {
    const res = await fetch(url);
    if(!res.ok) { console.log(url, 'FAILED HTTP', res.status); return; }
    const buf = await res.arrayBuffer();
    const str = Buffer.from(buf).toString('utf8', 0, 4);
    if(str.startsWith('<!DO')) { console.log(url, 'RETURNED HTML'); return; }
    
    await satori(html`<div>Test</div>`, {
      width: 100, height: 100,
      fonts: [{name: 'Inter', data: buf, weight: 700, style: 'normal'}]
    });
    console.log(url, 'SUCCESS');
  } catch(e) {
    console.log(url, 'ERROR:', e.message.substring(0, 50));
  }
}

async function run() {
  await testUrl('https://unpkg.com/@fontsource/inter/files/inter-latin-700-normal.woff');
  await testUrl('https://raw.githubusercontent.com/rsms/inter/master/docs/font-files/Inter-Bold.otf');
}
run();
