/** @jest-environment node */
import assert from 'node:assert'

const BASE = 'http://localhost:3000/catalogo/'

describe('Catálogo bajo /catalogo', () => {
  it('carga la página raíz del catálogo desde el dominio 3000', async () => {
    const res = await fetch(BASE)
    assert.strictEqual(res.ok, true)
    const html = await res.text()
    assert.ok(html.includes('<title>catalog</title>'))
  })

  it('sirve recursos estáticos relativos al catálogo', async () => {
    const res = await fetch('http://localhost:3000/catalogo/src/main.tsx')
    assert.strictEqual(res.ok, true)
    const body = await res.text()
    assert.ok(body.length > 0)
  })
})

