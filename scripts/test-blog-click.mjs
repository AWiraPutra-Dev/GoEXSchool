// Quick CDP test: verify student can open a blog article.
// Usage: node scripts/test-blog-click.mjs <token>
import { readFileSync } from 'node:fs'

const token = process.argv[2] || readFileSync('/tmp/student-token.txt', 'utf8').trim()
const BASE = 'http://localhost:3002'
const PORT = 9222

async function getWsUrl() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json`)
  const targets = await res.json()
  const page = targets.find(t => t.type === 'page')
  return page.webSocketDebuggerUrl
}

const ws = new WebSocket(await getWsUrl())
let id = 0
const pending = new Map()
const logs = []

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const msgId = ++id
    pending.set(msgId, { resolve, reject })
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })
}

ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data)
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id)
    pending.delete(msg.id)
    if (msg.error) reject(new Error(msg.error.message))
    else resolve(msg.result)
  } else if (msg.method === 'Runtime.consoleAPICalled') {
    const args = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ')
    logs.push(`[console.${msg.params.type}] ${args}`)
  } else if (msg.method === 'Runtime.exceptionThrown') {
    logs.push(`[exception] ${msg.params.exceptionDetails.text} ${msg.params.exceptionDetails.exception?.description || ''}`)
  } else if (msg.method === 'Log.entryAdded') {
    logs.push(`[log.${msg.params.entry.level}] ${msg.params.entry.text}`)
  }
}

await new Promise(r => ws.onopen = r)
await send('Runtime.enable')
await send('Log.enable')

async function evalJs(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (res.exceptionDetails) console.log('EVAL ERR:', JSON.stringify(res.exceptionDetails).slice(0, 300))
  return res.result.value
}

async function navigate(url) {
  await send('Page.navigate', { url })
  await new Promise(r => setTimeout(r, 3000))
}

await navigate(BASE + '/login')
await send('Network.enable')
await send('Network.setCookie', { name: 'eh_token', value: token, url: BASE, path: '/' })
await evalJs(`localStorage.setItem('eh_token', ${JSON.stringify(token)})`)

await navigate(BASE + '/siswa/blog')
await new Promise(r => setTimeout(r, 2500))
const cardHref = await evalJs(`document.querySelector('a.article-card')?.getAttribute('href') || null`)
console.log('FIRST ARTICLE HREF:', cardHref)

await evalJs(`document.querySelector('a.article-card').click()`)
await new Promise(r => setTimeout(r, 5000))

console.log('URL after click:', await evalJs('location.href'))
const routeName = await evalJs(`
  (() => {
    const app = document.querySelector('#__nuxt')?.__vue_app__
    const router = app?.config?.globalProperties?.$router
    return router ? router.currentRoute.value.name : 'NO ROUTER'
  })()
`)
console.log('ROUTE NAME:', routeName)
console.log('DETAIL TITLE:', JSON.stringify(await evalJs(`document.querySelector('h1.article-title')?.textContent || ''`)))

console.log('=== LOGS ===')
for (const l of logs) console.log(l)

ws.close()
process.exit(0)
