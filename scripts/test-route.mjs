import { readFileSync } from 'node:fs'
const token = process.argv[2] || readFileSync('/tmp/student-token.txt', 'utf8').trim()
const BASE = 'http://localhost:3002'
const PORT = 9222

async function getWsUrl() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json`)
  const targets = await res.json()
  return targets.find(t => t.type === 'page').webSocketDebuggerUrl
}

const ws = new WebSocket(await getWsUrl())
let id = 0
const pending = new Map()
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
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result)
  }
}
await new Promise(r => ws.onopen = r)

async function evalJs(expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (res.exceptionDetails) console.log('EVAL ERR:', JSON.stringify(res.exceptionDetails).slice(0, 200))
  return res.result.value
}
async function navigate(url) {
  await send('Page.navigate', { url })
  await new Promise(r => setTimeout(r, 5000))
}

await navigate(BASE + '/login')
await send('Network.enable')
await send('Network.setCookie', { name: 'eh_token', value: token, url: BASE, path: '/' })
await evalJs(`localStorage.setItem('eh_token', ${JSON.stringify(token)})`)

await navigate(BASE + '/siswa/blog')
await new Promise(r => setTimeout(r, 2500))

const info = await evalJs(`
  (() => {
    const app = document.querySelector('#__nuxt')?.__vue_app__
    const router = app?.config?.globalProperties?.$router
    if (!router) return 'NO ROUTER'
    const r = router.getRoutes().find(x => x.name === 'siswa-blog-slug')
    const comp = r?.components?.default
    return {
      path: r?.path,
      compIsString: typeof comp,
      compDesc: typeof comp === 'string' ? comp : (comp ? 'function' : null),
      hasChildren: !!(r?.children?.length),
      parentChildren: router.getRoutes().find(x => x.name === 'siswa-blog')?.children?.map(c => ({ name: c.name, path: c.path }))
    }
  })()
`)
console.log(JSON.stringify(info, null, 2))

ws.close(); process.exit(0)
