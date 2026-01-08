// Simple verification script for catalog routing under Next.js
const assert = (cond, msg) => { if (!cond) { throw new Error(msg) } }

async function check(url, contains) {
  const res = await fetch(url)
  assert(res.ok, `HTTP ${res.status} for ${url}`)
  const text = await res.text()
  if (contains) assert(text.includes(contains), `Missing '${contains}' in ${url}`)
  return true
}

async function main() {
  // La ruta principal debe renderizar el iframe hacia el catálogo
  await check('http://localhost:3000/catalogo/', '<iframe')
  // Los recursos del catálogo deben servirse bajo el subpath
  await check('http://localhost:3000/catalogo/src/main.tsx')
  console.log('OK: catálogo bajo http://localhost:3000/catalogo y recursos mapeados')
}

main().catch(err => { console.error(err); process.exit(1) })
