/* Writes src/content/carbon.json: the grams of CO2e per byte transferred
   and the A+–F rating scale, from CO2.js (Green Web Foundation), using the
   Sustainable Web Design model v4. Computed at build time so the browser
   ships two numbers, not the library. The model is linear in bytes, so one
   factor is exact.

   Assumptions, stated on the site too: global-average grid intensity and
   standard (not verified green) hosting. If the host is ever verified by
   the Green Web Foundation, set GREEN_HOSTING=1 to use the green figure. */
import { writeFileSync, readFileSync } from 'node:fs'
import { co2 } from '@tgwf/co2'

const green = process.env.GREEN_HOSTING === '1'
const model = new co2({ model: 'swd', version: 4 })
const rated = new co2({ model: 'swd', version: 4, rating: true })
const perMB = model.perByte(1_000_000, green)
const { version } = JSON.parse(readFileSync(new URL('../node_modules/@tgwf/co2/package.json', import.meta.url), 'utf8'))

// Grams per page view at the top of each band (SWD v4 rating scale).
const scale = [
  ['A+', 0.04],
  ['A', 0.079],
  ['B', 0.145],
  ['C', 0.209],
  ['D', 0.278],
  ['E', 0.359],
  ['F', null],
]
for (const [grade, max] of scale.slice(0, -1)) {
  const r = rated.perByte(Math.floor((max / perMB) * 1_000_000) - 1, green)
  if (r.rating !== grade) throw new Error(`rating scale drifted: expected ${grade}, CO2.js says ${r.rating}`)
}

const out = {
  model: 'Sustainable Web Design v4',
  library: `CO2.js ${version}`,
  greenHosting: green,
  gramsPerByte: perMB / 1_000_000,
  scale: scale.map(([grade, max]) => ({ grade, max })),
}
writeFileSync(new URL('../src/content/carbon.json', import.meta.url), JSON.stringify(out, null, 2) + '\n')
console.log(`carbon: ${perMB.toFixed(4)} g CO2e per MB (${out.model}, ${green ? 'green' : 'standard'} hosting)`)
