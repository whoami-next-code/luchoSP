#!/usr/bin/env ts-node
import { promises as dns } from 'dns';

async function checkTxt(name: string, expectIncludes?: string[]) {
  try {
    const txt = await dns.resolveTxt(name);
    const flat = txt.map((arr) => arr.join('')).join(' ');
    const ok =
      !expectIncludes ||
      expectIncludes.every((v) => flat.toLowerCase().includes(v.toLowerCase()));
    return { ok, value: flat };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'resolveTxt_failed' };
  }
}

async function main() {
  const domain = process.env.RESEND_DOMAIN || 'whoamicode.com';
  console.log(`🔍 Verificando dominio Resend para: ${domain}\n`);

  // DKIM
  const dkimName = `resend._domainkey.${domain}`;
  const dkim = await checkTxt(dkimName, ['p=']);
  console.log(`DKIM (${dkimName}): ${dkim.ok ? '✅' : '❌'} ${dkim.value || dkim.error || ''}`);

  // SPF (subdominio send)
  const spfName = `send.${domain}`;
  const spf = await checkTxt(spfName, ['v=spf1']);
  console.log(`SPF (${spfName}): ${spf.ok ? '✅' : '❌'} ${spf.value || spf.error || ''}`);

  // DMARC
  const dmarcName = `_dmarc.${domain}`;
  const dmarc = await checkTxt(dmarcName, ['v=dmarc1']);
  console.log(`DMARC (${dmarcName}): ${dmarc.ok ? '✅' : '❌'} ${dmarc.value || dmarc.error || ''}`);

  // MX del subdominio send
  try {
    const mx = await dns.resolveMx(spfName);
    console.log(`MX (${spfName}): ✅ ${mx.map((m) => `${m.exchange} (prio ${m.priority})`).join(', ')}`);
  } catch (e: any) {
    console.log(`MX (${spfName}): ❌ ${e?.message || 'resolveMx_failed'}`);
  }

  console.log('\n📌 Si DKIM, SPF y DMARC están en ✅, el dominio está listo para enviar.');
  console.log('   Configura el remitente como RESEND_FROM_EMAIL y autentica desde Resend.\n');
}

main().catch((e) => {
  console.error('Error fatal:', e?.message || e);
  process.exit(1);
});
